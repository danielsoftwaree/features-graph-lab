"use client";

import {
	Background,
	Controls,
	type Edge,
	MiniMap,
	type Node,
	type NodeMouseHandler,
	ReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import "@xyflow/react/dist/style.css";

import { BrokenModeToggle } from "./broken-mode-toggle";
import { CustomNode } from "./custom-node";
import { NodeDetailPanel } from "./node-detail-panel";

const NODE_TYPES = { custom: CustomNode };

interface NodeCanvasProps {
	nodes: Node[];
	edges: Edge[];
	criticalNodeId: string;
}

export function NodeCanvas({ nodes, edges, criticalNodeId }: NodeCanvasProps) {
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);

	const enrichedNodes = nodes.map((node) => ({
		...node,
		type: "custom",
		data: {
			...node.data,
			isCritical: node.id === criticalNodeId,
			isMissing: node.id === criticalNodeId,
		},
	}));

	const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
		setSelectedNode(node);
	}, []);

	return (
		<div className="relative h-full w-full bg-background">
			<ReactFlow
				nodes={enrichedNodes}
				edges={edges}
				nodeTypes={NODE_TYPES}
				onNodeClick={handleNodeClick}
				fitView
			>
				<Background />
				<Controls />
				<MiniMap />
			</ReactFlow>
			<NodeDetailPanel
				node={selectedNode}
				onClose={() => setSelectedNode(null)}
			/>
		</div>
	);
}
