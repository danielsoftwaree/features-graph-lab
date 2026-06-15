import { describe, expect, it } from "vitest";
import { toEngineEdges, toEngineNodes } from "@/shared/lib/flow-engine/adapter";
import { runFlow } from "@/shared/lib/flow-engine/engine";
import { doubleCharge } from "./double-charge";
import { createPaymentHandlers, createPaymentWorld } from "./double-charge.logic";

const engineNodes = toEngineNodes(doubleCharge.nodes);
const engineEdges = toEngineEdges(doubleCharge.edges);

function runMode(mode: GuardMode) {
	return runFlow({
		nodes: engineNodes,
		edges: engineEdges,
		handlers: createPaymentHandlers(mode),
		entry: doubleCharge.entryNodeId,
		world: createPaymentWorld(),
		stepMs: 0,
	});
}

type GuardMode = "broken" | "fixed";

describe("double-charge flow", () => {
	it("broken guard records the charge twice", async () => {
		const world = await runMode("broken");
		expect(world.charges).toHaveLength(2);
	});

	it("fixed guard records the charge exactly once", async () => {
		const world = await runMode("fixed");
		expect(world.charges).toHaveLength(1);
		expect(world.processedKeys.size).toBe(1);
	});
});
