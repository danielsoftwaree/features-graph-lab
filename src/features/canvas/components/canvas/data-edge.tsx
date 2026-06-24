"use client";

import {
	BaseEdge,
	EdgeLabelRenderer,
	type EdgeProps,
	getSmoothStepPath,
} from "@xyflow/react";
import { FLOW_STEP_MS } from "@/shared/flow-runtime";
import { cn } from "@/shared/lib/cn";
import type { FlowEdge } from "@/shared/types/flow";

// A smoothstep edge that, while a token is travelling it, runs a dot along the
// exact edge path (SVG animateMotion). The dot is the real data moving to the
// next node — its lifetime matches one engine wave.
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
	const speedMs = data?.speedMs ?? FLOW_STEP_MS;

	return (
		<>
			<BaseEdge
				id={id}
				path={path}
				markerEnd={markerEnd}
				className={cn(
					active && "stroke-flow-accent!",
					!active && traveled && "stroke-flow-accent/55!",
				)}
			/>
			{active && (
				<circle r={5} className="fill-flow-accent flow-edge-token">
					<animate
						attributeName="opacity"
						values="0;1;1;0"
						keyTimes="0;0.2;0.8;1"
						dur={`${speedMs}ms`}
						repeatCount="1"
					/>
					<animateMotion
						dur={`${speedMs}ms`}
						repeatCount="1"
						path={path}
						calcMode="spline"
						keyTimes="0;1"
						keyPoints="0;1"
						keySplines="0.42 0 0.58 1"
					/>
				</circle>
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
