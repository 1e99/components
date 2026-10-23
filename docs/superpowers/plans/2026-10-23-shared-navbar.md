# Shared Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a publishable React/Tailwind package with a tested,
visualized navbar that models the shared structure of the 1e99 website and
curriculum application without modifying either consumer.

**Architecture:** The package exports a framework-neutral `Navbar` component.
React nodes and a link-rendering adapter inject Next.js-specific branding,
routing and actions. Tailwind class literals remain in the distribution and
the README documents the Tailwind 4 `@source` registration required by each
consumer. Storybook React/Vite provides the visual workbench while Vitest
tests the public behavior.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vite, Storybook React/Vite,
Vitest, Testing Library, tsup, pnpm.

**Study:** `docs/architecture.md`

## Global Constraints

- Work directly on the user-requested `main` branch of this new repository.
- Make small, self-contained commits; never modify `domain-website` or
  `curriculo`.
- Do not depend on Next.js, next-intl, next-auth or react-icons.
- Use Tailwind CSS utilities and the existing 1e99 semantic tokens; do not
  ship global token CSS or a reset.
- Keep `react`, `react-dom` and `tailwindcss` as peer dependencies.
- Prepare npm publication but do not publish a package.

## Review Focus

- Consumers using a custom router must be able to render every navigation
  link without the package importing router-specific APIs.
- The component must retain semantic `header` and `nav` landmarks and clear
  accessible labels for desktop and mobile navigation.
- `mobileNavigation="hidden"` must not render a disclosure trigger or mobile
  navigation, while `"disclosure"` must expose both links and mobile actions.
- All Tailwind class literals used by the package must remain visible in
  `dist/` and be documented for consumer `@source` scanning.
- The packed tarball must contain only published runtime/type artifacts and
  package documentation, never stories, tests or source-only configuration.

### Task 1: Establish package and toolchain

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `tsup.config.ts`
- Create: `vite.config.ts`, `vitest.config.ts`, `vitest.setup.ts`
- Create: `.gitignore`, `src/index.ts`

- [ ] Add React/Tailwind peer dependencies and development tooling for Vite,
  Vitest, Testing Library, Storybook React/Vite, Storybook accessibility and
  tsup.
- [ ] Configure build, typecheck, test, Storybook, static Storybook and pack
  verification scripts.
- [ ] Verify the empty package builds, typechecks and starts Storybook.
- [ ] Commit the standalone toolchain.

### Task 2: Define the navbar contract with tests first

**Files:**
- Create: `src/navbar.tsx`
- Create: `src/navbar.test.tsx`
- Modify: `src/index.ts`

- [ ] Write failing tests for landmarks, default links, injected link renderer,
  action slots and the three variant dimensions.
- [ ] Implement the minimal public `Navbar`, `NavbarItem` and
  `NavbarLinkRenderProps` interfaces that pass the tests.
- [ ] Run the full unit suite and typecheck.
- [ ] Commit the component and its tests.

### Task 3: Add Storybook variants and interaction coverage

**Files:**
- Create: `.storybook/main.ts`, `.storybook/preview.ts`, `.storybook/preview.css`,
  `.storybook/vitest.setup.ts`
- Create: `src/navbar.stories.tsx`
- Modify: `vitest.config.ts`, `package.json`

- [ ] Configure Storybook React/Vite with Tailwind and the Vitest/accessibility
  addons.
- [ ] Add stories for the domain-like disclosure navbar, curriculum-like hidden
  mobile navigation, widths and link treatments.
- [ ] Add a play interaction for opening the disclosure and assert that mobile
  links/actions become available.
- [ ] Run Storybook tests and build the static Storybook.
- [ ] Commit stories and Storybook configuration.

### Task 4: Package and document reuse

**Files:**
- Create: `README.md`, `LICENSE`, `.npmignore`
- Modify: `package.json`

- [ ] Document the API, variants, Next.js/next-intl adapter example, Tailwind
  4 `@source` requirement, Storybook commands and npm publication checklist.
- [ ] Configure `exports`, `files`, `publishConfig.access` and package metadata
  so only `dist/` and documentation publish.
- [ ] Run build, tests, typecheck, static Storybook build and `npm pack --dry-run`.
- [ ] Commit package metadata and documentation.
