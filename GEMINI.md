# GEMINI.md - Frontend Stack Orchestration Entrypoint

> **AUTHORITATIVE FRONTEND GUIDE:**
> This directory (`frontend/`) is the modern administrative dashboard built with Next.js 16.2 (App Router), React 19, `@heroui/react` 3.x, Tailwind CSS 4, `@tanstack/react-query` 5, and `next-intl`.
> Refer directly to [frontend/AGENTS.md](file:///D:/dev/university-assistant-bot/frontend/AGENTS.md) for all detailed component APIs, form patterns, and validation workflows.

## Mandatory Frontend Execution Directives

1. **Sub-Agent Pipeline**:
   - `frontend-architect` ([frontend/.agents/agents/frontend-architect.md](file:///D:/dev/university-assistant-bot/frontend/.agents/agents/frontend-architect.md)) -> Design & Specs.
   - `frontend-engineer` ([frontend/.agents/agents/frontend-engineer.md](file:///D:/dev/university-assistant-bot/frontend/.agents/agents/frontend-engineer.md)) -> Code & Form Implementation.
   - `frontend-qa-tester` ([frontend/.agents/agents/frontend-qa-tester.md](file:///D:/dev/university-assistant-bot/frontend/.agents/agents/frontend-qa-tester.md)) -> Prop audit & `npx tsc --noEmit`.

2. **Mandatory Frontend Skills** ([frontend/.agents/skills/](file:///D:/dev/university-assistant-bot/frontend/.agents/skills/)):
   - **`frontend-page-architecture-and-i18n-standard`**: 5-layer page architecture (`page.tsx` -> `index.tsx` -> `client.tsx` -> `fallback.tsx` -> `schema.ts`) and zero-hardcoded-strings i18n rule.
   - **`component-utility-reuse-standard`**: The Rule of Three (extract to `src/components/shared` or `src/utils` if used > 2 times).
   - **`package-api-verification`**: Validate HeroUI v3 props and structure against installed node_modules.

3. **Governing Rules** ([frontend/.agents/rules/](file:///D:/dev/university-assistant-bot/frontend/.agents/rules/)):
   - **`i18n-mandate.md`**: **Strict Zero Hardcoded Strings Policy** — Writing human-readable text directly into TSX/TS/JSX is strictly banned; all strings must be placed in `messages/fa/` and loaded via `next-intl`.
   - **`frontend.md`**: HeroUI v3 component syntax, design tokens, and RTL guidelines.
   - **`architecture.md`**: 5-layer page architecture and module boundaries.

4. **Shared Components First**:
   - Always prioritize primitives in `src/components/shared` (`InputField`, `PasswordField`, `SelectUniversity`, `SelectCampus`, `SelectMajor`, `SelectCourse`, `SelectProfessor`, `RoleGuard`).
