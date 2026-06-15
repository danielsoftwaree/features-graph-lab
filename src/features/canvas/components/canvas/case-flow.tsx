"use client";

import { Background, BackgroundVariant, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { paymentFlowEdges, paymentFlowNodes } from "../../data/payment-flow";
import { FlowNode } from "../flow-node";

const NODE_TYPES = { flow: FlowNode };

export function CaseFlow() {
	return (
		<ReactFlow
			nodes={paymentFlowNodes}
			edges={paymentFlowEdges}
			nodeTypes={NODE_TYPES}
			fitView
			fitViewOptions={{ padding: 0.2 }}
			proOptions={{ hideAttribution: true }}
			className="bg-background"
		>
			<Background variant={BackgroundVariant.Dots} gap={20} size={1} />
			<MiniMap pannable zoomable className="!bottom-4 !right-4" />
		</ReactFlow>
	);
}
