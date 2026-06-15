import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface WireBoxProps {
	label?: string;
	className?: string;
	children?: ReactNode;
}

export function WireBox({ label, className, children }: WireBoxProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-xs text-muted-foreground",
				className,
			)}
		>
			{children ?? label}
		</div>
	);
}
