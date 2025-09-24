# UI Components – Local Build Rules
- Use the **React-Component-Guru** agent for all edits here.
- One public component per file; keep helpers in `/internal/` sub-folder.
- Co-locate tests (`*.test.tsx`) and stories (`*.stories.tsx`) beside each file.
- Enforce WCAG 2.1 AA, full keyboard support, and strict TypeScript.
- All changes must run `pnpm lint && pnpm test` clean.

## Per-Component Notes
| Component        | Extra rules & tips                                  |
| ---------------- | --------------------------------------------------- |
| GlobalSearch     | Debounce 300 ms; hit `/api/search` with SWR.        |
| Pagination       | Support both page-index **and** cursor mode.        |
| ReusableTable    | Follow Table Extension rules (core <50 LOC, etc.).  |
| ThemeProvider    | Provide light/dark & high-contrast; expose hook.    |
| ToggleSwitch     | Integrate with `react-hook-form`; arrow keys L/R.   |
| ViewEditor       |       |

> Claude: Ask clarifying questions if a request breaks these constraints.

# ReusableTable – Local Build Rules
- Follow the **React-Component-Guru** agent.
- File naming: `ReusableTable.*`.
- Keep public props in `/types.ts`; private helpers in `/internal/`.
- All new features must respect the Table Extension Rules (see below).

## Extension Rules (summary)
Add inside `ReusableTable` only if:
• Core table logic, tightly coupled, <50 LOC.

Extract into hook/component/utility if:
• Stand-alone, reusable, >50 LOC, or external I/O.

Examples:  
• Row drag→ `useDragAndDrop.ts`  
• CSV export→ `exportUtils.ts`

> Claude: Ask clarifying questions if a request violates these rules.
