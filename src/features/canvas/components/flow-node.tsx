import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type {
	FlowCategory,
	FlowNode as FlowNodeType,
	FlowNodeStatus,
} from "@/shared/types/flow";

// The icon sits in a soft pastel chip — the only place the card carries its
// category colour, keeping the card itself a clean white surface.
const ICON_STYLES: Record<FlowCategory, string> = {
	user: "bg-primary/10 text-primary",
	system: "bg-success/10 text-success",
	external: "bg-muted text-muted-foreground",
	critical: "bg-warning-surface text-warning",
	failure: "bg-destructive-surface text-destructive",
};

// Only "notable" nodes get a corner tab — entry, critical and failure — so the
// graph reads like the reference where just the special nodes are labelled.
const CATEGORY_TAB: Partial<
	Record<FlowCategory, { label: string; className: string }>
> = {
	user: {
		label: "Start",
		className: "border-primary/30 bg-primary/10 text-primary",
	},
	critical: {
		label: "Critical",
		className: "border-warning/40 bg-warning-surface text-warning",
	},
	failure: {
		label: "Failure",
		className: "border-destructive/40 bg-destructive-surface text-destructive",
	},
};

const STATUS_STYLES: Record<FlowNodeStatus, string> = {
	idle: "",
	running: "flow-node-running scale-[1.02] shadow-lg",
	done: "ring-1 ring-flow-accent/50",
};

export const CATEGORY_MINIMAP_COLORS: Record<FlowCategory, string> = {
	user: "#3b82f6",
	system: "#16a34a",
	external: "#71717a",
	critical: "#f59e0b",
	failure: "#dc2626",
};

export function FlowNode({ data }: NodeProps<FlowNodeType>) {
	const { icon, title, description, category, status } = data;
	const runStatus = status ?? "idle";
	const tab = CATEGORY_TAB[category];

	return (
		<div
			className={cn(
				"relative w-56 rounded-xl border border-border bg-card px-3.5 py-3 shadow-sm transition-all duration-300 hover:shadow-md",
				STATUS_STYLES[runStatus],
			)}
		>
			{tab && (
				<span
					className={cn(
						"absolute bottom-full left-3 mb-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
						tab.className,
					)}
				>
					{tab.label}
				</span>
			)}
			{runStatus === "running" && (
				<span className="absolute bottom-full right-3 mb-1.5 flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
					<Loader2 className="size-3 animate-spin" />
					Running
				</span>
			)}
			{runStatus === "done" && (
				<span className="absolute bottom-full right-3 mb-1.5 flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success shadow-sm">
					<Check className="size-3" />
					Done
				</span>
			)}

			<Handle id="in" type="target" position={Position.Left} />
			<Handle
				id="in-top"
				type="target"
				position={Position.Top}
				className="opacity-0"
			/>

			<div className="flex items-start gap-2.5">
				<span
					className={cn(
						"flex size-8 shrink-0 items-center justify-center rounded-lg text-base",
						ICON_STYLES[category],
					)}
				>
					{icon}
				</span>
				<div className="min-w-0">
					<div className="text-sm font-semibold leading-tight text-foreground">
						{title}
					</div>
					<p className="mt-0.5 text-xs leading-snug text-muted-foreground">
						{description}
					</p>
				</div>
			</div>

			<Handle
				id="out-bottom"
				type="source"
				position={Position.Bottom}
				className="opacity-0"
			/>
			<Handle id="out" type="source" position={Position.Right} />
		</div>
	);
}
