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
import {
	compileHandlers,
	HandlerCompileError,
	HandlerRuntimeError,
} from "@/shared/lib/flow-engine/compile";
import { runFlow } from "@/shared/lib/flow-engine/engine";
import type { NodeHandler, StepEvent } from "@/shared/lib/flow-engine/types";
import type { FlowEdge, FlowNode, FlowNodeStatus } from "@/shared/types/flow";

export type RuntimeStatus = "idle" | "running" | "done" | "error";

// Animation cadence. A node stays "running" (its border fills) for FLOW_STEP_MS;
// a token then crosses to the next node in FLOW_EDGE_MS. The engine uses these as
// its execute/transit delays and DataEdge draws its line over FLOW_EDGE_MS, so the
// next node starts the instant the line lands — no dead gap.
export const FLOW_STEP_MS = 800;
export const FLOW_EDGE_MS = 400;

export type FlowRuntimeError = { nodeId?: string; message: string };

// What the UI reads. `world` is erased to `unknown` here so this shared module
// never depends on a feature's domain type — the consuming feature casts it.
// `code` is the editable source per node; `play` compiles and runs it.
export type FlowRuntimeValue = {
	status: RuntimeStatus;
	nodeStatus: Record<string, FlowNodeStatus>;
	activeEdgeIds: Set<string>;
	traveledEdgeIds: Set<string>;
	world: unknown;
	code: Record<string, string>;
	error: FlowRuntimeError | null;
	play: () => void;
	reset: () => void;
	setCode: (nodeId: string, source: string) => void;
	resetCode: (nodeId: string) => void;
};

type RuntimeState = Omit<
	FlowRuntimeValue,
	"play" | "reset" | "setCode" | "resetCode"
>;

const BASE_STATE = {
	status: "idle" as RuntimeStatus,
	nodeStatus: {} as Record<string, FlowNodeStatus>,
	activeEdgeIds: new Set<string>(),
	traveledEdgeIds: new Set<string>(),
	world: null as unknown,
	error: null as FlowRuntimeError | null,
};

function deriveInitialCode(nodes: FlowNode[]): Record<string, string> {
	const code: Record<string, string> = {};
	for (const node of nodes) {
		if (node.data.code !== undefined) code[node.id] = node.data.code;
	}
	return code;
}

function errorOf(error: unknown): FlowRuntimeError {
	if (
		error instanceof HandlerCompileError ||
		error instanceof HandlerRuntimeError
	) {
		return { nodeId: error.nodeId, message: error.message };
	}
	return { message: error instanceof Error ? error.message : String(error) };
}

const FlowRuntimeContext = createContext<FlowRuntimeValue | null>(null);

type FlowRuntimeProviderProps<World> = {
	nodes: FlowNode[];
	edges: FlowEdge[];
	entryNodeId: string;
	createWorld: () => World;
	stepMs?: number;
	children: ReactNode;
};

export function FlowRuntimeProvider<World>({
	nodes,
	edges,
	entryNodeId,
	createWorld,
	stepMs,
	children,
}: FlowRuntimeProviderProps<World>) {
	const engineNodes = useMemo(() => toEngineNodes(nodes), [nodes]);
	const engineEdges = useMemo(() => toEngineEdges(edges), [edges]);
	const initialCode = useMemo(() => deriveInitialCode(nodes), [nodes]);

	const [state, setState] = useState<RuntimeState>(() => ({
		...BASE_STATE,
		code: initialCode,
	}));
	const stateRef = useRef(state);
	stateRef.current = state;
	const abortRef = useRef<AbortController | null>(null);

	const play = useCallback(() => {
		abortRef.current?.abort();

		// Compile the user's current code; a syntax error surfaces in the UI
		// instead of running a half-built flow.
		let handlers: Record<string, NodeHandler<World>>;
		try {
			handlers = compileHandlers<World>(stateRef.current.code);
		} catch (error) {
			setState((prev) => ({ ...prev, status: "error", error: errorOf(error) }));
			return;
		}

		const controller = new AbortController();
		abortRef.current = controller;
		const world = createWorld();

		setState((prev) => ({
			...BASE_STATE,
			code: prev.code,
			status: "running",
			world,
		}));

		void runFlow<World>({
			nodes: engineNodes,
			edges: engineEdges,
			handlers,
			entry: entryNodeId,
			world,
			signal: controller.signal,
			stepMs,
			edgeMs: FLOW_EDGE_MS,
			onStep: (event) => setState((prev) => advance(prev, event)),
		})
			.then((finalWorld) => {
				if (controller.signal.aborted) return;
				setState((prev) => finish(prev, finalWorld));
			})
			.catch((error) => {
				if (controller.signal.aborted) return;
				setState((prev) => ({
					...prev,
					status: "error",
					error: errorOf(error),
				}));
			});
	}, [engineNodes, engineEdges, entryNodeId, stepMs, createWorld]);

	const reset = useCallback(() => {
		abortRef.current?.abort();
		setState((prev) => ({ ...BASE_STATE, code: prev.code }));
	}, []);

	const setCode = useCallback((nodeId: string, source: string) => {
		setState((prev) => ({
			...prev,
			code: { ...prev.code, [nodeId]: source },
			error: null,
		}));
	}, []);

	const resetCode = useCallback(
		(nodeId: string) => {
			setState((prev) => ({
				...prev,
				code: { ...prev.code, [nodeId]: initialCode[nodeId] ?? "" },
				error: null,
			}));
		},
		[initialCode],
	);

	const value = useMemo<FlowRuntimeValue>(
		() => ({ ...state, play, reset, setCode, resetCode }),
		[state, play, reset, setCode, resetCode],
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
		return { ...prev, nodeStatus, activeEdgeIds: new Set() };
	}

	// transit: nodes finished, their tokens now travel the edges onward.
	for (const id of event.nodes) nodeStatus[id] = "done";
	const activeEdgeIds = new Set<string>();
	const traveledEdgeIds = new Set(prev.traveledEdgeIds);
	for (const travel of event.travels) {
		activeEdgeIds.add(travel.edgeId);
		traveledEdgeIds.add(travel.edgeId);
	}
	return { ...prev, nodeStatus, activeEdgeIds, traveledEdgeIds };
}

function finish(prev: RuntimeState, world: unknown): RuntimeState {
	return {
		...prev,
		status: "done",
		nodeStatus: settleRunning(prev.nodeStatus),
		activeEdgeIds: new Set(),
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
