"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { useFlowRuntime } from "@/shared/flow-runtime";
import { cn } from "@/shared/lib/cn";
import type { GuardMode, PaymentWorld } from "../../data/double-charge.logic";

const ORDER_ITEMS = [
	{ name: "Pro Plan — Annual", price: "$480.00" },
	{ name: "Priority Support", price: "$120.00" },
];

const TOTAL = "$600.00";

const MODES: { value: GuardMode; label: string }[] = [
	{ value: "broken", label: "Broken" },
	{ value: "fixed", label: "Fixed" },
];

function modeButtonClass(active: boolean): string {
	return cn(
		"flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
		active
			? "bg-card text-foreground shadow-sm"
			: "text-muted-foreground hover:text-foreground",
	);
}

export function CaseAppMockup() {
	const { status, world, play, reset } = useFlowRuntime();
	const [mode, setMode] = useState<GuardMode>("broken");

	const payment = world as PaymentWorld | null;
	const chargeCount = payment?.charges.length ?? 0;
	const isRunning = status === "running";
	const isDone = status === "done";
	const isDoubleCharge = isDone && chargeCount > 1;
	const isSuccess = isDone && chargeCount === 1;
	const payLabel = isRunning ? "Processing…" : `Pay ${TOTAL}`;

	return (
		<aside className="flex w-96 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
			{/* browser chrome — signals "the real app" */}
			<div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2.5">
				<span className="h-3 w-3 rounded-full bg-destructive/60" />
				<span className="h-3 w-3 rounded-full bg-warning/60" />
				<span className="h-3 w-3 rounded-full bg-success/60" />
				<div className="ml-2 flex-1 truncate rounded-md bg-background px-3 py-1 text-[11px] text-muted-foreground">
					app.acme.pay/checkout
				</div>
			</div>

			{/* checkout screen */}
			<div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
				<div>
					<h2 className="text-lg font-semibold text-foreground">Checkout</h2>
					<p className="text-sm text-muted-foreground">Complete your purchase</p>
				</div>

				{/* order summary */}
				<div className="rounded-lg border border-border bg-background p-4">
					<div className="flex flex-col gap-2.5">
						{ORDER_ITEMS.map((item) => (
							<div key={item.name} className="flex justify-between text-sm">
								<span className="text-muted-foreground">{item.name}</span>
								<span className="text-foreground">{item.price}</span>
							</div>
						))}
					</div>
					<div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold">
						<span className="text-foreground">Total</span>
						<span className="text-foreground">{TOTAL}</span>
					</div>
				</div>

				{/* card form */}
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
						Card number
						<div className="rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground">
							4242 4242 4242 4242
						</div>
					</div>
					<div className="flex gap-3">
						<div className="flex flex-1 flex-col gap-1.5 text-xs font-medium text-muted-foreground">
							Expiry
							<div className="rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground">
								04 / 27
							</div>
						</div>
						<div className="flex flex-1 flex-col gap-1.5 text-xs font-medium text-muted-foreground">
							CVC
							<div className="rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground">
								123
							</div>
						</div>
					</div>
				</div>

				{/* which guard implementation the engine runs */}
				<div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
					{MODES.map((option) => (
						<button
							key={option.value}
							type="button"
							disabled={isRunning}
							onClick={() => setMode(option.value)}
							className={modeButtonClass(mode === option.value)}
						>
							Idempotency: {option.label}
						</button>
					))}
				</div>

				<Button
					size="lg"
					className="w-full"
					disabled={isRunning}
					onClick={() => play(mode)}
				>
					{payLabel}
				</Button>

				{isDoubleCharge && (
					<div className="flow-rise-in flex items-start gap-2.5 rounded-lg border border-destructive bg-destructive-surface px-3.5 py-3 text-sm text-destructive">
						<span aria-hidden>⚠</span>
						<div>
							<p className="font-medium">Charged twice — {TOTAL} ×2</p>
							<p className="text-destructive/80">
								A network retry submitted the payment again.
							</p>
						</div>
					</div>
				)}

				{isSuccess && (
					<div className="flow-rise-in flex items-start gap-2.5 rounded-lg border border-success/50 bg-success/10 px-3.5 py-3 text-sm text-success">
						<span aria-hidden>✓</span>
						<div>
							<p className="font-medium">Charged once — {TOTAL}</p>
							<p className="text-success/80">
								The retry hit the idempotency guard and was ignored.
							</p>
						</div>
					</div>
				)}

				{isDone && (
					<button
						type="button"
						onClick={reset}
						className="self-start text-xs text-muted-foreground underline-offset-2 hover:underline"
					>
						Reset
					</button>
				)}
			</div>
		</aside>
	);
}
