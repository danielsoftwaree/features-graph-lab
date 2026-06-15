"use client";

import type { ReactNode } from "react";
import { FLOW_STEP_MS, FlowRuntimeProvider } from "@/shared/flow-runtime";
import {
	createPaymentHandlers,
	createPaymentWorld,
} from "../../data/double-charge.logic";
import type { CaseData } from "../../types/case";
import { CaseAppMockup } from "./case-app-mockup";
import { CaseCanvasPanel } from "./case-canvas-panel";
import { CaseHero } from "./case-hero";
import { CaseTopbar } from "./case-topbar";

interface CaseShellProps {
	caseData: CaseData;
	canvas: ReactNode;
}

// The double-charge handlers are wired in directly. A second case would add a
// slug → { createWorld, createHandlers } registry here.
export function CaseShell({ caseData, canvas }: CaseShellProps) {
	return (
		<div className="flex h-dvh flex-col bg-background">
			<CaseTopbar />
			<CaseHero />
			<FlowRuntimeProvider
				nodes={caseData.nodes}
				edges={caseData.edges}
				entryNodeId={caseData.entryNodeId}
				createWorld={createPaymentWorld}
				createHandlers={createPaymentHandlers}
				stepMs={FLOW_STEP_MS}
			>
				<div className="flex min-h-0 flex-1 gap-6 px-6 pb-6">
					<CaseCanvasPanel canvas={canvas} />
					<CaseAppMockup />
				</div>
			</FlowRuntimeProvider>
		</div>
	);
}
