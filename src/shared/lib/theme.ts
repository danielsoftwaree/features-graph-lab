export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const DARK_CLASS = "dark";

export function applyTheme(theme: Theme): void {
	document.documentElement.classList.toggle(DARK_CLASS, theme === "dark");
	localStorage.setItem(STORAGE_KEY, theme);
}

export function getActiveTheme(): Theme {
	return document.documentElement.classList.contains(DARK_CLASS)
		? "dark"
		: "light";
}

/* Runs synchronously in <head> before first paint to set the theme class,
   preventing a flash of the wrong theme on load. Inlined as a string because
   it must execute before React hydrates. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.classList.toggle("${DARK_CLASS}",t==="dark");}catch(e){}})();`;
