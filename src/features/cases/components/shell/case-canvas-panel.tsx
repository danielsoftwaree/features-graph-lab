import type { ReactNode } from "react";

const LEGEND = [
	{ label: "User Action", className: "bg-primary" },
	{ label: "Our System", className: "bg-success" },
	{ label: "External System", className: "bg-muted-foreground" },
	{ label: "Critical Component", className: "bg-warning" },
	{ label: "Failure Point", className: "bg-destructive" },
];

interface CaseCanvasPanelProps {
	canvas: ReactNode;
}

export function CaseCanvasPanel({ canvas }: CaseCanvasPanelProps) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border">
			{/* honest header — no fake tabs; zoom lives in the canvas Controls */}
			<div className="flex flex-col border-b border-border px-4 py-3">
				<span className="text-sm font-medium text-foreground">
					Payment pipeline
				</span>
				<span className="text-xs text-muted-foreground">
					Press Pay to watch the request flow through each step
				</span>
			</div>

			{/* canvas: real node graph */}
			<div className="relative min-h-0 flex-1">
				{canvas}

				{/* legend overlay */}
				<div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap items-center gap-3 rounded-md border border-border bg-background/80 px-3 py-2 text-[11px] text-muted-foreground backdrop-blur">
					{LEGEND.map((item) => (
						<span key={item.label} className="flex items-center gap-1.5">
							<span className={`h-2.5 w-2.5 rounded-sm ${item.className}`} />
							{item.label}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
