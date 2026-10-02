# Frontend, UI, Forms, and i18n Rules

Read this file when a task touches UI, HeroUI components, styling, forms, translations, RTL layout, responsiveness, loading states, or shared visual components.

---

## 1. Product UI Principles

- **Persian-First & RTL**: The entire dashboard is designed for Persian language and Right-to-Left (RTL) reading order (`dir="rtl"`).
- **Typography**: The primary typeface is **Vazirmatn** (`font-vazirmatn`), loaded via Google Fonts in `src/app/layout.tsx`.
- **Modern Clean Theme**: Slate/neutral backgrounds, subtle border dividers (`border-divider`), rounded cards (`rounded-xl` / `rounded-2xl`), and gentle shadows.

---

## 2. Styling Sources & Tokens

Start styling decisions from existing CSS tokens:

- `src/styles/tokens.css`: Core design tokens, brand colors, radius, and shadows.
- `src/styles/heroui-theme.css`: Theme variables configured for HeroUI.
- `src/styles/heroui-components.css`: Common HeroUI component style overrides.
- `src/app/globals.css`: Base Tailwind utilities and typography definitions.

Do not hardcode arbitrary hex colors (e.g. `#1e293b`). Use semantic color utilities:
- Primary: `text-primary`, `bg-primary`, `border-primary`
- Success: `text-success`, `bg-success-50`, `border-success-200`
- Danger: `text-danger`, `bg-danger-50`, `border-danger-200`
- Warning: `text-warning`, `bg-warning-50`, `border-warning-200`
- Surfaces: `bg-background`, `bg-content1`, `bg-content2`, `bg-content3`
- Borders: `border-divider`, `border-border`

---

## 3. HeroUI 3 Component Rules

This project uses `@heroui/react` v3. Always follow these rules:

1. **Select Component Syntax**:
   In HeroUI v3, `<Select>` popovers must contain `<ListBox>` and `<ListBox.Item>` (do **not** use `<Select.List>`):
   ```tsx
   import { Select, ListBox } from '@heroui/react';

   <Select label={t('status.label')} placeholder={t('status.placeholder')}>
     <ListBox>
       <ListBox.Item key="active" id="active">{tCommon('statuses.active')}</ListBox.Item>
       <ListBox.Item key="inactive" id="inactive">{tCommon('statuses.inactive')}</ListBox.Item>
     </ListBox>
   </Select>
   ```

2. **Buttons & Loading States**:
   In HeroUI v3, `<Button>` does NOT take a `color` prop. Use `variant` (`"primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft"`), `size` (`"sm" | "md" | "lg"`), and `isPending` for loading:
   ```tsx
   <Button variant="primary" type="submit" isPending={isSubmitting}>
     {tCommon('actions.save')}
   </Button>
   ```

3. **Modals**:
   In HeroUI v3, `<Modal.Backdrop>` must wrap `<Modal.Container>` (do not use self-closing `<Modal.Backdrop />`), and `<Modal.Dialog>` must contain `<Modal.CloseTrigger />` and `<Modal.Header>` directly. If using a `<form>`, it wraps `<Modal.Body>` and `<Modal.Footer>`:
   ```tsx
   <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
     <Modal.Backdrop>
       <Modal.Container>
         <Modal.Dialog className="max-w-md">
           <Modal.CloseTrigger />
           <Modal.Header>
             <Modal.Heading>{title}</Modal.Heading>
           </Modal.Header>
           <form onSubmit={handleSubmit}>
             <Modal.Body className="...">...</Modal.Body>
             <Modal.Footer className="...">...</Modal.Footer>
           </form>
         </Modal.Dialog>
       </Modal.Container>
     </Modal.Backdrop>
   </Modal>
   ```

4. **Tabs**:
   HeroUI v3 uses compound components:
   ```tsx
   <Tabs selectedKey={tab} onSelectionChange={(k) => setTab(String(k))} variant="primary">
     <Tabs.List className="border-b border-divider">
       <Tabs.Tab id="first" className="...">تب اول</Tabs.Tab>
       <Tabs.Tab id="second" className="...">تب دوم</Tabs.Tab>
     </Tabs.List>
   </Tabs>
   ```

5. **Chip**:
   Use `variant="secondary"` (or `"soft"`) and utility classes (`className="bg-success-50 text-success-700"`). Do not use `startContent` or `color="success"`; render icons directly inside children.

6. **Spinner**:
   Use `size="sm" | "md" | "lg"`. Do not pass a `label` prop; render any description as an adjacent `<span>`.

7. **Mandatory Verification**:
   Before introducing or refactoring any component from `@heroui/react` or other UI packages, **never guess props or component structure**. Always inspect local package types under `node_modules/@heroui/react/dist/...` or perform a web search to verify the latest v3 API documentation.

---

## 4. Shared Components Catalog (`src/components/shared`) - Mandatory 1st Priority

> [!IMPORTANT]
> **Zero Ad-Hoc Implementation Policy**: Before implementing any selector, autocomplete, search bar, or password field, all engineers and sub-agents MUST use existing components from `src/components/shared/`. Creating custom inline dropdowns, manual `<select>` tags, or repetitive search bars is strictly prohibited.

### Available Shared Components:
1. **`SelectUniversity`** (`@/components/shared`):
   - Searchable autocomplete for Universities with debounced API queries (`lookupUniversities`) and clearable state.
   - Props: `selectedId`, `onSelect(id, item)`, `label`, `placeholder`, `isDisabled`, `errorMessage`, `isInvalid`.
2. **`SelectCampus`** (`@/components/shared`):
   - Searchable autocomplete for Campuses/Faculties with optional `universityId` scoping and parent university subtitle.
   - Props: `universityId` (optional filter), `selectedId`, `onSelect(id, item)`, `label`, `placeholder`.
3. **`SelectMajor`** (`@/components/shared`):
   - Searchable autocomplete for academic majors.
   - Props: `selectedId`, `onSelect(id, item)`, `label`, `placeholder`.
4. **`SelectCourse`** (`@/components/shared`):
   - Searchable autocomplete for courses.
5. **`SelectProfessor`** (`@/components/shared`):
   - Searchable autocomplete for professors.
6. **`SelectTeaching`** (`@/components/shared`):
   - Scoped autocomplete for teaching assignments (professors + courses).
7. **`LookupAutocomplete`** (`@/components/shared`):
   - Generic base primitive for any searchable entity autocomplete with popover and keyboard navigation.
8. **`SearchInput`** (`@/components/shared`):
   - Standard search input powered by HeroUI `SearchField`, debounced `onSearch(query)`, clear button, and accessible labels.
9. **`PasswordField`** (`@/components/shared`):
   - Standard password input with reveal/hide eye toggle, HeroUI `InputGroup`, and `react-hook-form` registration.
10. **`RoleGuard`** (`@/components/shared`):
    - Declarative RBAC permission authorization wrapper.
11. **`Logo`** (`@/components/shared`):
    - Centralized application logo with responsive size tokens.

---

## 5. Form Guidelines (React Hook Form + Zod)

All user input forms must follow this pattern:

1. **Define Schema**: Create a Zod validation schema with localized Persian error messages:
   ```typescript
   export const itemFormSchema = z.object({
     title: z.string().min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
     status: z.enum(['ACTIVE', 'INACTIVE']),
   });
   export type ItemFormValues = z.infer<typeof itemFormSchema>;
   ```

2. **Initialize Hook Form**:
   ```typescript
   const {
     register,
     handleSubmit,
     formState: { errors, isSubmitting },
   } = useForm<ItemFormValues>({
     resolver: zodResolver(itemFormSchema),
     defaultValues: { ... },
   });
   ```

3. **Render Inputs**:
   Connect errors to HeroUI input props `isInvalid` and `errorMessage`:
   ```tsx
   <Input
     label="عنوان آیتم"
     {...register('title')}
     isInvalid={!!errors.title}
     errorMessage={errors.title?.message}
   />
   ```

4. **Passwords**:
   ALWAYS use the shared [`PasswordField`](file:///src/components/shared/password-field.tsx) component for all password inputs. Never write custom password fields.

---

## 6. TableContainer & Data Grids

All paginated tables must use `TableContainer` (`src/containers/table-container/index.tsx`):

- **Pagination**: Pass `pagination={{ page, perPage, total }}`.
- **RTL Arrows**: Handled automatically inside `TableContainer`.
- **Loading State**: Pass `isLoading={isLoading}`.
- **Empty State**: Handled with customizable `emptyContent`.
- **Query Sync**: Update query params on page change:
  ```tsx
  <TableContainer
    headers={[t('columns.title'), t('columns.category'), t('columns.status'), t('columns.actions')]}
    isLoading={isLoading}
    pagination={{
      page,
      perPage,
      total: data?.meta?.total ?? 0,
      onPageChange: (newPage) => setQueryState({ page: newPage }),
    }}
  >
    {data?.items?.map((item) => ( ... ))}
  </TableContainer>
  ```

---

## 7. Responsiveness

- **Breakpoint**: `lg` is the primary desktop breakpoint (1024px).
- **Sidebar**:
  - Desktop (`lg` and above): Collapsible fixed sidebar.
  - Mobile/Tablet (`< lg`): Slide-out drawer/overlay via mobile header toggle.
- **Tables**: Wrap tables with horizontal scrolling or hide secondary columns on small screens using `hidden sm:table-cell` or `hidden md:table-cell`.

---

## 8. Localization (`next-intl`) & Zero Hardcoded Strings Policy

> [!CAUTION]
> **ZERO HARDCODED STRINGS POLICY**:
> Never write Persian, English, or any human-readable strings directly into JSX/TSX components, placeholders, buttons, badges, errors, or Zod schemas.
> All strings must be placed in `messages/fa/*.json` and retrieved via `next-intl`.
> Refer to the mandatory rule: [frontend/.agents/rules/i18n-mandate.md](file:///d:/dev/university-assistant-bot/frontend/.agents/rules/i18n-mandate.md).

All user-visible text must be maintained in JSON translation dictionaries under `messages/fa/`:
- `common.json`: Shared buttons, pagination, errors, confirm/cancel dialogs.
- `auth.json`: Login labels, validation messages, credentials hints.
- `mainLayout.json`: Sidebar links, header title, profile menu.
- `<module>.json`: Page-specific headings, table column names, modal titles.

### Usage:
- **Server Component**:
  ```tsx
  import { getTranslations } from 'next-intl/server';
  const t = await getTranslations('items');
  ```
- **Client Component**:
  ```tsx
  import { useTranslations } from 'next-intl';
  const t = useTranslations('items');
  const tCommon = useTranslations('common');
  ```
