import { WireBox } from "@/shared/components/ui/wire-box";

export function CaseTopbar() {
	return (
		<div className="flex items-center justify-between px-6 py-4">
			<WireBox label="← Back to cases" className="h-8 w-36" />
			<div className="flex items-center gap-3">
				<WireBox label="View source on GitHub" className="h-8 w-44" />
				<WireBox label="☾" className="h-8 w-8" />
			</div>
		</div>
	);
}
