import type { Edge, Node } from "@xyflow/react";

export type FlowCategory =
	| "user"
	| "system"
	| "external"
	| "critical"
	| "failure";

// Set by the runtime while a flow runs; drives the node's highlight.
export type FlowNodeStatus = "idle" | "running" | "done";

export type FlowNodeData = {
	step: string;
	icon: string;
	title: string;
	description: string;
	owner: string;
	category: FlowCategory;
	// Inspector content — authored per node in the case data.
	explanation?: string;
	code?: string;
	failureReason?: string;
	// Injected by CaseFlow at render time.
	status?: FlowNodeStatus;
	selected?: boolean;
};

export type FlowNode = Node<FlowNodeData, "flow">;

// `branch` keys the edge for the engine (a node emits on a handle, the engine
// follows only edges whose branch matches). `active`/`traveled` are set by the
// runtime while a token travels the edge, for the DataEdge animation.
export type FlowEdgeData = {
	branch?: string;
	active?: boolean;
	traveled?: boolean;
};

export type FlowEdge = Edge<FlowEdgeData>;
