"use client";

import {
	Background,
	BackgroundVariant,
	MiniMap,
	ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { FlowEdge, FlowNode as FlowNodeType } from "@/shared/types/flow";
import { CATEGORY_MINIMAP_COLORS, FlowNode } from "../flow-node";

const NODE_TYPES = { flow: FlowNode };

function minimapNodeColor(node: FlowNodeType) {
	return CATEGORY_MINIMAP_COLORS[node.data.category];
}

interface CaseFlowProps {
	nodes: FlowNodeType[];
	edges: FlowEdge[];
}

export function CaseFlow({ nodes, edges }: CaseFlowProps) {
	return (
		<ReactFlow
			defaultNodes={nodes}
			defaultEdges={edges}
			nodeTypes={NODE_TYPES}
			fitView
			fitViewOptions={{ padding: 0.2 }}
			proOptions={{ hideAttribution: true }}
			className="bg-background"
		>
			<Background variant={BackgroundVariant.Dots} gap={20} size={2} />
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
