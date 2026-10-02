# Engineering Rules

Read this file for general implementation, React/Next.js structure, naming, exports, and code-quality decisions.

---

## 1. Role & Engineering Principles

Implement as a **Senior Software Engineer**:

- Understand requested behavior thoroughly before writing code.
- Inspect similar code in the repository first.
- Preserve existing architectural boundaries.
- **Reuse before creating** — check existing utilities, constants, hooks, and components.
- Avoid unrelated refactors or formatting changes in untouched files.
- Avoid speculative abstractions; solve the concrete requirement.
- Keep the change as small as possible without sacrificing quality, maintainability, or readability.

---

## 2. Technology Stack

- **Framework**: Next.js 16.2 (App Router with Turbopack)
- **Runtime / UI**: React 19, React DOM 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4, CSS variables tokens
- **Component Library**: HeroUI 3 (`@heroui/react`)
- **Icons**: Lucide React (`lucide-react`)
- **Localization**: next-intl
- **HTTP Client**: Axios
- **Server Cache**: @tanstack/react-query (accessed via repository wrappers)
- **Forms & Validation**: React Hook Form (`react-hook-form`) + Zod (`zod`)
- **Package Manager**: pnpm

---

## 3. Route Entrypoints

Keep `src/app/**/page.tsx` and `layout.tsx` thin.

Page component names must be explicit PascalCase names ending in `Page`.

Example:
```tsx
export default function ItemsPage() {}
```

Do not use generic lowercase entrypoint function names such as `page`.

Pages are primarily responsible for:
1. Calling `generateMetadata` for page titles and SEO.
2. Handling route parameter parsing (`params`, `searchParams`).
3. Applying route-level guards (such as `<RoleGuard>`).
4. Invoking the respective feature module.

**Pages MUST NOT fetch data directly.** Data fetching belongs in the module layer.

---

## 4. Server / Client Boundaries

- Prefer **Server Components** by default for improved performance, SEO, and bundle size.
- Use `"use client"` only when components require React state, lifecycle effects, browser APIs, event handlers, or client-only hooks.
- Push `"use client"` as far down the component tree as possible.
- Do not make top-level layouts or provider wrappers Client Components unless strictly required.

---

## 5. Module Convention

Each feature module under `src/modules/<feature>` should follow this structure:

- `index.tsx`: Main module entrypoint and Server Component. Performs server-side data fetching and wraps the client view in `<Suspense>`.
- `<feature>-client.tsx`: Dedicated Client Component boundary managing UI state, filters, and modals.
- `<feature>.server.ts`: Server-only data loader functions (if data fetching logic is non-trivial).
- `<feature>-table.tsx`: Data table presentation using `TableContainer`.
- `<feature>-filters/`: Filter toolbar and search input controlling URL query parameters.
- `<feature>-modals/`: Create/Edit/Delete modals with forms.
- `<feature>.schema.ts`: Zod validation schemas for forms.
- `types.ts`: Module-local UI types.

---

## 6. Reuse, Extraction Hierarchy & The Rule of Three

1. **Shared Components 1st Priority**:
   - Always prioritize existing components in `src/components/shared/` (`SelectUniversity`, `SelectCampus`, `SelectMajor`, `SearchInput`, `PasswordField`, etc.).
   - Creating hand-coded duplicates or raw `<select>` tags is strictly forbidden.

2. **The Rule of Three Standard (`> 2` Occurrences)**:
   - If any component pattern, UI element, or utility function is needed or implemented in **more than two places (> 2 occurrences)** across the monorepo:
     * **Immediate Extraction**: It MUST be extracted into a reusable abstraction (`src/components/shared/` for UI components, `src/utils/` for helper functions).
     * **Refactor Call Sites**: All existing and new locations must be refactored to consume the single source of truth.
     * **Mandatory AI Registration**: The new component or utility MUST be introduced and documented in `frontend/AGENTS.md` and agent rule files so all AI agents can leverage it immediately (refer to `.agents/skills/component-utility-reuse-standard/SKILL.md`).

3. **Layer Placement Hierarchy**:
   - Repeated pure helper logic → `src/utils/`
   - Repeated configuration, routes, query keys → `src/constants/`
   - Repeated UI inside a single module (< 3 occurrences) → `src/modules/<feature>/components/`
   - Repeated UI across multiple modules or > 2 occurrences → `src/components/shared/`
   - Generic composite layout or data grids → `src/containers/`
   - Clean domain models → `src/models/`

Do not generalize prematurely for hypothetical future use cases, but always enforce extraction immediately once the 3rd usage arises.

---

## 7. Naming Conventions

- **Files and folders inside `src`**: Use `kebab-case`.
  - Examples: `search-input.tsx`, `use-query-state.ts`, `password-field.tsx`.
- **Exceptions**:
  - Next.js dynamic routes (`[id]`, `(auth)`, `(protected)`).
  - API convention files: `_dto.ts`, `_mappers.ts`, `_endpoints.ts`, `_services.ts`, `_types.ts`.
- **Components**: PascalCase (e.g. `ItemsTable`, `TableContainer`).
- **Hooks**: camelCase starting with `use` (e.g. `useQueryState`, `useAuth`).
- **Localization JSON files**: camelCase in `messages/fa/<namespace>.json`.

---

## 8. Imports and Path Aliases

Always use the `@/` path alias for imports within `src`:

```tsx
// Correct:
import { TableContainer } from '@/containers';
import { useQueryState } from '@/hooks';
import { ROUTES } from '@/constants';

// Incorrect:
import { TableContainer } from '../../../containers';
```

Avoid circular dependencies. Import types using `import type { ... }`.

---

## 9. State Management Rules

1. **URL Query State (`useQueryState`)**:
   - Filter criteria (e.g., `search`, `status`, `page`, `perPage`) must live in the URL search parameters.
   - This ensures table views are shareable, refreshable, and maintain state on navigation.
2. **Server State (`useGetRequest` / `usePostRequest`)**:
   - Wrap remote data fetching in `useGetRequest` using query keys from `src/constants/query-keys.ts`.
   - Invalidate queries on successful mutations.
3. **Form State (`react-hook-form` + `zod`)**:
   - All forms must use `react-hook-form` with `zodResolver`.
   - Never use uncontrolled inputs without validation in forms.
4. **Global Session State (`useAuth`)**:
   - User profile and authentication status are managed via `AuthContext` and accessed with `useAuth()`.
