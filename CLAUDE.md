# FeatureGraph Lab — AI Agent Instructions

## Project

Next.js + TypeScript app. Visual pipeline explorer for business logic cases.
Stack: Next.js (App Router), TypeScript, @xyflow/react, Tailwind CSS.
No backend. No auth. No database. Static local data only.

## Naming

- Files and folders: `kebab-case` (e.g. `case-card.tsx`, `double-charge/page.tsx`).
- Components: `PascalCase`.
- Variables and functions: `camelCase`.
- Types and interfaces: `PascalCase`, no `I` prefix.

## Code rules

- Delete dead code — do not comment it out, do not keep it "just in case".
- No `any` in TypeScript. Use explicit types or `unknown`.
- No default exports except Next.js pages and layouts.
- No barrel re-exports (`index.ts` that just re-exports) unless there are 4+ items.
- No magic strings — put repeated literals in a `const` or type.
- No TODO comments in committed code — either fix it or create a task.
- No console.log in committed code.

## Component rules

- One component per file.
- Props interface defined in the same file, above the component.
- Keep components small — if it needs scrolling to read, split it.
- No logic inside JSX — extract to a variable or function above the return.

## Anti-patterns — never use

- God components (one component doing layout + state + data + logic).
- Prop drilling more than 2 levels deep — use context or co-location.
- `useEffect` for derived state — compute it inline or with `useMemo`.
- Fetching data inside components — data lives in server components or static files.
- Inline styles — use Tailwind classes.
- Premature abstraction — do not create a generic utility for something used once.

## Scope discipline

Do not add features not listed in the current task.
Do not refactor files not touched by the current task.
Do not add error handling for scenarios that cannot happen in a static app.
Do not add loading states for static local data.

## Data

Case data lives in `src/data/` as typed TypeScript objects.
No API calls. No fetch. No async data in components.

## Architecture — modular monolith

Each feature is a self-contained folder under `src/features/`. It owns its components, data, types, and hooks. Nothing inside a feature imports from another feature — cross-feature dependencies go through `src/shared/`.

### Rules

- A feature imports from `shared/`, never from another feature.
- `shared/` contains only things used by 2+ features.
- `app/` contains only Next.js routing files — no logic, no components.
- Page files import from features, not from `shared/` directly.

### File structure

```
src/
  app/
    page.tsx                        # imports from features/landing
    cases/
      [slug]/
        page.tsx                    # imports from features/cases
  features/
    landing/
      components/
        hero.tsx
        case-card.tsx
        cases-section.tsx
    cases/
      components/
        case-header.tsx
        business-situation.tsx
        final-lesson.tsx
        business-impact-panel.tsx
        fake-test-panel.tsx
      data/
        double-charge.ts
        referral-abuse.ts
        last-item-race.ts
      types/
        case.ts
    canvas/
      components/
        node-canvas.tsx
        custom-node.tsx
        node-detail-panel.tsx
        broken-mode-toggle.tsx
      hooks/
        use-broken-mode.ts
  shared/
    components/
      ui/                           # reusable primitives (badge, panel, etc.)
    types/
      index.ts
    lib/
      cn.ts                         # classname utility
```

## Before implementing

If the task is non-trivial, write a short file/component plan as a code comment block at the top of your response, then implement it. Do not invent scope beyond what was asked.
