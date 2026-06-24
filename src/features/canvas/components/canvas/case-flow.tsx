"use client";

import {
	Background,
	BackgroundVariant,
	MiniMap,
	ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useMemo } from "react";
import { useFlowRuntime } from "@/shared/flow-runtime";
import type { FlowEdge, FlowNode as FlowNodeType } from "@/shared/types/flow";
import { CATEGORY_MINIMAP_COLORS, FlowNode } from "../flow-node";
import { DataEdge } from "./data-edge";

const NODE_TYPES = { flow: FlowNode };
const EDGE_TYPES = { data: DataEdge };

function minimapNodeColor(node: FlowNodeType) {
	return CATEGORY_MINIMAP_COLORS[node.data.category];
}

interface CaseFlowProps {
	nodes: FlowNodeType[];
	edges: FlowEdge[];
}

export function CaseFlow({ nodes, edges }: CaseFlowProps) {
	const { nodeStatus, activeEdgeIds, traveledEdgeIds } = useFlowRuntime();

	// Controlled nodes/edges derived from the runtime — no internal RF state, no
	// effects: the runtime is the single source of truth for what is "live".
	const liveNodes = useMemo(
		() =>
			nodes.map((node) => {
				const status = nodeStatus[node.id] ?? "idle";
				return {
					...node,
					data: { ...node.data, status },
					// Lift the active node so its ring and badge sit above neighbours.
					zIndex: status === "running" ? 1000 : undefined,
				};
			}),
		[nodes, nodeStatus],
	);

	const liveEdges = useMemo(
		() =>
			edges.map((edge) => ({
				...edge,
				type: "data",
				data: {
					...edge.data,
					active: activeEdgeIds.has(edge.id),
					traveled: traveledEdgeIds.has(edge.id),
				},
			})),
		[edges, activeEdgeIds, traveledEdgeIds],
	);

	return (
		<ReactFlow
			nodes={liveNodes}
			edges={liveEdges}
			nodeTypes={NODE_TYPES}
			edgeTypes={EDGE_TYPES}
			nodesDraggable={false}
			nodesConnectable={false}
			fitView
			fitViewOptions={{ padding: 0.2 }}
			proOptions={{ hideAttribution: true }}
			className="bg-background"
		>
			<Background
				variant={BackgroundVariant.Lines}
				gap={50}
				size={1}
				color="rgb(200, 200, 200, 0.08)"
			/>
			<MiniMap
				position="bottom-left"
				pannable
				zoomable
				nodeColor={minimapNodeColor}
				nodeStrokeColor={minimapNodeColor}
			/>
		</ReactFlow>
	);
}
