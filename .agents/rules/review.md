# Review, Validation, and Completion

Read this file near the end of a meaningful implementation and for standalone code-review tasks.

---

## 1. Reviewer Role

Review the final implementation objectively as if another engineer wrote it.

Check in this order:

1. **Requirements**: Does the change satisfy all requirements specified by the user?
2. **Regressions**: Are existing flows, routes, or forms intact and unbroken?
3. **Authorization & Security**: Are route guards (`RoleGuard`), role checks, and auth cookies properly preserved?
4. **Server vs. Client Boundaries**: Is `"use client"` placed only where necessary? Are Server Components used for data loading?
5. **Data Layer Correctness**: Are DTOs separated from domain models? Are mappers handling missing or null fields safely?
6. **Architecture & Ownership**: Do pages remain thin without direct data fetching?
7. **Duplication & Reuse**: Were existing components (`TableContainer`, `SearchInput`, `PasswordField`), hooks, and utilities reused?
8. **UI States**: Are loading skeletons, empty states, and error messages properly handled?
9. **RTL & Persian**: Does the UI display correctly in RTL without clipping, overflow, or inverted icons?
10. **Responsive Design**: Does the layout work well on mobile screens (`< 1024px`)?
11. **Naming & Maintainability**: Are files in `kebab-case` and types/components in `PascalCase`?
12. **Validation**: Do linter and build commands pass cleanly?

---

## 2. Severity Classification

- **Blocker**: Broken functionality, application crash, security risk, auth leak, or missing core requirement.
- **Major**: Architecture violation, missing essential loading/error state, regression, or unhandled null exception.
- **Minor**: Code inconsistency, formatting imperfection, or low-risk maintainability concern.
- **Nit**: Optional polish or stylistic improvement.

Fix all in-scope Blocker and Major issues before considering the implementation ready.

---

## 3. Test State

The repository currently has **no automated test suite**.

Do **not**:
- Claim that automated unit or e2e tests passed.
- Add test frameworks (Jest, Vitest, Playwright, Cypress) unless explicitly instructed by the user.
- Add fake or placeholder test files.

Always rely on actual validation commands (`pnpm lint`, `pnpm build`) and manual runtime checks.

---

## 4. Validation Workflow

Before finishing any task, run the validation commands from the project root:

```bash
# 1. Run ESLint
pnpm lint

# 2. Run TypeScript build verification
pnpm build
```

Both commands must exit with code 0 (zero errors).

If any errors occur:
- Fix the TypeScript or ESLint errors directly.
- Re-run the validation command to verify the fix.

---

## 5. Security Checklist

Verify that:
- [ ] No secrets or private environment variables are referenced in client components (`'use client'`).
- [ ] Authentication tokens are stored exclusively in HttpOnly cookies (`access_token`).
- [ ] Browser components only communicate with `/api/backend/*` (never directly with external backend URLs).
- [ ] Admin-only views or actions are wrapped in `<RoleGuard requiredRole="ADMIN">` or checked via `hasRole`.
- [ ] Form submissions validate input data with Zod before triggering network requests.

---

## 6. Completion Checklist

Before presenting your work:
- [ ] Implementation addresses the user's prompt directly and completely.
- [ ] Validation commands (`pnpm lint`, `pnpm build`) have executed successfully.
- [ ] Any new shared components, hooks, or utilities have been added to `.agent/registry.md`.
- [ ] No temporary debug logs (`console.log`) or scratch files are left behind.
