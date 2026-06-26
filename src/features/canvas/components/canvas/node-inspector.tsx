import { Play, RotateCcw, X } from "lucide-react";
import { useFlowRuntime } from "@/shared/flow-runtime";
import { cn } from "@/shared/lib/cn";
import type { FlowCategory, FlowNode } from "@/shared/types/flow";
import { ICON_STYLES } from "../flow-node";
import { CodeEditor } from "./code-editor";

const CATEGORY_BADGE: Record<
	FlowCategory,
	{ label: string; className: string }
> = {
	user: {
		label: "User action",
		className: "border-primary/30 bg-primary/10 text-primary",
	},
	system: {
		label: "Our system",
		className: "border-success/30 bg-success/10 text-success",
	},
	external: {
		label: "External",
		className: "border-border bg-muted text-muted-foreground",
	},
	critical: {
		label: "Critical",
		className: "border-warning/40 bg-warning-surface text-warning",
	},
	failure: {
		label: "Failure point",
		className: "border-destructive/40 bg-destructive-surface text-destructive",
	},
};

interface NodeInspectorProps {
	node: FlowNode;
	onClose: () => void;
}

export function NodeInspector({ node, onClose }: NodeInspectorProps) {
	const { code, error, play, setCode, resetCode } = useFlowRuntime();
	const { icon, title, description, owner, step, category, status } = node.data;
	const explanation = node.data.explanation ?? description;
	const failureReason = node.data.failureReason;
	const badge = CATEGORY_BADGE[category];

	const editable = node.data.code !== undefined;
	const source = code[node.id] ?? node.data.code ?? "";
	const nodeError = error?.nodeId === node.id ? error : null;

	return (
		<aside className="flow-slide-in flex w-[420px] shrink-0 flex-col overflow-hidden border-l border-border bg-card">
			{/* header */}
			<div className="flex items-start gap-3 border-b border-border px-5 py-4">
				<span
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-lg text-lg",
						ICON_STYLES[category],
					)}
				>
					{icon}
				</span>
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<h3 className="text-sm font-semibold leading-tight text-foreground">
							{title}
						</h3>
						<button
							type="button"
							onClick={onClose}
							aria-label="Close inspector"
							className="-mr-1 -mt-1 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							<X className="size-4" />
						</button>
					</div>
					<div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
						<span
							className={cn(
								"rounded-full border px-2 py-0.5 font-medium",
								badge.className,
							)}
						>
							{badge.label}
						</span>
						<span>Step {step}</span>
						<span aria-hidden>·</span>
						<span>{owner}</span>
					</div>
				</div>
			</div>

			{/* body */}
			<div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-4">
				<p className="text-sm leading-relaxed text-foreground">{explanation}</p>

				{editable && (
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between gap-2">
							<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Implementation — editable
							</span>
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={() => resetCode(node.id)}
									className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									<RotateCcw className="size-3" />
									Reset
								</button>
								<button
									type="button"
									onClick={play}
									className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
								>
									<Play className="size-3" />
									Run
								</button>
							</div>
						</div>
						<CodeEditor
							key={node.id}
							value={source}
							onChange={(next) => setCode(node.id, next)}
						/>
						{nodeError && (
							<p className="rounded-md border border-destructive-border bg-destructive-surface px-2.5 py-1.5 font-mono text-[11px] text-destructive">
								{nodeError.message}
							</p>
						)}
						<p className="text-[11px] text-muted-foreground">
							Edit, then Run (or Pay in the checkout) to execute your code.
						</p>
					</div>
				)}

				{failureReason && (
					<div className="rounded-lg border border-destructive-border bg-destructive-surface p-3.5 text-sm">
						<div className="mb-1.5 flex items-center gap-1.5 font-medium text-destructive">
							<span aria-hidden>⚠</span>
							Why this breaks
						</div>
						<p className="leading-relaxed text-destructive/90">
							{failureReason}
						</p>
					</div>
				)}
			</div>

			{/* live status footer */}
			{status && status !== "idle" && (
				<div className="border-t border-border px-5 py-3 text-xs">
					{status === "running" ? (
						<span className="flex items-center gap-1.5 text-flow-accent">
							<span className="size-1.5 animate-pulse rounded-full bg-flow-accent" />
							Running now
						</span>
					) : (
						<span className="flex items-center gap-1.5 text-success">
							<span className="size-1.5 rounded-full bg-success" />
							Ran in the last pass
						</span>
					)}
				</div>
			)}
		</aside>
	);
}
