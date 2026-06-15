import { Button } from "@/shared/components/ui/button";

const ORDER_ITEMS = [
	{ name: "Pro Plan — Annual", price: "$480.00" },
	{ name: "Priority Support", price: "$120.00" },
];

const TOTAL = "$600.00";

export function CaseAppMockup() {
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

				<Button size="lg" className="w-full">
					Pay {TOTAL}
				</Button>

				{/* the symptom the case explains */}
				<div className="flex items-start gap-2.5 rounded-lg border border-destructive bg-destructive-surface px-3.5 py-3 text-sm text-destructive">
					<span aria-hidden>⚠</span>
					<div>
						<p className="font-medium">Charged twice — {TOTAL} ×2</p>
						<p className="text-destructive/80">A network retry submitted the payment again.</p>
					</div>
				</div>
			</div>
		</aside>
	);
}
