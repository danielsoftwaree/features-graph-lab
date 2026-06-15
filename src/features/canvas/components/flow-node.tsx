import { Handle, type NodeProps, Position } from "@xyflow/react";
import { cn } from "@/shared/lib/cn";
import type { FlowNode as FlowNodeType } from "@/shared/types/flow";

const CATEGORY_STYLES: Record<FlowNodeType["data"]["category"], string> = {
	user: "border-primary/60 text-primary bg-primary/5",
	system: "border-success/60 text-success bg-success/5",
	external: "border-border text-muted-foreground bg-muted/40",
	critical: "border-warning bg-warning-surface text-warning",
	failure: "border-destructive bg-destructive-surface text-destructive",
};

export function FlowNode({ data }: NodeProps<FlowNodeType>) {
	const { step, icon, title, description, owner, category } = data;

	return (
		<div
			className={cn(
				"w-44 rounded-lg border px-3 py-2.5 shadow-sm transition-shadow hover:shadow-md",
				CATEGORY_STYLES[category],
			)}
		>
			<Handle type="target" position={Position.Left} className="!bg-current" />
			<div className="mb-1 flex items-center gap-1.5 text-[11px] opacity-70">
				<span>{icon}</span>
				<span>{step}</span>
			</div>
			<div className="text-sm font-semibold leading-tight">{title}</div>
			<p className="mt-1 text-[11px] leading-snug text-foreground/70">{description}</p>
			<span className="mt-2 inline-block rounded border border-current/30 px-1.5 py-0.5 text-[10px] opacity-80">
				{owner}
			</span>
			<Handle type="source" position={Position.Right} className="!bg-current" />
		</div>
	);
}
