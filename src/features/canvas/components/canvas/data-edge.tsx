"use client";

import {
	BaseEdge,
	EdgeLabelRenderer,
	type EdgeProps,
	getSmoothStepPath,
} from "@xyflow/react";
import { FLOW_EDGE_MS } from "@/shared/flow-runtime";
import { cn } from "@/shared/lib/cn";
import type { FlowEdge } from "@/shared/types/flow";

// A smoothstep edge. While active, the bright accent colour draws on along the
// path — a quick line shooting to the next node — then settles to a faint
// "travelled" tint once the wave moves on.
export function DataEdge({
	id,
	data,
	label,
	markerEnd,
	...geometry
}: EdgeProps<FlowEdge>) {
	const [path, labelX, labelY] = getSmoothStepPath(geometry);
	const active = data?.active ?? false;
	const traveled = data?.traveled ?? false;

	return (
		<>
			<BaseEdge
				id={id}
				path={path}
				markerEnd={markerEnd}
				className={cn(traveled && "stroke-flow-accent/55!")}
			/>
			{active && (
				<path
					d={path}
					className="flow-edge-draw"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1}
				>
					<animate
						attributeName="stroke-dashoffset"
						from={1}
						to={0}
						dur={`${FLOW_EDGE_MS}ms`}
						calcMode="spline"
						keyTimes="0;1"
						keySplines="0.42 0 0.58 1"
						repeatCount="1"
						fill="freeze"
					/>
				</path>
			)}
			{label && (
				<EdgeLabelRenderer>
					{/* transform must be inline — it is computed from edge geometry */}
					<div
						className="nodrag nopan absolute rounded border border-border bg-background/90 px-1.5 py-0.5 text-[10px] text-muted-foreground"
						style={{
							transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
						}}
					>
						{label}
					</div>
				</EdgeLabelRenderer>
			)}
		</>
	);
}
