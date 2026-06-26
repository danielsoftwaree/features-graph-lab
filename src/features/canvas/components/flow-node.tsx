"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Check, Loader2 } from "lucide-react";
import { type CSSProperties, useCallback, useState } from "react";
import { FLOW_STEP_MS } from "@/shared/flow-runtime";
import { cn } from "@/shared/lib/cn";
import type {
	FlowCategory,
	FlowNodeStatus,
	FlowNode as FlowNodeType,
} from "@/shared/types/flow";

// The icon sits in a soft pastel chip — the only place the card carries its
// category colour, keeping the card itself a clean white surface. Exported so the
// node inspector can reuse the exact same chip for the node it shows.
export const ICON_STYLES: Record<FlowCategory, string> = {
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
	running: "shadow-lg",
	done: "ring-1 ring-flow-accent/50",
};

export const CATEGORY_MINIMAP_COLORS: Record<FlowCategory, string> = {
	user: "#3b82f6",
	system: "#16a34a",
	external: "#71717a",
	critical: "#f59e0b",
	failure: "#dc2626",
};

// Rounded-rect outline that *starts at the left-edge midpoint* — the node's
// incoming-edge entry — so the progress fill grows out from where the data
// arrives rather than from an arbitrary corner. Traced clockwise; the caller
// normalises pathLength to 100 so the fill advances at a constant speed.
function progressPath(w: number, h: number, r: number): string {
	const midY = h / 2;
	return [
		`M 0 ${midY}`,
		`V ${r}`,
		`A ${r} ${r} 0 0 1 ${r} 0`,
		`H ${w - r}`,
		`A ${r} ${r} 0 0 1 ${w} ${r}`,
		`V ${h - r}`,
		`A ${r} ${r} 0 0 1 ${w - r} ${h}`,
		`H ${r}`,
		`A ${r} ${r} 0 0 1 0 ${h - r}`,
		"Z",
	].join(" ");
}

export function FlowNode({ data }: NodeProps<FlowNodeType>) {
	const { icon, title, description, category, status, step, selected } = data;
	const runStatus = status ?? "idle";
	const tab = CATEGORY_TAB[category];
	const [box, setBox] = useState<{ w: number; h: number } | null>(null);
	const measure = useCallback((el: HTMLDivElement | null) => {
		if (el) setBox({ w: el.clientWidth, h: el.clientHeight });
	}, []);

	return (
		<div
			ref={measure}
			className={cn(
				"relative w-56 cursor-pointer rounded-xl border border-border bg-card px-3.5 py-3 shadow-sm transition-[box-shadow] duration-300 hover:shadow-md",
				runStatus !== "idle" && "flow-node-live",
				STATUS_STYLES[runStatus],
				selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
			)}
		>
			{runStatus === "running" && (
				<svg
					className="flow-node-progress"
					aria-hidden="true"
					style={{ "--flow-fill-ms": `${FLOW_STEP_MS}ms` } as CSSProperties}
				>
					<rect
						className="flow-node-progress-track"
						width="100%"
						height="100%"
						rx="13"
						pathLength={100}
					/>
					{box && (
						<path
							className="flow-node-progress-fill"
							d={progressPath(box.w, box.h, 13)}
							pathLength={100}
						/>
					)}
				</svg>
			)}
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

			{/* sequence marker — reads like a numbered step in the pipeline */}
			<span className="absolute right-2.5 top-2.5 select-none font-mono text-[10px] text-muted-foreground/50">
				{step}
			</span>

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
				<div className="min-w-0 pr-4">
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
