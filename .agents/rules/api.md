# API and Data Rules

Read this file when a task touches API requests, backend integration, DTOs, models, services, auth request flow, pagination, or React Query wrappers.

---

## 1. Dual-Mode Architecture (Mock vs. Live)

This boilerplate is engineered to work in two modes seamlessly:

1. **Standalone Mock Mode (Default)**:
   - When `API_BASE_URL` is empty in `.env.local`, all requests to `/api/backend/*` are handled by an in-memory mock store (`src/app/api/backend/mock-store.ts`).
   - Mock store supports user authentication (`admin` and `user`), full CRUD for items, filtering, searching, and pagination.
   - Allows immediate execution without requiring an active backend service.

2. **Live Backend Mode**:
   - When `API_BASE_URL` is set (e.g., `API_BASE_URL=https://api.mycompany.com`), the route handlers under `src/app/api/backend/*` act as a secure BFF (Backend-For-Frontend) proxy.
   - The route handler reads the `access_token` HttpOnly cookie and attaches it as `Authorization: Bearer <token>` to upstream requests.
   - Sensitive credentials and tokens are never exposed to the client-side JavaScript bundle.

---

## 2. Browser Request Boundary

Browser feature code **MUST** only call the local BFF proxy:

```text
/api/backend/*
```

**Never call the upstream backend URL directly from client-side code.**

---

## 3. Auth Flow and Session

- **Cookie Name**: `access_token` (defined in `src/constants/auth.ts`).
- **Cookie Security**:
  - `httpOnly: true`
  - `secure: process.env.NODE_ENV === 'production'`
  - `sameSite: 'lax'`
  - `path: '/'`
- **Ownership**:
  - Login (`/api/backend/auth/login`) sets the cookie.
  - Logout (`/api/backend/auth/logout`) clears the cookie.
  - Current user info (`/api/backend/auth/me`) validates the cookie and returns user profile.

---

## 4. Shared API Infrastructure

Always reuse the centralized infrastructure under `src/apis/core/`:

- **`clientApiRequest`**: Axios wrapper for all client-side browser requests.
- **`serverApiRequest`**: Axios runner for Server Components and Server Actions, reading cookies on the server.
- **`normalizeApiError`**: Normalizes network and server errors into a standardized `ApiError` format with localized Persian messages.

Standard API response envelopes (defined in `src/apis/core/types/api-response.ts`):

```typescript
// Single resource
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Paginated collection
export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
```

---

## 5. Service Directory Structure

Each domain service lives in `src/apis/services/<domain>/`:

```text
src/apis/services/<domain>/
├── _dto.ts            # Raw backend request and response contracts
├── _endpoints.ts      # Endpoint URL constants
├── _mappers.ts        # Pure transformation functions: DTO -> Domain Model
├── _services.ts       # Client API request functions
├── _types.ts          # App-facing service types (query params, etc.)
├── client.ts          # Public client service facade
└── server.ts          # Public server service facade
```

### Responsibility of Files:

- **`_dto.ts`**: Pure backend contracts. Must not import frontend models or UI components. Contains `*RequestDto` and `*ResponseDto`.
- **`_mappers.ts`**: Converts raw backend DTOs into clean domain models (`src/models/`). Always handle null/undefined fields defensively with fallback values.
- **`_endpoints.ts`**: URL path definitions (e.g. `ITEMS: '/api/backend/items'`).
- **`_services.ts`**: Pure fetch functions calling `clientApiRequest`.
- **`client.ts`**: Exports client methods (e.g., `itemServices.getItems(...)`).
- **`server.ts`**: Exports server-side data loaders (e.g., `serverItemServices.getItems(...)`).

---

## 6. React Query Wrapper Hooks

Use repository wrapper hooks in client components:

### `useGetRequest`
Used for fetching queries.
```tsx
const { data, isLoading, refetch } = useGetRequest({
  queryKey: [QUERY_KEYS.ITEMS, { page, search, status }],
  queryFn: () => itemServices.getItems({ page, search, status }),
  initialData, // Passed from Server Component
});
```

### `usePostRequest`
Used for mutations (Create, Update, Delete).
```tsx
const { mutate, isPending } = usePostRequest({
  mutationFn: (payload) => itemServices.createItem(payload),
  onSuccess: () => {
    toast.success('با موفقیت ثبت شد');
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEMS] });
  },
});
```
