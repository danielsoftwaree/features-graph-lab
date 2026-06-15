# FeatureGraph Lab — AI Agent Instructions

## Project

Next.js + TypeScript visual pipeline explorer. Business logic cases shown as interactive node graphs.
Stack: Next.js App Router, TypeScript, @xyflow/react, Tailwind CSS.
No backend, no auth, no database, no external API calls.

## Naming conventions

- Files and folders: `kebab-case`.
- React components: `PascalCase`.
- Variables and functions: `camelCase`.
- Types and interfaces: `PascalCase`, no `I` prefix (e.g. `CaseNode`, not `ICaseNode`).

## Hard rules

1. **No dead code.** Remove unused variables, functions, imports, and components. Do not comment out code.
2. **No `any`.** Use explicit TypeScript types. Use `unknown` when the type is genuinely unknown.
3. **No magic strings.** Extract repeated string literals to a named constant or enum.
4. **No TODO comments** in committed code.
5. **No `console.log`** in committed code.
6. **No default exports** except Next.js pages (`page.tsx`, `layout.tsx`).
7. **No inline styles.** Use Tailwind classes only.
8. **No prop drilling** beyond 2 levels. Use context or co-locate state.
9. **No `useEffect` for derived state.** Compute it directly or use `useMemo`.
10. **No premature abstraction.** Do not create a shared utility for logic used in one place.

## Scope rules

- Implement only what the task explicitly asks for.
- Do not touch files unrelated to the current task.
- Do not add features "while you're at it."
- Do not add loading spinners or error boundaries for static local data.

## Component rules

- One component per file.
- Props interface defined in the same file, directly above the component.
- No business logic inside JSX. Extract to variables or functions above `return`.
- If a component exceeds ~80 lines, consider splitting.

## Data layer

- All case data is static TypeScript in `src/data/cases.ts`.
- No fetch calls. No async components for data. No SWR, React Query, or similar.
- Types for case data live in `src/types/case.ts`.

## Architecture — modular monolith

Each feature owns its components, data, types, and hooks under `src/features/<name>/`.
Cross-feature dependencies are not allowed — shared code lives in `src/shared/`.
`src/app/` contains only Next.js routing files, no logic or components.

### Import rules

- Feature code imports from `shared/` only — never from another feature.
- `shared/` contains only things used by 2 or more features.
- Page files (`app/**/page.tsx`) import from features.

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

## Before writing code

For any non-trivial task: output a short plan (which files change, what each component does) before writing code. Keep the plan to 5–10 lines. Then implement.
