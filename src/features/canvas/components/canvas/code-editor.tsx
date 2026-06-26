"use client";

import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
	value: string;
	onChange: (value: string) => void;
}

// CodeMirror is created in an effect so it only ever touches the DOM on the
// client (the editor div renders empty during SSR, then attaches on mount).
export function CodeEditor({ value, onChange }: CodeEditorProps) {
	const parentRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<EditorView | null>(null);
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	// biome-ignore lint/correctness/useExhaustiveDependencies: create the editor once — `value` seeds the initial doc; later external changes are synced by the effect below, and onChange is read through a ref.
	useEffect(() => {
		if (!parentRef.current) return;
		const view = new EditorView({
			doc: value,
			parent: parentRef.current,
			extensions: [
				basicSetup,
				javascript({ typescript: true }),
				oneDark,
				EditorView.updateListener.of((update) => {
					if (update.docChanged)
						onChangeRef.current(update.state.doc.toString());
				}),
			],
		});
		viewRef.current = view;
		return () => {
			view.destroy();
			viewRef.current = null;
		};
	}, []);

	// Push external value changes (Reset, or a fresh node) into the editor without
	// fighting the user's own typing.
	useEffect(() => {
		const view = viewRef.current;
		if (!view) return;
		const current = view.state.doc.toString();
		if (value !== current) {
			view.dispatch({
				changes: { from: 0, to: current.length, insert: value },
			});
		}
	}, [value]);

	return (
		<div
			ref={parentRef}
			className="overflow-hidden rounded-lg border border-border text-xs [&_.cm-editor]:max-h-[44vh] [&_.cm-editor]:bg-transparent [&_.cm-focused]:outline-none [&_.cm-gutters]:border-none"
		/>
	);
}
