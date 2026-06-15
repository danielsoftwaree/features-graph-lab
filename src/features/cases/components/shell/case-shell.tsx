import type { ReactNode } from "react";
import { CaseAppMockup } from "./case-app-mockup";
import { CaseCanvasPanel } from "./case-canvas-panel";
import { CaseHero } from "./case-hero";
import { CaseTopbar } from "./case-topbar";

interface CaseShellProps {
	canvas: ReactNode;
}

export function CaseShell({ canvas }: CaseShellProps) {
	return (
		<div className="flex h-dvh flex-col bg-background">
			<CaseTopbar />
			<CaseHero />
			<div className="flex min-h-0 flex-1 gap-6 px-6 pb-6">
				<CaseCanvasPanel canvas={canvas} />
				<CaseAppMockup />
			</div>
		</div>
	);
}
