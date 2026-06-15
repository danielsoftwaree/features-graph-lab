import { createFileRoute, notFound } from "@tanstack/react-router";
import { NodeCanvas } from "@/features/canvas/components/node-canvas";
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
	const caseData = Route.useLoaderData();

	return (
		<div className="flex h-dvh flex-col bg-zinc-950">
			<header className="flex shrink-0 items-center border-b border-zinc-800 px-6 py-3">
				<h1 className="text-sm font-medium text-zinc-400">{caseData.title}</h1>
			</header>
			<div className="min-h-0 flex-1">
				<NodeCanvas
					nodes={caseData.nodes}
					edges={caseData.edges}
					criticalNodeId={caseData.criticalNodeId}
				/>
			</div>
		</div>
	);
}
