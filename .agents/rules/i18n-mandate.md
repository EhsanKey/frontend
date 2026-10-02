# Zero Hardcoded Strings & Complete i18n Localization Mandate

Read this file whenever a task creates, modifies, or refactors frontend UI components, forms, validation schemas, error messages, notifications, table definitions, modals, or pages.

---

## 1. Absolute Core Directive: Zero Hardcoded Strings

> [!CAUTION]
> **STRICT BAN ON HARDCODED STRINGS IN CODE**:
> Writing human-readable text (Persian, English, or any natural language) directly in `.tsx`, `.ts`, JSX elements, attributes, placeholders, titles, notifications, or validation schemas is **strictly forbidden**.
> 
> All user-facing text, without exception, MUST be defined inside `frontend/messages/fa/*.json` and resolved via `next-intl`.
> 
> **SOLE EXCEPTION**: Dev-time mock store fixtures located inside `frontend/src/app/api/backend/` (specifically designated as dev mock backend).

---

## 2. Namespace Organization & Placement Rules

Localization keys must be organized cleanly according to the following strict hierarchy:

### 2.1 Shared & Common Copy (`frontend/messages/fa/common.json`)
Use `const tCommon = useTranslations('common');` for anything reusable across multiple domains:
- **Actions**: `common.actions.save`, `common.actions.cancel`, `common.actions.delete`, `common.actions.edit`, `common.actions.back`, `common.actions.confirm`, `common.actions.refresh`, `common.actions.search`.
- **Statuses**: `common.statuses.active`, `common.statuses.inactive`, `common.statuses.pending`, `common.statuses.all`, `common.statuses.approved`, `common.statuses.rejected`.
- **Table Controls**: `common.table.actions`, `common.table.empty`, `common.table.total`, `common.table.rowsPerPage`.
- **Generic Toasts**: `common.toast.success`, `common.toast.error`, `common.toast.networkError`.
- **Shared Labels**: `common.labels.recordId`, `common.labels.selectOption`, `common.labels.search`.

### 2.2 Entity/Feature Copy (`frontend/messages/fa/<feature>.json`)
Use `const t = useTranslations('<feature>');` for feature-specific text:
- **Headings & Descriptions**: `<feature>.title`, `<feature>.description`.
- **Table Columns**: `<feature>.columns.<columnKey>`.
- **Filters**: `<feature>.filters.<filterKey>`, `<feature>.filters.placeholder`.
- **Modals & Dialogs**: `<feature>.modal.createTitle`, `<feature>.modal.editTitle`, `<feature>.modal.deleteTitle`, `<feature>.modal.deleteConfirm`.
- **Fields**: `<feature>.fields.<field>.label`, `<feature>.fields.<field>.placeholder`, `<feature>.fields.<field>.description`.
- **Validation Messages**: `<feature>.validation.<fieldRequired>`, `<feature>.validation.<fieldMin>`, `<feature>.validation.<fieldInvalid>`.
- **Domain Categories / Subtypes**: `<feature>.categories.<type>`, `<feature>.types.<type>`.

### 2.3 System Permissions Copy (`frontend/messages/fa/permissions.json`)
All granular permissions and scopes belong in `permissions.json` (under `items.<permission_code>.title` and `items.<permission_code>.description`).

---

## 3. Registering New Translation Namespaces

Whenever a new domain JSON file is created under `frontend/messages/fa/<newDomain>.json`:
1. **Server Config**: Import and register it in `frontend/src/i18n/request.ts` inside `getRequestConfig`.
2. **TypeScript Definitions**: Import and add it to `type Messages` in `frontend/global.d.ts`.
   ```ts
   import newDomain from './messages/fa/newDomain.json';
   
   type Messages = {
     ...
     newDomain: typeof newDomain;
   };
   ```
   > **Note**: Forgetting to update `global.d.ts` will break `next-intl` typed autocomplete and cause TS2345 type errors.

---

## 4. Zod Form Validation Schema Localization Pattern

Zod schemas must **never** contain hardcoded Persian strings. Always implement the **Schema Factory Pattern**:

```ts
// src/modules/<feature>/<feature>.schema.ts
import { z } from 'zod';

export interface FeatureSchemaMessages {
  titleRequired?: string;
  titleMin?: string;
  categoryRequired?: string;
}

export const createFeatureSchema = (messages?: FeatureSchemaMessages) =>
  z.object({
    title: z
      .string()
      .min(1, { message: messages?.titleRequired ?? 'Title is required' })
      .min(3, { message: messages?.titleMin ?? 'Title must be at least 3 characters' }),
    category: z
      .string()
      .min(1, { message: messages?.categoryRequired ?? 'Category is required' }),
  });

export const featureSchema = createFeatureSchema();
export type FeatureFormValues = z.infer<typeof featureSchema>;
```

In the React component / modal:
```tsx
const tValidation = useTranslations('feature.validation');

const form = useForm<FeatureFormValues>({
  resolver: zodResolver(
    createFeatureSchema({
      titleRequired: tValidation('titleRequired'),
      titleMin: tValidation('titleMin'),
      categoryRequired: tValidation('categoryRequired'),
    })
  ),
  ...
});
```

---

## 5. Dynamic Keys & TypeScript Safety (No `any`)

When resolving dynamic message keys (e.g. iterating over permission codes or category keys), avoid TypeScript union exhaustion and `no-explicit-any` ESLint errors by using typed helper functions:

```tsx
const t = useTranslations('users');
const tPermissions = useTranslations('permissions');

const getPermissionText = useCallback(
  (path: string, fallback: string): string => {
    const hasFn = tPermissions.has as unknown as (k: string) => boolean;
    const getFn = tPermissions as unknown as (k: string) => string;
    return hasFn(path) ? getFn(path) : fallback;
  },
  [tPermissions],
);

const getCategoryLabel = useCallback(
  (labelKey: string): string => {
    const getFn = t as unknown as (k: string) => string;
    return getFn(`categories.${labelKey}`);
  },
  [t],
);
```

---

## 6. Numbers, Dates, and Currencies

- **Numbers**: Never hardcode Persian digits in UI code (e.g. `'۰'`). Always format numbers using `new Intl.NumberFormat('fa-IR').format(val ?? 0)`.
- **Dates**: Always use the standardized utility `formatPersianDate(date)` from `@/utils`.
- **Text with Variables**: Use ICU message formatting:
  In `messages/fa/users.json`:
  ```json
  "accessCount": "{count, plural, =0 {بدون دسترسی} other {# مورد دسترسی}}"
  ```
  In Component:
  ```tsx
  t('accessCount', { count: items.length })
  ```

---

## 7. QA Verification Gate

Before submitting any frontend task or pull request, the Frontend QA Tester must execute the automated static scan to guarantee 0 hardcoded Persian characters outside mock fixtures:

```bash
# Must return 0 matches outside src/app/api/backend/
grep -rnP '[\x{0600}-\x{06FF}]' src/ --exclude-dir=api/backend
```

Any remaining match is an immediate failure of the Frontend Quality Gate (`VERDICT: REJECTED`).
