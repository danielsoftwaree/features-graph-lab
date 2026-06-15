import { WireBox } from "@/shared/components/ui/wire-box";

export function CaseHero() {
	return (
		<div className="flex flex-col gap-4 px-6 pb-6">
			<div className="flex items-center gap-3">
				<WireBox label="Case Title" className="h-9 w-80 justify-start px-3" />
				<WireBox label="STATUS" className="h-6 w-20" />
			</div>
			<WireBox label="Subtitle / one-line summary" className="h-5 w-96 justify-start px-3" />
			<div className="flex items-center gap-3">
				<WireBox label="Meta pill" className="h-9 w-52" />
				<WireBox label="Meta pill" className="h-9 w-52" />
			</div>
		</div>
	);
}
