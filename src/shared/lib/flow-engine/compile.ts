import type { NodeHandler, NodeRunResult } from "./types";

// Turn an editable code string into a runnable node handler.
//
// The graph is a local, single-user sandbox: the only code that runs through
// here is the user's own, typed into their own browser tab, with no backend in
// reach. `new Function` is the right tool for that.
// ponytail: trusted local sandbox — move to a worker/iframe only if untrusted
// code ever needs to run here.

export class HandlerCompileError extends Error {
	constructor(
		readonly nodeId: string,
		message: string,
	) {
		super(message);
		this.name = "HandlerCompileError";
	}
}

export class HandlerRuntimeError extends Error {
	constructor(
		readonly nodeId: string,
		message: string,
	) {
		super(message);
		this.name = "HandlerRuntimeError";
	}
}

type RawHandler = (input: unknown, ctx: unknown) => unknown;

function messageOf(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

function compileOne(nodeId: string, source: string): RawHandler {
	let value: unknown;
	try {
		// Newline-pad so a trailing line comment in `source` can't swallow the ")".
		value = new Function(`"use strict"; return (\n${source}\n);`)();
	} catch (error) {
		throw new HandlerCompileError(nodeId, messageOf(error));
	}
	if (typeof value !== "function") {
		throw new HandlerCompileError(nodeId, "Code must evaluate to a function");
	}
	return value as RawHandler;
}

export function compileHandlers<World>(
	code: Record<string, string>,
): Record<string, NodeHandler<World>> {
	const handlers: Record<string, NodeHandler<World>> = {};
	for (const [nodeId, source] of Object.entries(code)) {
		const fn = compileOne(nodeId, source);
		handlers[nodeId] = (input, ctx) => {
			try {
				return fn(input, ctx) as NodeRunResult | Promise<NodeRunResult>;
			} catch (error) {
				throw new HandlerRuntimeError(nodeId, messageOf(error));
			}
		};
	}
	return handlers;
}
