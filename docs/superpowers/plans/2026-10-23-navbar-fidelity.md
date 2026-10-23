# Navbar Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the shared Navbar so its structure and Storybook faithfully
match the existing 1e99 domain and curriculum headers.

**Architecture:** `Navbar` keeps the source headers' sibling layout for brand,
desktop navigation, actions and optional mobile disclosure. Consumer-specific
controls stay as slots; only the observed visual variations are props.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vitest, Storybook/Vite.

**Spec:** `docs/superpowers/specs/2026-10-23-navbar-fidelity-design.md`

## Global Constraints

- Work directly on `main` and create small, independently valid commits.
- Do not modify `domain-website` or `curriculo`.
- Use existing 1e99 semantic Tailwind tokens and do not ship global CSS.
- Do not add Next.js, next-intl, next-auth or icon dependencies.
- Keep logo/control integrations as React slots.

## Review Focus

- Desktop actions must stay a sibling of the navigation; test the rendered
  container children in Task 1.
- A domain mobile menu must use its own trigger/panel visual contract; test
  its accessible label and source-faithful classes in Task 2.
- Curriculum's hidden-mobile profile must render no disclosure in Task 2.
- Storybook must use the official logo and source-compatible semantic tokens
  in Task 3.
- The packed library must not include Storybook demonstration assets in Task 4.

### Task 1: Rebuild desktop shell and link variants

**Files:** Modify `src/navbar.tsx`, `src/index.ts`, `src/navbar.test.tsx`.

- [ ] Write failing tests asserting brand, desktop navigation and actions are
  sibling regions, and assert domain/curriculum link class variants.
- [ ] Implement the sibling shell, `layer`, link weight and link treatment.
- [ ] Run `pnpm test` and `pnpm typecheck`.
- [ ] Commit `feat: align navbar desktop shell with 1e99 headers`.

### Task 2: Rebuild the domain mobile disclosure

**Files:** Modify `src/navbar.tsx`, `src/navbar.test.tsx`.

- [ ] Write a failing test for the square menu trigger, raised panel, mobile
  link classes and absent disclosure when no mobile config is supplied.
- [ ] Implement optional `mobileNavigation` with source-faithful defaults.
- [ ] Run `pnpm test` and `pnpm typecheck`.
- [ ] Commit `feat: match domain mobile navigation treatment`.

### Task 3: Make the Storybook a visual reference

**Files:** Modify `.storybook/main.ts`, `.storybook/preview.css`,
`src/navbar.stories.tsx`; create `.storybook/public/brand/1e99-logo-horizontal.svg`.

- [ ] Add a failing story-level assertion or compile check for the real logo
  asset path.
- [ ] Add the official SVG as Storybook-only static material, semantic tokens
  for the source controls, and faithful Domain/Currículo action examples.
- [ ] Run `pnpm typecheck` and `pnpm build-storybook`.
- [ ] Commit `feat: mirror 1e99 headers in Storybook`.

### Task 4: Align consumer and package documentation

**Files:** Modify `README.md`, `docs/architecture.md`.

- [ ] Replace the prior neutral-navbar claims with the source-faithful
  structure, slots and four variants.
- [ ] Confirm `pnpm pack:check` excludes `.storybook` content.
- [ ] Commit `docs: describe source-faithful navbar contract`.
