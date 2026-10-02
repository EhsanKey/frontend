# Master Frontend Orchestration Guide (`AGENTS.md`)

## 1. System Overview & Core Philosophy

This directory is **`nextjs-dashboard-boilerplate`**: the modern administrative dashboard frontend for `university-assistant-bot`, built with Next.js 16.2 (App Router), React 19, `@heroui/react` 3.x, Tailwind CSS 4, `@tanstack/react-query` 5, and `next-intl`.

The frontend architecture is guided by three principles:
1. **Never Guess Component APIs**: With third-party UI libraries (especially `@heroui/react` 3.x and `react-aria`), always verify component syntax, props, and compound structures against local node_modules declarations or web documentation before writing code.
2. **Server-First, Client-Bound**: Next.js App Router entrypoints (`page.tsx`) remain Server Components where possible; interactive boundaries are encapsulated in `src/modules/<feature>/` as Client Components.
3. **Decoupled Data Architecture**: Raw backend API payloads are normalized into typed DTOs and pure domain models (`src/models/`). UI components never consume untyped or ad-hoc data.

---

## 2. Frontend Sub-Agent Roster

Google Antigravity orchestrates three specialized sub-agents located in `.agents/agents/`:

```text
┌─────────────────────────────────────────────────────────────┐
│             Frontend Master Orchestrator                    │
│             (Context & Task Delegation Router)              │
└──────┬───────────────────────┬───────────────────────┬──────┘
       │ 1. Spec & UX Plan     │ 2. Implementation     │ 3. Verification
       ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│frontend-architect│──▶│frontend-engineer │──▶│frontend-qa-tester│
│(.agents/agents/  │   │(.agents/agents/  │   │(.agents/agents/  │
│frontend-architect│   │frontend-engineer │   │frontend-qa-tester│
│      .md)        │   │      .md)        │   │      .md)        │
└──────────────────┘   └──────────────────┘   └──────────────────┘
       ▲                                               │
       └────────────── Diagnostic Remediation Loop ────┘
```

| Agent Name | Definition File | Role & Scope | Tool Access | Deliverable |
| :--- | :--- | :--- | :--- | :--- |
| **`frontend-architect`** | [`.agents/agents/frontend-architect.md`](file:///.agents/agents/frontend-architect.md) | Component hierarchy, Next.js routing, TanStack Query modeling, and spec drafting. | Read-Only (view, grep, list, web search) | `[FRONTEND SPEC]` & Task Plan |
| **`frontend-engineer`** | [`.agents/agents/frontend-engineer.md`](file:///.agents/agents/frontend-engineer.md) | UI implementation, HeroUI 3.x components, React Hook Form, and page wiring. | File Authoring (replace, write, view, grep) | Code changes & Handover Report |
| **`frontend-qa-tester`** | [`.agents/agents/frontend-qa-tester.md`](file:///.agents/agents/frontend-qa-tester.md) | Static HeroUI prop auditing, TypeScript validation, build and lint execution. | Execution & Audit (run_command, grep, view) | Quality Gate Verdict (`APPROVED` / `REJECTED`) |

---

## 3. Spec-Driven Frontend SDLC

1. **Architecture & Design**: `frontend-architect` analyzes user requirements, checks existing modules in `src/modules/`, selects exact HeroUI v3 components, and drafts the Technical Spec.
2. **Implementation**: `frontend-engineer` writes DTOs, domain models, feature components, and forms following the spec.
3. **Verification**: `frontend-qa-tester` executes a static grep audit for banned props (`isLoading`, `startContent`, etc.) and runs `pnpm build` / `pnpm lint`.
4. **Remediation Loop**: Any prop violation or build break triggers a Diagnostic Report back to `frontend-engineer` until 100% compliant.

---

## 4. Shared Components & Primitives (`src/components/shared`)

> [!IMPORTANT]
> **MANDATORY 1ST PRIORITY**: Before writing any select element, search bar, password input, or entity picker, ALL agents MUST use the shared components in `src/components/shared`. Ad-hoc implementations and raw `<select>` tags are strictly prohibited.

| Component | Export Path | Primary Purpose |
| :--- | :--- | :--- |
| **`SelectUniversity`** | `@/components/shared` | Searchable university autocomplete with debounced API search (`lookupUniversities`), clearability. |
| **`SelectCampus`** | `@/components/shared` | Searchable campus / faculty autocomplete with optional `universityId` scoping (`lookupCampuses`). |
| **`SelectMajor`** | `@/components/shared` | Searchable major autocomplete with debounced API search (`lookupMajors`). |
| **`SelectCourse`** | `@/components/shared` | Searchable course autocomplete with debounced API search (`lookupCourses`). |
| **`SelectProfessor`** | `@/components/shared` | Searchable professor autocomplete with debounced API search (`lookupProfessors`). |
| **`SelectTeaching`** | `@/components/shared` | Searchable teaching autocomplete with professor/course scoping (`lookupTeachings`). |
| **`LookupAutocomplete`** | `@/components/shared` | Generic accessible entity autocomplete primitive with popover, debounce, and keyboard nav. |
| **`SearchInput`** | `@/components/shared` | Standard search input with debounced query emission, clear button, and accessible labels. |
| **`InputField`** | `@/components/shared` | Standard accessible text input primitive replacing React Aria `<TextField>` to eliminate uncontrolled state clearing on click/focus. |
| **`PasswordField`** | `@/components/shared` | Standard password input with reveal/hide eye toggle and `react-hook-form` registration. |
| **`RoleGuard`** | `@/components/shared` | Declarative RBAC permission authorization wrapper supporting blur-on-denied. |
| **`CheckboxField`** | `@/components/shared` | Accessible checkbox wrapper with label, helper text, and error states. |
| **`SwitchField`** | `@/components/shared` | Accessible toggle switch with description and smooth animation. |
| **`ThemeToggle`** | `@/components/shared` | Smooth dark/light/system theme switcher with zero-flash persistence. |
| **`Logo`** | `@/components/shared` | Centralized application logo with responsive size tokens. |
| **`TelegramEditor`** | `@/components/shared` | Rich Telegram editor with HTML formatting toolbar, tags validation, char counter, and dynamic placeholders (`{نام_دانشجو}`, `{نام_استاد}`, `{نام_درس}`). |
| **`TelegramLivePreview`** | `@/components/shared` | Simulated mobile phone preview with Telegram bubbles, dynamic sample placeholder replacements, and inline buttons. |
| **`InlineKeyboardBuilder`** | `@/components/shared` | Grid builder for Telegram inline buttons with links, callbacks, and responsive rows. |
| **`StatCard`** | `@/components/shared` | Standardized metrics card displaying icon, label, and formatted numbers with variant colors (primary, success, warning, danger, neutral). |
| **`AcademicScopeFields`** | `@/components/shared` | Composite selector for University, Campus, and Major with automated cascading resets and customizable grid/stack layouts. |



---

## 5. Skills & Reference Rules

- **Active Skills**:
  * [`.agents/skills/frontend-page-architecture-and-i18n-standard/SKILL.md`](file:///.agents/skills/frontend-page-architecture-and-i18n-standard/SKILL.md): **5-Layer Page Architecture & i18n Localization Standard** (Entrypoint `page.tsx` -> Server Module `index.tsx` with `await connection()` -> Client Module `*-client.tsx` with `usePostRequest` -> Skeleton `*-fallback.tsx` -> Schema `*.schema.ts`, and zero hardcoded strings).
  * [`.agents/skills/component-utility-reuse-standard/SKILL.md`](file:///.agents/skills/component-utility-reuse-standard/SKILL.md): **The Rule of Three** (> 2 usages triggers mandatory extraction to `src/components/shared` or `src/utils`, plus instant AI/Agent documentation).
  * [`.agents/skills/package-api-verification/SKILL.md`](file:///.agents/skills/package-api-verification/SKILL.md): Crucial guide for HeroUI v3 prop contracts.
- **Architecture Guidelines**: [`.agents/rules/architecture.md`](file:///.agents/rules/architecture.md).
- **Engineering Standards**: [`.agents/rules/engineering.md`](file:///.agents/rules/engineering.md).
- **Design System Rules**: [`.agents/rules/frontend.md`](file:///.agents/rules/frontend.md).
- **Zero Hardcoded Strings Mandate**: [`.agents/rules/i18n-mandate.md`](file:///.agents/rules/i18n-mandate.md).
- **API & Data Rules**: [`.agents/rules/api.md`](file:///.agents/rules/api.md).
- **Review Checklist**: [`.agents/rules/review.md`](file:///.agents/rules/review.md).

