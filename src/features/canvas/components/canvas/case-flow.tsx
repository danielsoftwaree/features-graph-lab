"use client";

import {
	Background,
	BackgroundVariant,
	MiniMap,
	ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { FlowEdge, FlowNode as FlowNodeType } from "@/shared/types/flow";
import { FlowNode } from "../flow-node";

const NODE_TYPES = { flow: FlowNode };

interface CaseFlowProps {
	nodes: FlowNodeType[];
	edges: FlowEdge[];
}

export function CaseFlow({ nodes, edges }: CaseFlowProps) {
	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={NODE_TYPES}
			fitView
			fitViewOptions={{ padding: 0.2 }}
			proOptions={{ hideAttribution: true }}
			className="bg-background"
		>
			<Background variant={BackgroundVariant.Dots} gap={20} size={2} />
			<MiniMap pannable zoomable className="bottom-4! right-4!" />
		</ReactFlow>
	);
}
