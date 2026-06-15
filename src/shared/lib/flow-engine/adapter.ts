import type { FlowEdge, FlowNode } from "@/shared/types/flow";
import type { EngineEdge, EngineNode } from "./types";

// Bridge the visual graph (@xyflow shapes in shared/types/flow) to the plain
// graph the engine walks. The engine core stays free of any @xyflow imports.

export function toEngineNodes(nodes: FlowNode[]): EngineNode[] {
	return nodes.map((node) => ({ id: node.id }));
}

export function toEngineEdges(edges: FlowEdge[]): EngineEdge[] {
	return edges.map((edge) => ({
		id: edge.id,
		source: edge.source,
		target: edge.target,
		branch: edge.data?.branch,
	}));
}
