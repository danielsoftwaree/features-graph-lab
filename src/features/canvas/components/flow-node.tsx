import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Check, Loader2 } from "lucide-react";
import type { CSSProperties } from "react";
import { FLOW_STEP_MS } from "@/shared/flow-runtime";
import { cn } from "@/shared/lib/cn";
import type {
	FlowNode as FlowNodeType,
	FlowNodeStatus,
} from "@/shared/types/flow";

const CATEGORY_STYLES: Record<FlowNodeType["data"]["category"], string> = {
	user: "border-primary/60 text-primary bg-primary/5",
	system: "border-success/60 text-success bg-success/5",
	external: "border-border text-muted-foreground bg-muted/40",
	critical: "border-warning bg-warning-surface text-warning",
	failure: "border-destructive bg-destructive-surface text-destructive",
};

// While running, a conic-gradient ring (styles.css) fills around the border over
// one engine wave; done nodes settle to a quiet success ring.
const STATUS_STYLES: Record<FlowNodeStatus, string> = {
	idle: "",
	running: "flow-node-running scale-[1.03] shadow-lg",
	done: "ring-1 ring-success/40",
};

// Custom property consumed by the .flow-node-running keyframes (styles.css).
const runningStyle = {
	"--flow-duration": `${FLOW_STEP_MS}ms`,
} as CSSProperties;

export const CATEGORY_MINIMAP_COLORS: Record<
	FlowNodeType["data"]["category"],
	string
> = {
	user: "#3b82f6",
	system: "#16a34a",
	external: "#71717a",
	critical: "#f59e0b",
	failure: "#dc2626",
};

export function FlowNode({ data }: NodeProps<FlowNodeType>) {
	const { step, icon, title, description, owner, category, status } = data;
	const runStatus = status ?? "idle";

	return (
		<div
			style={runStatus === "running" ? runningStyle : undefined}
			className={cn(
				"relative w-44 rounded-lg border px-3 py-2.5 shadow-sm transition-all hover:shadow-md",
				CATEGORY_STYLES[category],
				STATUS_STYLES[runStatus],
			)}
		>
			{runStatus === "running" && (
				<span className="absolute -top-3 right-1 z-10 flex items-center gap-1 rounded-full border border-primary/40 bg-background px-2 py-0.5 text-[10px] font-medium text-primary shadow-sm">
					<Loader2 className="size-3 animate-spin" />
					running
				</span>
			)}
			{runStatus === "done" && (
				<span className="absolute -top-2.5 right-1 z-10 flex size-5 items-center justify-center rounded-full border border-success/40 bg-background text-success shadow-sm">
					<Check className="size-3" />
				</span>
			)}

			<Handle type="target" position={Position.Left} className="!bg-current" />
			<div className="mb-1 flex items-center gap-1.5 text-[11px] opacity-70">
				<span>{icon}</span>
				<span>{step}</span>
			</div>
			<div className="text-sm font-semibold leading-tight">{title}</div>
			<p className="mt-1 text-[11px] leading-snug text-foreground/70">{description}</p>
			<span className="mt-2 inline-block rounded border border-current/30 px-1.5 py-0.5 text-[10px] opacity-80">
				{owner}
			</span>
			<Handle type="source" position={Position.Right} className="!bg-current" />
		</div>
	);
}
