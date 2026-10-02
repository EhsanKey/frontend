---
name: frontend-page-architecture-and-i18n-standard
description: Standard guidelines for 5-layer page architecture and complete i18n localization in the Next.js/HeroUI frontend monorepo.
---

# Frontend Page Architecture & i18n Localization Standard

## 1. Overview
This skill provides mandatory architectural standards for developing pages and managing localization in the `frontend` application of the `university-assistant-bot` monorepo. All autonomous coding agents and engineers must adhere strictly to these principles.

---

## 2. Mandatory 5-Layer Page Architecture

When creating or refactoring dedicated management/action pages (such as `/dashboard/users/create`, `/dashboard/reviews/[id]`, or `/dashboard/broadcasts/create`), the following 5 distinct layers must be implemented without exception:

### Layer 1: Route Entrypoint (`src/app/(protected)/dashboard/.../page.tsx`)
- **Responsibilities**:
  - Accept and resolve route parameters (`params: Promise<{ id: string }>` in Next.js 16).
  - Export dynamic `generateMetadata` using server translations via `getTranslations()`.
  - Wrap content with `<RoleGuard permission="...">` for granular permission enforcement.
  - Call the corresponding Server Module component (`<EntityManageModule ... />`).
  - **CRITICAL**: No direct data fetching (`fetch`, `client...Services`, etc.) is permitted in this file.

### Layer 2: Server Module (`src/modules/.../index.tsx`)
- **Responsibilities**:
  - Acts as a Server Component (`server-only`).
  - Enforces dynamic rendering using `await connection()` from `next/server`.
  - Performs server-side data fetching using `server...Services` from `@/apis/services/.../server`.
  - Handles 404 conditions cleanly using `notFound()` from `next/navigation`.
  - Wraps the Client Module in `<Suspense fallback={<EntityFallback />}>`.

### Layer 3: Client Module (`src/modules/.../...-client.tsx`)
- **Responsibilities**:
  - Begins with `'use client'`.
  - Manages forms with `react-hook-form` and `@hookform/resolvers/zod`.
  - Manages UI state, tab navigation, search queries, and modals.
  - Performs client mutations using the standardized `usePostRequest` hook with `client...Services`.
  - Redirects using `router.push('/dashboard/...')` upon successful operations.
  - Employs decoy inputs (`prevent_autofill_...`) where browser auto-fill heuristics need to be suppressed.

### Layer 4: Fallback Skeleton (`src/modules/.../skeleton/...-fallback.tsx`)
- **Responsibilities**:
  - Provides a pixel-aligned loading skeleton using HeroUI `<Skeleton />`.
  - Matches the exact layout, header, form cards, and action buttons of the Client Module.
  - Prevents Cumulative Layout Shift (CLS).

### Layer 5: Validation Schema (`src/modules/.../*.schema.ts`)
- **Responsibilities**:
  - Declares schemas using `zod`.
  - Contains localized Persian validation messages.
  - Defines and exports TypeScript form types (`z.infer<typeof schema>`).

---

## 3. Strict Internationalization (i18n) Rules

> [!IMPORTANT]
> **GOVERNING RULE**: All agents and engineers must strictly follow [frontend/.agents/rules/i18n-mandate.md](file:///d:/dev/university-assistant-bot/frontend/.agents/rules/i18n-mandate.md).

### 3.1 Zero Hardcoded Strings Policy
- **Never** hardcode Persian, English, or any human-readable strings directly into JSX/TSX components, placeholders, buttons, toasts, modals, or Zod schemas.
- All copy, button labels, placeholders, titles, notifications, and tooltips must be defined in `frontend/messages/fa/*.json`.
- **Sole Exception**: Dev-time mock store fixtures in `src/app/api/backend/`.

### 3.2 Namespace Organization
- **Common Copy** (`frontend/messages/fa/common.json`):
  - Actions: `common.actions.save`, `common.actions.cancel`, `common.actions.back`, `common.actions.delete`, `common.actions.edit`, `common.actions.confirm`.
  - Statuses: `common.statuses.active`, `common.statuses.pending`, `common.statuses.inactive`, `common.statuses.all`.
  - Table & Toasts: `common.table.empty`, `common.table.actions`, `common.toast.success`, `common.toast.error`.
- **Entity Copy** (`frontend/messages/fa/<entity>.json`):
  - Page headings, table columns, filter labels, form field labels, and entity validation strings.
- **Permissions Copy** (`frontend/messages/fa/permissions.json`):
  - Granular permissions titles and descriptions.

### 3.3 Registering New Namespaces
Whenever adding a new `<domain>.json` under `frontend/messages/fa/`:
1. Register in `frontend/src/i18n/request.ts` inside `getRequestConfig`.
2. Register type in `frontend/global.d.ts` inside `type Messages` to preserve typed autocomplete.

### 3.4 Zod Form Schema Factory Pattern
Never hardcode strings inside Zod schemas. Always export a factory function:
```ts
export const createEntitySchema = (messages?: { titleRequired?: string }) =>
  z.object({
    title: z.string().min(1, { message: messages?.titleRequired ?? 'Title required' }),
  });

export const entitySchema = createEntitySchema();
export type EntityFormValues = z.infer<typeof entitySchema>;
```

### 3.5 Dynamic Keys & TypeScript Safety
When interpolating dynamic translation keys, avoid `any` to prevent ESLint `@typescript-eslint/no-explicit-any` failures:
```tsx
const getPermissionText = useCallback(
  (path: string, fallback: string): string => {
    const hasFn = tPermissions.has as unknown as (k: string) => boolean;
    const getFn = tPermissions as unknown as (k: string) => string;
    return hasFn(path) ? getFn(path) : fallback;
  },
  [tPermissions],
);
```

### 3.6 Numbers, Dates & Typography
- **Numbers**: Use `new Intl.NumberFormat('fa-IR').format(val ?? 0)` (never hardcode `'۰'`).
- **Dates**: Use `formatPersianDate(date)` from `@/utils`.
- **LTR Identifiers**: Code, IDs, emails, usernames, and metrics must specify `dir="ltr"` and `font-mono`.

### 3.7 Static Verification Grep
Run before completing any frontend task:
```bash
grep -rnP '[\x{0600}-\x{06FF}]' src/ --exclude-dir=api/backend
```
Must return 0 matches outside `src/app/api/backend/`.
