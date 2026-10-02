---
name: package-api-verification
description: >-
  Use this skill whenever introducing, modifying, or using third-party library components, APIs, or hooks (such as HeroUI, React Aria, TanStack Query, Next-intl, etc.) to ensure accurate syntax and prop usage by searching the web and inspecting local package definitions.
---

# Package and Third-Party API Verification Skill

This skill enforces strict verification of third-party package APIs, component props, and breaking changes before implementation to eliminate guesswork and syntax errors.

## When to Activate
- Using or modifying components from `@heroui/react` (Button, Tabs, Chip, Modal, Switch, Select, Spinner, etc.).
- Using hooks from `@tanstack/react-query`, `react-aria`, `next-intl`, or custom project wrappers.
- Introducing a new external package or upgrading an existing dependency.
- Integrating external REST APIs or SDKs.

## Verification Procedure

### 1. Inspect Local Reality (Ground Truth)
Always check local types and package definitions first:
- Check `package.json` to verify the exact installed major/minor version (e.g. `@heroui/react: ^3.2.4`).
- Check TypeScript declarations in `node_modules/<package-name>/...` (e.g. `node_modules/@heroui/react/dist/...`) to see exact prop interfaces, exported components, and allowed variant strings.
- Check existing working usages across the codebase (`src/modules/`, `src/components/`, `src/containers/`) to maintain project consistency.

### 2. Search Documentation & Web
If local types are complex or behavior is unclear:
- Use `search_web` to confirm current component syntax, props, and recent migration notes.
- Search with exact version strings (e.g., `"@heroui/react" v3 Tabs syntax props`).
- Look for official docs, migration guides, and GitHub issues for breaking changes.

### 3. HeroUI v3 Specific Checklist
- **Button**:
  - `variant`: `"primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft"` (no `color="primary"`, no `variant="flat"`).
  - Loading: `isPending` (not `isLoading`).
  - Icons: Render icons directly as children (no `startContent` or `endContent`).
- **Tabs**:
  - Compound components: `<Tabs variant="primary"><Tabs.List><Tabs.Tab id="...">...</Tabs.Tab></Tabs.List></Tabs>`.
- **Chip**:
  - Use `variant="secondary"` (or `"soft"`) and Tailwind utility classes (`className="bg-success-50 text-success-700"`).
  - Render icons directly inside children (no `startContent`).
- **Spinner**:
  - Use `size="sm" | "md" | "lg"` (no `label` prop; place text in adjacent `<span>`).
- **Select**:
  - Compound components: `<Select><Select.Trigger><Select.Value /></Select.Trigger><Select.Popover><ListBox><ListBox.Item id="...">...</ListBox.Item></ListBox></Select.Popover></Select>`.
- **TableContainer**:
  - Must use `TableHeaderOptions` with `isRowHeader: true` on the primary identifier column, and `renderCell`.

### 4. Continuous Validation
- Run `pnpm lint` and `pnpm build` after changes to verify zero TypeScript and lint errors.
