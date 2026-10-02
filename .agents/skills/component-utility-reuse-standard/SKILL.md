---
name: component-utility-reuse-standard
description: Mandatory full-stack & frontend engineering standard enforcing immediate component and utility extraction upon exceeding two usages (Rule of Three), prohibiting duplicate ad-hoc implementations, and requiring instant registration of new abstractions in Agent & AI documentation.
---

# Component & Utility Reuse Standard (`component-utility-reuse-standard`)

## 1. Core Philosophy: The Rule of Three (> 2 Occurrences)

In this monorepo, code duplication and ad-hoc re-implementations are strictly prohibited.
Whenever a component pattern, UI widget, or utility function logic is needed or repeated **more than twice (3rd occurrence onwards)** across the codebase:

```text
Occurrence 1: Implement cleanly in-place or shared.
Occurrence 2: Keep localized or consider extraction.
Occurrence 3+: [MANDATORY TRIGGER] Must be extracted into a shared abstraction!
               All duplicate sites MUST be refactored to use the shared abstraction.
               The new abstraction MUST immediately be registered in Agent & AI guides.
```

### Destination Rules:
- **Shared UI Primitives & Domain Pickers**: `src/components/shared/`
- **Composite Page Containers (Tables, Layouts)**: `src/containers/`
- **Frontend Utility Functions**: `src/utils/`
- **Custom React Hooks**: `src/hooks/`

---

## 2. Shared Components Catalog (`src/components/shared`)

All agents (`frontend-architect`, `frontend-engineer`, `frontend-qa-tester`) MUST check this catalog first. **These components have 1st Priority over any custom or raw HTML/HeroUI implementations.**

| Component | Export Path | Purpose & Key Features | Replaces / Prohibits |
| :--- | :--- | :--- | :--- |
| **`SelectUniversity`** | `@/components/shared` | Searchable university autocomplete with debounced API lookup (`lookupUniversities`), clearability (`isClearable`), size (`sm`/`md`). | Raw `<select>`, manual `<Select>`, ad-hoc search inputs. |
| **`SelectCampus`** | `@/components/shared` | Searchable campus / faculty autocomplete with optional `universityId` scoping (`lookupCampuses`), displays parent university name. | Raw `<select>`, manual `<Select>`, ad-hoc campus dropdowns. |
| **`SelectMajor`** | `@/components/shared` | Searchable major autocomplete with debounced API lookup (`lookupMajors`), clearability. | Raw `<select>`, manual `<Select>`, ad-hoc major dropdowns. |
| **`SelectCourse`** | `@/components/shared` | Searchable course autocomplete with debounced API lookup (`lookupCourses`), clearability. | Raw `<select>`, manual `<Select>`, ad-hoc course dropdowns. |
| **`SelectProfessor`** | `@/components/shared` | Searchable professor autocomplete with debounced API lookup (`lookupProfessors`), clearability. | Raw `<select>`, manual `<Select>`, ad-hoc professor dropdowns. |
| **`SelectTeaching`** | `@/components/shared` | Searchable teaching autocomplete with professor/course scoping (`lookupTeachings`). | Raw `<select>`, manual `<Select>`, ad-hoc teaching dropdowns. |
| **`LookupAutocomplete`** | `@/components/shared` | Generic accessible entity autocomplete with keyboard navigation, popover, debounce, clear button, and custom option renderers. | Ad-hoc autocompletes, unverified comboboxes. |
| **`SearchInput`** | `@/components/shared` | Standard search input powered by HeroUI `SearchField`, debounced query emission, clear button, and accessible labels. | `<input type="text">` with manual `Search` icon, un-debounced inputs. |
| **`PasswordField`** | `@/components/shared` | Standard password input with reveal/hide toggle, HeroUI `InputGroup`, accessible visibility labels, and `react-hook-form` integration. | `<input type="password">`, `<Input type="password">` without toggle. |
| **`RoleGuard`** | `@/components/shared` | Declarative RBAC permission guard rendering children or fallback based on admin permissions. | Ad-hoc permission checks in JSX. |
| **`Logo`** | `@/components/shared` | Centralized application logo with responsive size tokens. | Duplicated SVG/image tags. |
| **`TelegramEditor`** | `@/components/shared` | Rich Telegram message editor with HTML formatting toolbar, tags validation, char counter, and dynamic placeholders (`{نام_دانشجو}`, `{نام_استاد}`, `{نام_درس}`). | Raw `<textarea>`, basic text inputs for Telegram broadcast/follow-up messaging. |
| **`TelegramLivePreview`** | `@/components/shared` | Realistic simulated mobile phone preview with Telegram theme, bubbles, dynamic sample placeholder replacements, and inline buttons. | Raw text previews, unformatted message renders. |
| **`InlineKeyboardBuilder`** | `@/components/shared` | Accessible interactive grid builder for Telegram inline buttons (URLs, deep-links, callbacks). | Ad-hoc button row inputs. |
| **`StatCard`** | `@/components/shared` | Standardized metrics card displaying icon, label, and formatted numbers with variant colors (primary, success, warning, danger, neutral). | Ad-hoc stat widgets, duplicated card wrappers. |
| **`AcademicScopeFields`** | `@/components/shared` | Composite selector for University, Campus, and Major with automated cascading resets and customizable grid/stack layouts. | Repeated manual University/Campus/Major state binding and cascading resets. |


---

## 3. Shared Utilities Catalog (`src/utils`)

| Utility Function | Export Path | Purpose |
| :--- | :--- | :--- |
| **`cn(...inputs)`** | `@/utils` | Combines `clsx` and `tailwind-merge` for conflict-free Tailwind classes. |
| **`formatPersianDate(date)`** | `@/utils` | Formats ISO dates into standard Persian Shamsi dates (`YYYY/MM/DD`). |
| **`formatPersianDateTime(date)`** | `@/utils` | Formats ISO dates into standard Persian Shamsi date and time (`YYYY/MM/DD HH:mm`). |
| **`formatPersianRelativeTime(date)`** | `@/utils` | Formats ISO dates into relative time in Persian (`لحظاتی پیش`, `۲ روز پیش`). |
| **`normalizePersianText(text)`** | `@/utils` | Replaces Arabic characters (ي, ك), normalizes digits and whitespace. |
| **`hasPermission(user, perm)`** | `@/utils/permissions` | Checks whether an admin user possesses a specific permission code. |
| **`hasAnyPermission(user, perms)`** | `@/utils/permissions` | Checks whether an admin user possesses at least one of the specified permissions. |
| **`checkScopeAccess(user, scope)`** | `@/utils/permissions` | Validates scoping boundaries for university, campus, and major access. |

---

## 4. Mandatory AI & Agent Documentation Protocol

Whenever an engineer or sub-agent creates a new component in `src/components/shared` or a new utility in `src/utils`:

1. **Immediate Guide Updates**: The agent **MUST** update the following files in the same turn or task:
   - `frontend/AGENTS.md` (Add to Shared Components or Utilities roster)
   - `.agents/agents/frontend-architect.md` (Add to Component Catalog)
   - `.agents/agents/frontend-engineer.md` (Add to Implementation Invariants)
   - `.agents/rules/frontend.md` or `engineering.md` (Add usage code example)
   - Monorepo root `AGENTS.md` (if cross-stack or generally relevant)

2. **Required Documentation Format**:
   ```markdown
   ### `<ComponentName>` (`@/components/shared`)
   - **Purpose**: What problem it solves.
   - **Props Interface**: Required and optional props.
   - **Usage Example**:
     ```tsx
     import { ComponentName } from '@/components/shared';
     <ComponentName ... />
     ```
   ```

3. **Why this is strictly enforced**: Future AI agents use these files as their ground-truth system instructions. If an abstraction is created without updating the Agent files, future AI sessions will not know it exists and might re-invent it.

---

## 5. QA Verification Checklist (Pre-Approval Gate)

The `frontend-qa-tester` MUST verify the following before approving any task:

- [ ] **No Ad-Hoc Pickers**: Ensure no raw `<select>` or custom university/campus/major/course/professor/teaching picker exists outside of `@/components/shared`.
- [ ] **No Manual Search Inputs**: Ensure all search bars use `<SearchInput>`.
- [ ] **No Raw Password Inputs**: Ensure all password/secret fields use `<PasswordField>`.
- [ ] **The Rule of Three**: Check if any new logic or JSX block appears more than twice in the PR. If so, verify it was extracted.
- [ ] **AI Documentation Synchronized**: If any new component or utility was extracted, verify that `AGENTS.md`, `frontend-architect.md`, `frontend-engineer.md`, and `frontend.md` were updated with the new abstraction.
