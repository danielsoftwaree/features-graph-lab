import type { Edge, Node } from "@xyflow/react";

export type FlowCategory = "user" | "system" | "external" | "critical" | "failure";

export type FlowNodeData = {
	step: string;
	icon: string;
	title: string;
	description: string;
	owner: string;
	category: FlowCategory;
};

export type FlowNode = Node<FlowNodeData, "flow">;

export type FlowEdge = Edge;
