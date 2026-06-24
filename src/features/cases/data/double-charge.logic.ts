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

type PaymentRequest = { amount: number; key: string; attempt: number };

const ORDER_AMOUNT = 600;
// One checkout mints one idempotency key; the retry reuses the SAME key — that is
// exactly what the guard is supposed to catch.
const IDEMPOTENCY_KEY = "idem_4242";

const checkout: NodeHandler<PaymentWorld> = () => ({
	emit: [
		{
			output: {
				amount: ORDER_AMOUNT,
				key: IDEMPOTENCY_KEY,
				attempt: 1,
			} satisfies PaymentRequest,
		},
	],
	log: "user taps Pay once",
});

const api: NodeHandler<PaymentWorld> = (input) => ({
	emit: [{ output: input }],
	log: "charge request received",
});

const intent: NodeHandler<PaymentWorld> = (input) => ({
	emit: [{ output: input }],
	log: "intent created with key",
});

// Broken: no check at all — every request that reaches the guard is charged.
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

// The point of no return: real money moves here, once per pass that reaches it.
const charge: NodeHandler<PaymentWorld> = (input, { world }) => {
	const req = input as PaymentRequest;
	world.charges.push({ amount: req.amount, key: req.key });
	return {
		emit: [{ output: req }],
		log: `card charged (#${world.charges.length})`,
	};
};

const record: NodeHandler<PaymentWorld> = (input) => ({
	emit: [{ output: input }],
	log: "ledger written",
});

// The first attempt's response is lost (→ network/retry); the retry's is fine.
const confirmResponse: NodeHandler<PaymentWorld> = (input) => {
	const req = input as PaymentRequest;
	if (req.attempt === 1) {
		return { emit: [{ handle: "lost", output: req }], log: "response lost" };
	}
	return { emit: [], log: "confirmed to client" };
};

// The failure node: the lost response makes the client retry with the SAME key.
const network: NodeHandler<PaymentWorld> = (input) => {
	const req = input as PaymentRequest;
	return {
		emit: [{ output: { ...req, attempt: 2 } satisfies PaymentRequest }],
		log: "timeout — client retries",
	};
};

const ignore: NodeHandler<PaymentWorld> = () => ({
	emit: [],
	log: "duplicate skipped",
});

export function createPaymentWorld(): PaymentWorld {
	return { processedKeys: new Set(), charges: [] };
}

export function createPaymentHandlers(
	mode: string,
): Record<string, NodeHandler<PaymentWorld>> {
	return {
		checkout,
		api,
		intent,
		guard: mode === "broken" ? guardBroken : guardFixed,
		charge,
		record,
		confirm: confirmResponse,
		network,
		ignore,
	};
}
