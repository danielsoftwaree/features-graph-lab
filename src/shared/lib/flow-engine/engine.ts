import type { Emission, EngineEdge, RunFlowArgs, StepEvent } from "./types";

const DEFAULT_STEP_MS = 600;
// Safety net: our flows re-enter nodes (the retry loop), so cap total ticks in
// case a handler misbehaves. Real flows finish in ~10 ticks.
const MAX_TICKS = 100;

type FrontierItem = { nodeId: string; input: unknown };

export async function runFlow<World>(args: RunFlowArgs<World>): Promise<World> {
	const {
		nodes,
		edges,
		handlers,
		entry,
		world,
		signal,
		stepMs = DEFAULT_STEP_MS,
		onStep,
	} = args;

	const nodeIds = new Set(nodes.map((n) => n.id));
	if (!nodeIds.has(entry)) {
		throw new Error(`runFlow: unknown entry node "${entry}"`);
	}

	const ctxSignal = signal ?? new AbortController().signal;
	let frontier: FrontierItem[] = [{ nodeId: entry, input: undefined }];
	let tick = 0;

	while (frontier.length > 0 && tick < MAX_TICKS) {
		if (ctxSignal.aborted) break;
		tick += 1;

		// Run every ready node concurrently — parallel branches execute together.
		const results = await Promise.all(
			frontier.map(async ({ nodeId, input }) => {
				const handler = handlers[nodeId];
				if (!handler) {
					throw new Error(`runFlow: no handler for node "${nodeId}"`);
				}
				return { nodeId, result: await handler(input, { world, signal: ctxSignal }) };
			}),
		);

		const waveNodes = frontier.map((f) => f.nodeId);
		const logs: StepEvent["logs"] = [];
		for (const { nodeId, result } of results) {
			if (result.log) logs.push({ nodeId, message: result.log });
		}

		// Phase 1 — execute: the wave's nodes are pending. Nothing travels yet, so
		// an edge never animates while its source node is still computing.
		onStep?.({ tick, phase: "execute", nodes: waveNodes, travels: [], logs });
		if (stepMs > 0) await delay(stepMs, ctxSignal);
		if (ctxSignal.aborted) break;

		// Route each node's real output to its outgoing edges.
		const next: FrontierItem[] = [];
		const travels: StepEvent["travels"] = [];
		for (const { nodeId, result } of results) {
			for (const emission of result.emit) {
				for (const edge of routeEdges(edges, nodeId, emission)) {
					travels.push({ edgeId: edge.id, payload: emission.output });
					next.push({ nodeId: edge.target, input: emission.output });
				}
			}
		}

		// Phase 2 — transit: the wave's nodes are done; their tokens travel to the
		// next wave, which only lights up on its own execute phase.
		onStep?.({ tick, phase: "transit", nodes: waveNodes, travels, logs: [] });
		if (stepMs > 0 && next.length > 0) await delay(stepMs, ctxSignal);
		frontier = next;
	}

	return world;
}

// An emission with no handle follows unbranched edges; an emission with a handle
// follows only edges whose branch matches it.
function routeEdges(
	edges: EngineEdge[],
	source: string,
	emission: Emission,
): EngineEdge[] {
	return edges.filter(
		(edge) =>
			edge.source === source &&
			(emission.handle === undefined
				? edge.branch === undefined
				: edge.branch === emission.handle),
	);
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
	return new Promise((resolve) => {
		if (signal.aborted) {
			resolve();
			return;
		}
		const id = setTimeout(resolve, ms);
		signal.addEventListener(
			"abort",
			() => {
				clearTimeout(id);
				resolve();
			},
			{ once: true },
		);
	});
}
