"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, getActiveTheme, type Theme } from "@/shared/lib/theme";

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("dark");

	// Sync from the DOM after hydration — the anti-FOUC script set it pre-paint.
	useEffect(() => {
		setTheme(getActiveTheme());
	}, []);

	const next: Theme = theme === "dark" ? "light" : "dark";

	function handleClick() {
		applyTheme(next);
		setTheme(next);
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label={`Switch to ${next} theme`}
			className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
		>
			{theme === "dark" ? (
				<Sun className="size-4" />
			) : (
				<Moon className="size-4" />
			)}
		</button>
	);
}
