import { createFileRoute } from "@tanstack/react-router";
import { CasesSection } from "@/features/landing/components/cases-section";
import { Hero } from "@/features/landing/components/hero";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
	return (
		<main className="min-h-screen bg-zinc-950">
			<Hero />
			<CasesSection />
		</main>
	);
}
