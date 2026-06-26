"use client";

import {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
	type MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useFlowRuntime } from "@/shared/flow-runtime";
import type { FlowEdge, FlowNode as FlowNodeType } from "@/shared/types/flow";
import { CATEGORY_MINIMAP_COLORS, FlowNode } from "../flow-node";
import { DataEdge } from "./data-edge";
import { NodeInspector } from "./node-inspector";

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
	const [selectedId, setSelectedId] = useState<string | null>(null);
	// Stored as a closure so we never type the RF instance generics here.
	const fitViewRef = useRef<(() => void) | null>(null);

	// Controlled nodes/edges derived from the runtime — no internal RF state, no
	// effects: the runtime is the single source of truth for what is "live".
	const liveNodes = useMemo<FlowNodeType[]>(
		() =>
			nodes.map((node) => {
				const status = nodeStatus[node.id] ?? "idle";
				return {
					...node,
					data: { ...node.data, status, selected: node.id === selectedId },
					// Lift the active node so its ring and badge sit above neighbours.
					zIndex: status === "running" ? 1000 : undefined,
				};
			}),
		[nodes, nodeStatus, selectedId],
	);

	const liveEdges = useMemo<FlowEdge[]>(
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

	const selectedNode = useMemo(
		() =>
			selectedId
				? (liveNodes.find((node) => node.id === selectedId) ?? null)
				: null,
		[liveNodes, selectedId],
	);

	const handleNodeClick = useCallback(
		(_event: MouseEvent, node: FlowNodeType) =>
			setSelectedId((prev) => (prev === node.id ? null : node.id)),
		[],
	);

	const closeInspector = useCallback(() => setSelectedId(null), []);

	// Re-frame the graph when the inspector opens or closes, so it stays fully
	// visible in the changed width. Imperative viewport sync, not derived state —
	// rAF lets the new layout settle before fitView measures it.
	const isOpen = selectedNode !== null;
	// biome-ignore lint/correctness/useExhaustiveDependencies: isOpen is the trigger for the refit (canvas width changes when the inspector mounts/unmounts), not a value read inside the effect.
	useEffect(() => {
		const id = requestAnimationFrame(() => fitViewRef.current?.());
		return () => cancelAnimationFrame(id);
	}, [isOpen]);

	return (
		<div className="flex h-full w-full">
			<div className="relative min-w-0 flex-1">
				<ReactFlow
					nodes={liveNodes}
					edges={liveEdges}
					nodeTypes={NODE_TYPES}
					edgeTypes={EDGE_TYPES}
					nodesDraggable={false}
					nodesConnectable={false}
					onNodeClick={handleNodeClick}
					onPaneClick={closeInspector}
					onInit={(instance) => {
						fitViewRef.current = () =>
							instance.fitView({ padding: 0.2, duration: 300 });
					}}
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
					<Controls position="bottom-right" showInteractive={false} />
				</ReactFlow>
			</div>
			{selectedNode && (
				<NodeInspector node={selectedNode} onClose={closeInspector} />
			)}
		</div>
	);
}
