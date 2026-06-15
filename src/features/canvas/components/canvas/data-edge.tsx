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
	const speedMs = data?.speedMs ?? FLOW_STEP_MS;

	return (
		<>
			<BaseEdge
				id={id}
				path={path}
				markerEnd={markerEnd}
				className={cn(active && "stroke-primary!")}
			/>
			{active && (
				<circle r={4} className="fill-primary">
					<animateMotion dur={`${speedMs}ms`} repeatCount="1" path={path} />
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
