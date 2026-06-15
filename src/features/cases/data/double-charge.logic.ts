import type { NodeHandler } from "@/shared/lib/flow-engine/types";

export type GuardMode = "broken" | "fixed";

export type Charge = { amount: number; key: string };

// The mutable world every node shares during one run. This is where the bug
// becomes real: `charges` is what the customer is billed, `processedKeys` is the
// idempotency store the guard reads and writes.
export type PaymentWorld = {
	processedKeys: Set<string>;
	charges: Charge[];
};

type PaymentRequest = { amount: number; key: string; retry: boolean };

const ORDER_AMOUNT = 600;
// One checkout mints one idempotency key; a network retry reuses the SAME key —
// that is exactly what the guard is supposed to catch.
const IDEMPOTENCY_KEY = "idem_4242";

const checkout: NodeHandler<PaymentWorld> = () => ({
	emit: [
		{
			output: {
				amount: ORDER_AMOUNT,
				key: IDEMPOTENCY_KEY,
				retry: false,
			} satisfies PaymentRequest,
		},
	],
	log: "order placed",
});

const intent: NodeHandler<PaymentWorld> = (input) => ({
	emit: [{ output: input }],
	log: "payment intent created",
});

const send: NodeHandler<PaymentWorld> = (input) => {
	const req = input as PaymentRequest;
	if (req.retry) {
		return {
			emit: [{ handle: "deliver", output: req }],
			log: "retried request delivered",
		};
	}
	// First attempt: the provider receives the request, but our response is lost,
	// so the same request will be retried with the same key.
	return {
		emit: [
			{ handle: "deliver", output: req },
			{ handle: "lost", output: { ...req, retry: true } satisfies PaymentRequest },
		],
		log: "sent — response lost",
	};
};

const providerProcess: NodeHandler<PaymentWorld> = (input) => ({
	emit: [{ output: input }],
	log: "provider charged the card",
});

const webhook: NodeHandler<PaymentWorld> = (input) => ({
	emit: [{ output: input }],
	log: "webhook received",
});

const timeout: NodeHandler<PaymentWorld> = (input) => ({
	emit: [{ output: input }],
	log: "timeout — provider retries",
});

const record: NodeHandler<PaymentWorld> = (input, { world }) => {
	const req = input as PaymentRequest;
	world.charges.push({ amount: req.amount, key: req.key });
	return { emit: [], log: `recorded charge #${world.charges.length}` };
};

const ignore: NodeHandler<PaymentWorld> = () => ({
	emit: [],
	log: "duplicate ignored",
});

// Broken: no check at all — every pass through the guard records a charge.
const guardBroken: NodeHandler<PaymentWorld> = (input) => ({
	emit: [{ handle: "new", output: input }],
	log: "no idempotency check",
});

// Fixed: remember the key on first sight, route any later duplicate to "ignore".
const guardFixed: NodeHandler<PaymentWorld> = (input, { world }) => {
	const req = input as PaymentRequest;
	if (world.processedKeys.has(req.key)) {
		return {
			emit: [{ handle: "duplicate", output: req }],
			log: `duplicate key ${req.key}`,
		};
	}
	world.processedKeys.add(req.key);
	return { emit: [{ handle: "new", output: req }], log: `new key ${req.key}` };
};

export function createPaymentWorld(): PaymentWorld {
	return { processedKeys: new Set(), charges: [] };
}

export function createPaymentHandlers(
	mode: string,
): Record<string, NodeHandler<PaymentWorld>> {
	return {
		checkout,
		intent,
		send,
		process: providerProcess,
		webhook,
		timeout,
		record,
		ignore,
		guard: mode === "broken" ? guardBroken : guardFixed,
	};
}
