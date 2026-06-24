"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import { toEngineEdges, toEngineNodes } from "@/shared/lib/flow-engine/adapter";
import { runFlow } from "@/shared/lib/flow-engine/engine";
import type { NodeHandler, StepEvent } from "@/shared/lib/flow-engine/types";
import type { FlowEdge, FlowNode, FlowNodeStatus } from "@/shared/types/flow";

export type RuntimeStatus = "idle" | "running" | "done";

// Animation cadence: the engine waits this long between waves, and edges animate
// their travelling token over the same duration so motion and execution line up.
export const FLOW_STEP_MS = 800;

// What the UI reads. `world` is erased to `unknown` here so this shared module
// never depends on a feature's domain type — the consuming feature casts it.
export type FlowRuntimeValue = {
	status: RuntimeStatus;
	mode: string | null;
	nodeStatus: Record<string, FlowNodeStatus>;
	activeEdgeIds: Set<string>;
	traveledEdgeIds: Set<string>;
	edgePayloads: Record<string, unknown>;
	world: unknown;
	play: (mode: string) => void;
	reset: () => void;
};

type RuntimeState = Omit<FlowRuntimeValue, "play" | "reset">;

const INITIAL_STATE: RuntimeState = {
	status: "idle",
	mode: null,
	nodeStatus: {},
	activeEdgeIds: new Set(),
	traveledEdgeIds: new Set(),
	edgePayloads: {},
	world: null,
};

const FlowRuntimeContext = createContext<FlowRuntimeValue | null>(null);

type FlowRuntimeProviderProps<World> = {
	nodes: FlowNode[];
	edges: FlowEdge[];
	entryNodeId: string;
	createWorld: () => World;
	createHandlers: (mode: string) => Record<string, NodeHandler<World>>;
	stepMs?: number;
	children: ReactNode;
};

export function FlowRuntimeProvider<World>({
	nodes,
	edges,
	entryNodeId,
	createWorld,
	createHandlers,
	stepMs,
	children,
}: FlowRuntimeProviderProps<World>) {
	const engineNodes = useMemo(() => toEngineNodes(nodes), [nodes]);
	const engineEdges = useMemo(() => toEngineEdges(edges), [edges]);
	const [state, setState] = useState<RuntimeState>(INITIAL_STATE);
	const abortRef = useRef<AbortController | null>(null);

	const play = useCallback(
		(mode: string) => {
			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;
			const world = createWorld();

			setState({
				status: "running",
				mode,
				nodeStatus: {},
				activeEdgeIds: new Set(),
				traveledEdgeIds: new Set(),
				edgePayloads: {},
				world,
			});

			void runFlow<World>({
				nodes: engineNodes,
				edges: engineEdges,
				handlers: createHandlers(mode),
				entry: entryNodeId,
				world,
				signal: controller.signal,
				stepMs,
				onStep: (event) => setState((prev) => advance(prev, event)),
			}).then((finalWorld) => {
				if (controller.signal.aborted) return;
				setState((prev) => finish(prev, finalWorld));
			});
		},
		[engineNodes, engineEdges, entryNodeId, stepMs, createWorld, createHandlers],
	);

	const reset = useCallback(() => {
		abortRef.current?.abort();
		setState(INITIAL_STATE);
	}, []);

	const value = useMemo<FlowRuntimeValue>(
		() => ({ ...state, play, reset }),
		[state, play, reset],
	);

	return (
		<FlowRuntimeContext.Provider value={value}>
			{children}
		</FlowRuntimeContext.Provider>
	);
}

export function useFlowRuntime(): FlowRuntimeValue {
	const value = useContext(FlowRuntimeContext);
	if (!value) {
		throw new Error("useFlowRuntime must be used within FlowRuntimeProvider");
	}
	return value;
}

function advance(prev: RuntimeState, event: StepEvent): RuntimeState {
	const nodeStatus = { ...prev.nodeStatus };

	if (event.phase === "execute") {
		// Nodes start computing; no token travels while a node is pending.
		for (const id of event.nodes) nodeStatus[id] = "running";
		return { ...prev, nodeStatus, activeEdgeIds: new Set(), edgePayloads: {} };
	}

	// transit: nodes finished, their tokens now travel the edges onward.
	for (const id of event.nodes) nodeStatus[id] = "done";
	const edgePayloads: Record<string, unknown> = {};
	const activeEdgeIds = new Set<string>();
	const traveledEdgeIds = new Set(prev.traveledEdgeIds);
	for (const travel of event.travels) {
		edgePayloads[travel.edgeId] = travel.payload;
		activeEdgeIds.add(travel.edgeId);
		traveledEdgeIds.add(travel.edgeId);
	}
	return { ...prev, nodeStatus, activeEdgeIds, traveledEdgeIds, edgePayloads };
}

function finish(prev: RuntimeState, world: unknown): RuntimeState {
	return {
		...prev,
		status: "done",
		nodeStatus: settleRunning(prev.nodeStatus),
		activeEdgeIds: new Set(),
		edgePayloads: {},
		world,
	};
}

function settleRunning(
	status: Record<string, FlowNodeStatus>,
): Record<string, FlowNodeStatus> {
	const next: Record<string, FlowNodeStatus> = {};
	for (const [id, value] of Object.entries(status)) {
		next[id] = value === "running" ? "done" : value;
	}
	return next;
}
