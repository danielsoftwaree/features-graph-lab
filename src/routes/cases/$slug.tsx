import { createFileRoute, notFound } from "@tanstack/react-router";
import { CaseFlow } from "@/features/canvas/components/canvas/case-flow";
import { CaseShell } from "@/features/cases/components/shell/case-shell";
import { doubleCharge } from "@/features/cases/data/double-charge";
import type { CaseData } from "@/features/cases/types/case";

const CASES: Record<string, CaseData> = {
	"double-charge": doubleCharge,
};

export const Route = createFileRoute("/cases/$slug")({
	loader: ({ params }) => {
		const caseData = CASES[params.slug];
		if (!caseData) throw notFound();
		return caseData;
	},
	component: CasePage,
});

function CasePage() {
	return <CaseShell canvas={<CaseFlow />} />;
}
