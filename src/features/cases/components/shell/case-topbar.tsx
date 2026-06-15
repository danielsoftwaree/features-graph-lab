import { Link } from "@tanstack/react-router";
import { ArrowLeft, Github } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";

const REPO_URL = "https://github.com/danielsoftwaree/features-graph-lab";

export function CaseTopbar() {
	return (
		<div className="flex items-center justify-between px-6 py-4">
			<Button asChild variant="ghost" size="sm">
				<Link to="/">
					<ArrowLeft />
					Back to cases
				</Link>
			</Button>
			<div className="flex items-center gap-3">
				<Button asChild variant="outline" size="sm">
					<a href={REPO_URL} target="_blank" rel="noreferrer noopener">
						<Github />
						View source on GitHub
					</a>
				</Button>
				<ThemeToggle />
			</div>
		</div>
	);
}
