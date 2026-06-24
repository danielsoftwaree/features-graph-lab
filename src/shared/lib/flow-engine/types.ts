// Minimal, framework-agnostic dataflow engine.
// The engine knows nothing about React or @xyflow — it walks a graph, runs one
// handler per node, and routes each handler's real output along the edges.

export type EngineNode = { id: string };

export type EngineEdge = {
	id: string;
	source: string;
	target: string;
	// Optional branch key. A handler emits on a `handle`; only edges whose
	// `branch` matches that handle are followed. Unbranched edges are followed by
	// emissions that carry no handle.
	branch?: string;
};

// One value a node sends downstream: a real payload + which branch it leaves on.
export type Emission = { handle?: string; output: unknown };

// What a node returns after it runs. `emit: []` means the token stops here.
export type NodeRunResult = { emit: Emission[]; log?: string };

// The mutable world shared by every node in a single run (idempotency store, …).
export type NodeContext<World> = { world: World; signal: AbortSignal };

// A node's real logic: input from the previous node → output(s) for the next.
export type NodeHandler<World> = (
	input: unknown,
	ctx: NodeContext<World>,
) => NodeRunResult | Promise<NodeRunResult>;

// Each tick is shown in two phases so a token never moves while its source node
// is still computing: "execute" (nodes pending) then "transit" (tokens travel).
export type StepPhase = "execute" | "transit";

export type StepEvent = {
	tick: number;
	phase: StepPhase;
	// The wave's node ids: pending in "execute", finished in "transit".
	nodes: string[];
	// Tokens leaving the wave — populated only in the "transit" phase.
	travels: { edgeId: string; payload: unknown }[];
	// Human-readable lines, one per node that ran (carried on "execute").
	logs: { nodeId: string; message: string }[];
};

export type RunFlowArgs<World> = {
	nodes: EngineNode[];
	edges: EngineEdge[];
	handlers: Record<string, NodeHandler<World>>;
	entry: string;
	world: World;
	signal?: AbortSignal;
	// Delays so the animation is watchable: stepMs while a node runs, edgeMs while a
	// token crosses to the next node. edgeMs defaults to stepMs. Pass 0 in tests.
	stepMs?: number;
	edgeMs?: number;
	onStep?: (event: StepEvent) => void;
};
