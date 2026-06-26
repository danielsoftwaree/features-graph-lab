interface CaseHeroProps {
	title: string;
	situation: string;
}

// Compact by design — the lab below fills the rest of the locked viewport, so the
// hero stays to two short rows: title + the one-paragraph scenario.
export function CaseHero({ title, situation }: CaseHeroProps) {
	return (
		<div className="flex flex-col gap-1.5 px-6 pb-5">
			<h1 className="text-2xl font-semibold tracking-tight text-foreground">
				{title}
			</h1>
			<p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
				{situation}
			</p>
		</div>
	);
}
