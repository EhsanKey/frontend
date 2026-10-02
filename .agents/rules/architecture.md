# Architecture Context

Read this file when a task affects repository structure, module ownership, routes, services, or placement of new code.

The filesystem is the source of truth. This document is an architectural map, not a substitute for inspecting the current checkout.

---

## 1. Repository Map

```text
starter-template/
├── AGENTS.md                  # Bootstrap guide for AI agents
├── .agent/                    # Context-specific agent guidelines
├── messages/                  # Localization JSON files (e.g., messages/fa/*.json)
├── public/                    # Static assets, fonts, icons, logos
├── src/                       # Application source code
├── BOILERPLATE_GUIDE.md       # Comprehensive developer guide with code examples
├── README.md                  # Quickstart documentation
├── package.json
├── next.config.ts
├── tsconfig.json
└── ...
```

---

## 2. Source Map

```text
src/
├── apis/                      # API client, runners, DTOs, mappers, and service definitions
│   ├── core/                  # Axios instances (client & server), error normalizer, types
│   └── services/              # Domain services (auth, items, users)
├── app/                       # Next.js App Router (pages, layouts, route handlers)
│   ├── (auth)/                # Public authentication routes (/login)
│   ├── (protected)/           # Protected dashboard routes (enforces auth & layouts)
│   │   ├── dashboard/         # Main overview, /items, /users, /profile, /unauthorized
│   │   └── layout.tsx         # Dashboard layout wrapper with Auth & Role guards
│   └── api/backend/           # BFF (Backend-for-Frontend) proxy & mock store layer
├── components/
│   └── shared/                # Shared UI elements (RoleGuard, PasswordField, SearchInput, Logo)
├── constants/                 # Routes, cookie names, pagination defaults, query keys
├── containers/                # Generic composite containers (TableContainer)
├── contexts/                  # React contexts (AuthContext)
├── hooks/                     # Custom hooks (useAuth, useQueryState, useGetRequest, etc.)
├── i18n/                      # next-intl server request configuration
├── layouts/                   # Layout wrappers (DashboardLayout, Header, Sidebar, Navigation)
├── models/                    # Clean TypeScript domain models (User, Auth, Item)
├── modules/                   # Feature-specific components and business logic
│   ├── dashboard/             # Overview metric cards and quick actions
│   ├── items/                 # Generic CRUD entity showcase (filters, table, modals)
│   ├── login/                 # Login form and demo credentials
│   ├── unauthorized/          # Access denied view
│   └── users/                 # Role-guarded users list showcase
├── providers/                 # Top-level React providers (Auth, Query, Intl, AppProviders)
├── styles/                    # Design tokens, HeroUI theme, and custom component styles
└── utils/                     # Pure helpers, date formatters, permissions, classnames
```

---

## 3. Layer Ownership & Responsibilities

### `src/app`
Next.js route entrypoints, layouts, metadata integration, and route handlers.

- Keep `page.tsx` and `layout.tsx` thin.
- **CRITICAL RULE**: Pages **MUST NOT** fetch data directly. Data fetching strictly belongs in the Module layer (via Server Module Pattern or Client Service hooks).
- Pages define `generateMetadata` (using `getTranslations`) and define route-level permissions or parameter parsing.

### `src/modules`
Feature implementation and feature-local UI.

Keep code local while only one module owns it.

#### Server Module Pattern
For main entity listing and detail pages:
1. **Route (`src/app/.../page.tsx`)**: Receives `searchParams`, invokes `generateMetadata`, and renders the module component.
2. **Module Entry (`src/modules/.../index.tsx`)**: Server Component. Fetches initial data on the server via `serverServices.*`, handles errors, and wraps the client view in `<Suspense fallback={<TableSkeleton />}>`.
3. **Client Component (`src/modules/.../[feature]-client.tsx`)**: Receives `initialData`. Uses `useGetRequest` (hydrated with `initialData`) or controls local filters/search.
4. **URL Query State**: Filters update URL query parameters using `useQueryState` with `useTransition`, providing shareable, bookmarkable URLs without unnecessary loading flashes.

### `src/apis`
Separation of concerns between backend transport and application domain:
- **`core/`**: Centralized Axios client (`clientApiRequest`) and server (`serverApiRequest`) runners, error normalizer (`normalizeApiError`), and TypeScript envelopes (`ApiResponse`, `PaginatedResult`).
- **`services/<domain>/`**:
  - `_dto.ts`: Raw backend request and response contracts.
  - `_mappers.ts`: Pure functions transforming backend DTOs into clean frontend Domain Models.
  - `_endpoints.ts`: Endpoint path definitions.
  - `_services.ts`: Client-side fetch functions.
  - `client.ts`: Client API service facade.
  - `server.ts`: Server-side API service facade (reading cookies directly on server).

### `src/app/api/backend` (BFF & Mock Layer)
- Serves as the Backend-For-Frontend proxy.
- **Standalone Mock Mode**: When `API_BASE_URL` is empty, it uses `src/app/api/backend/mock-store.ts` for in-memory persistence (login, items CRUD, pagination, users). The boilerplate runs out of the box with zero external dependencies.
- **Live Backend Mode**: When `API_BASE_URL` is set, route handlers forward requests with the `Authorization: Bearer <token>` header to the real backend.

### `src/containers/table-container`
- Standard reusable table container with pagination controls, responsive empty states, and loading skeleton states.
- Fully supports RTL Persian layout.

### `src/components/shared`
- **Mandatory 1st Priority** shared UI components used across modules and features:
  * Academic Selectors: `SelectUniversity`, `SelectCampus` (scoped), `SelectMajor`, `SelectCourse`, `SelectProfessor`, `SelectTeaching`.
  * Primitives & Guards: `LookupAutocomplete`, `SearchInput`, `PasswordField`, `RoleGuard`, `Logo`.
- Ad-hoc custom inputs or raw `<select>` tags are strictly forbidden.
- **Rule of Three**: Any component or UI block used > 2 times across the monorepo must be extracted here and registered in AI/Agent docs (see `component-utility-reuse-standard` skill).

