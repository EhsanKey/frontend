# Reuse Registry

Read this file before creating or modifying reusable components, hooks, containers, or utilities.

The filesystem is the source of truth. This file serves as a discoverability index for the boilerplate.

---

## 1. Shared Components (`src/components/shared`) - Mandatory 1st Priority

> [!IMPORTANT]
> **Priority Rule**: All agents and engineers must prioritize these shared components before implementing any input, picker, or selector. Ad-hoc custom `<select>` tags or duplicate search bars are strictly forbidden.
> **The Rule of Three**: Whenever any UI component pattern or helper utility is used **more than twice (> 2 occurrences)** in the project, it must be extracted into `src/components/shared/` or `src/utils/`, all call sites refactored, and registered in this document and `AGENTS.md`.

| Component | File | Responsibility |
| :--- | :--- | :--- |
| **`RoleGuard`** | `src/components/shared/role-guard.tsx` | Conditionally renders children based on user role (`ADMIN` vs `USER`) or granular permissions. Supports glassmorphism blur-on-denied. |
| **`InputField`** | `src/components/shared/input-field.tsx` | Robust standard text input wrapping HeroUI `<Input>` without React Aria `<TextField>` uncontrolled state conflicts. Prevents data reset on click/focus. |
| **`PasswordField`** | `src/components/shared/password-field.tsx` | Password input with toggleable show/hide eye icon, fully integrated with React Hook Form. |
| **`SearchInput`** | `src/components/shared/search-input.tsx` | Debounced text input for searching, ready to bind to URL query state. |
| **`Logo`** | `src/components/shared/logo.tsx` | Main application brand logo and title. |
| **`LookupAutocomplete`** | `src/components/shared/lookup-autocomplete.tsx` | Generic accessible searchable select / autocomplete with debounced server fetching and popover list. |
| **`SelectCourse`** | `src/components/shared/select-course.tsx` | Searchable course lookup selector powered by `/api/v1/lookups/courses`. |
| **`SelectProfessor`** | `src/components/shared/select-professor.tsx` | Searchable professor lookup selector powered by `/api/v1/lookups/professors`. |
| **`SelectUniversity`** | `src/components/shared/select-university.tsx` | Searchable university lookup selector powered by `/api/v1/lookups/universities`. |
| **`SelectCampus`** | `src/components/shared/select-campus.tsx` | Searchable campus/faculty lookup selector powered by `/api/v1/lookups/campuses` with optional parent `universityId`. |
| **`SelectMajor`** | `src/components/shared/select-major.tsx` | Searchable major lookup selector powered by `/api/v1/lookups/majors`. |
| **`SelectTeaching`** | `src/components/shared/select-teaching.tsx` | Searchable teaching assignment lookup selector powered by `/api/v1/lookups/teachings` with composite course/professor/campus titles. |


---

## 2. Generic Containers (`src/containers`)

| Container | File | Responsibility |
| :--- | :--- | :--- |
| **`TableContainer`** | `src/containers/table-container/index.tsx` | Reusable data table with RTL pagination, loading skeleton rows, customizable headers, and empty state. |

---

## 3. Custom Hooks (`src/hooks`)

| Hook | File | Responsibility |
| :--- | :--- | :--- |
| **`useAuth`** | `src/hooks/use-auth.ts` | Easy access to `AuthContext` (current user, `login`, `logout`, `isAdmin`, `isAuthenticated`). |
| **`useQueryState`** | `src/hooks/use-query-state.ts` | Synchronizes local filter/pagination state with URL search parameters using Next.js `useTransition`. |
| **`useGetRequest`** | `src/hooks/use-get-request.ts` | React Query wrapper for GET requests with query key management, caching, and `initialData` support. |
| **`usePostRequest`** | `src/hooks/use-post-request.ts` | React Query wrapper for mutations (POST, PUT, PATCH, DELETE) with toast notifications and query invalidation. |
| **`useDebounce`** | `src/hooks/use-debounce.ts` | Returns a debounced version of a fast-changing value (useful for live search inputs). |

---

## 4. Layouts & Navigation (`src/layouts`)

| Module | File | Responsibility |
| :--- | :--- | :--- |
| **`DashboardLayout`** | `src/layouts/app/dashboard-layout.tsx` | Master dashboard shell with header, sidebar, and responsive layout grid. |
| **`DashboardHeader`** | `src/layouts/app/header/dashboard-header.tsx` | Top navigation bar with page title, mobile drawer hamburger button, and user menu. |
| **`UserMenu`** | `src/layouts/app/header/user-menu.tsx` | Avatar dropdown showing user info, role badge, and logout trigger. |
| **`DashboardSidebar`** | `src/layouts/app/sidebar/dashboard-sidebar.tsx` | Desktop collapsible sidebar and mobile slide-out drawer. |
| **`DASHBOARD_NAV_ITEMS`** | `src/layouts/app/navigation/dashboard-navigation.ts` | Navigation links configuration with route paths, icons, and `requiredRole`. |

---

## 5. Domain Models (`src/models`)

| Model | File | Responsibility |
| :--- | :--- | :--- |
| **`IUser`**, **`IRole`**, **`IPermission`**, **`UserRole`** | `src/models/user.ts` | User profile representation, RBAC roles, and system permission definitions. |
| **`ILoginCredentials`**, **`ILoginResult`** | `src/models/auth.ts` | Authentication request credentials and login response model. |
| **`IAnalyticsOverview`**, **`IProfessorAnalytics`** | `src/models/analytics.ts` | AI token metrics, cache performance, inquiry stats, and top professor insights. |
| **`IReviewSubmission`**, **`ReviewStatus`** | `src/models/review.ts` | Student professor reviews submission model and moderation statuses. |
| **`IResourceSubmission`**, **`ResourceKind`**, **`ResourceStatus`** | `src/models/resource.ts` | Educational files (pamphlets, exams) submissions and Telegram publishing workflow. |
| **`ITelegramUser`**, **`ITelegramGroup`**, **`ITelegramConversation`** | `src/models/telegram.ts` | Telegram groups, users, and AI chat conversation models. |
| **`IAiModelConfig`**, **`AiModelScope`** | `src/models/ai-model.ts` | AI LLM provider configuration and model routing settings. |
| **`IProfessor`**, **`IProfessorRelationCounts`** | `src/models/professor.ts` | University professor entity, relations count, and merge definitions. |
| **`ICourse`**, **`ICourseRelationCounts`** | `src/models/course.ts` | Course curriculum catalog entity, relations count, and merge definitions. |
| **`IUniversity`** | `src/models/university.ts` | Higher education university entity with campus count and localization details. |
| **`ICampus`** | `src/models/campus.ts` | University faculty or branch campus entity associated with parent university. |
| **`IMajor`** | `src/models/major.ts` | Academic major/field of study entity with supported degree levels. |
| **`ITeaching`** | `src/models/teaching.ts` | Course-Professor-Campus-Major teaching assignment entity. |
| **`IInquiryFollowUpItem`** | `src/models/inquiry.ts` | 90-day student inquiry follow-up campaign records. |
| **`IErrorLog`**, **`ErrorSource`**, **`ErrorLevel`** | `src/models/error-log.ts` | Bot and AI planner error logs with stack trace and execution context. |
| **`IAiCacheEntry`**, **`IAiCacheStats`** | `src/models/ai-cache.ts` | AI cached responses, hits, tokens saved, and invalidation targets. |
| **`IAuditLog`** | `src/models/audit-log.ts` | Audit logging entity for administrative actions, target entities, client IP, and diff details. |
| **`ILookupItem`**, **`ICampusLookupItem`**, **`ITeachingLookupItem`** | `src/models/lookup.ts` | Lightweight lookup item models for autocomplete API endpoints. |
| **`IItem`**, **`ItemStatus`** | `src/models/item.ts` | Generic CRUD item domain entity and status types (`'ACTIVE' \| 'INACTIVE' \| 'ARCHIVED'`). |

---

## 6. Constants (`src/constants`)

| Constant | File | Responsibility |
| :--- | :--- | :--- |
| **`ROUTES`** | `src/constants/routes.ts` | Application route path dictionary (`ROUTES.LOGIN`, `ROUTES.DASHBOARD.ITEMS`, etc.). |
| **`AUTH_COOKIE_NAME`** | `src/constants/auth.ts` | HttpOnly cookie name (`access_token`). |
| **`DEFAULT_PAGE`**, **`DEFAULT_PER_PAGE`** | `src/constants/pagination.ts` | Default pagination parameters. |
| **`ICON_SIZES`** | `src/constants/icon-sizes.ts` | Standard icon size classes for Lucide icons. |
| **`QUERY_KEYS`** | `src/constants/query-keys.ts` | Centralized cache keys for React Query. |

---

## 7. Reusable Utilities (`src/utils`)

| Utility | File | Responsibility |
| :--- | :--- | :--- |
| **`cn`** | `src/utils/cn.ts` | Class name merger utility (`clsx` + `tailwind-merge`). |
| **`formatPersianDate`** | `src/utils/format-persian-date.ts` | Formats ISO date strings to Persian Jalali format. |
| **`getSearchParamValue`** | `src/utils/get-search-param-value.ts` | Safely extracts string value from Next.js `searchParams`. |
| **`getUserInitials`** | `src/utils/get-user-initials.ts` | Extracts initials from Persian or English full name. |
| **`hasRole`**, **`hasPermission`**, **`SYSTEM_PERMISSIONS_LIST`** | `src/utils/permissions.ts` | Complete RBAC/ABAC verification and Persian-documented granular permission definitions. |
| **`toPositiveInteger`** | `src/utils/to-positive-integer.ts` | Parses unknown/string values into a valid positive integer. |
| **`getBackendHref`** | `src/utils/backend-href.ts` | Normalizes backend proxy endpoint URLs. |
