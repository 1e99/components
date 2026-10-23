# Code Organization and Linting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar o código por componente, aplicar ESLint com padrão Google e trocar SVGs manuais por `react-icons`.

**Architecture:** Os componentes passam a ser unidades coesas em
`src/components/<component>/`, com implementação e testes colocalizados. O
ESLint 9 usa as regras do `eslint-config-google`, complementadas por regras
TypeScript e React; `react-icons` permanece externo no pacote publicado como
peer dependency.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, ESLint 9,
eslint-config-google, typescript-eslint, react-icons 5.7.0, Vitest,
Storybook.

**Spec:** `docs/superpowers/specs/2026-10-23-code-organization-and-linting-design.md`

## Global Constraints

- Não alterar as exportações públicas de `@1e99/components`.
- Manter labels, rotas e estado controlado fornecidos pelo consumidor.
- Usar `react-icons` 5.7.0, a mesma biblioteca dos dois consumidores.
- Usar ESLint 9 e `eslint-config-google`; não adicionar Prettier.
- Criar commits pequenos diretamente em `main`, conforme instrução do usuário.

## Review Focus

- Resolução pública: cobrir importação pelo índice após mover cada componente (Tarefa 2).
- Ícones decorativos: cobrir `aria-hidden` e uso de ícones de `react-icons` (Tarefa 2).
- Formatação: `pnpm lint` e `pnpm lint:fix -- --dry-run` devem terminar sem avisos (Tarefa 1).
- Publicação: verificar que `react-icons` é peer dependency e não entra no bundle (Tarefa 1 e 3).
- Descoberta Storybook: validar que stories movidas continuam no build (Tarefa 3).

### Task 1: Ferramentas de lint e formatação

**Files:**
- Create: `eslint.config.mjs`, `.husky/pre-commit`
- Modify: `package.json`, `pnpm-lock.yaml`, `.gitignore`

**Interfaces:**
- Produces: scripts `lint`, `lint:fix`, `format`, configuração ESLint flat e
  hook de pre-commit Husky.

- [ ] Executar `pnpm lint` e confirmar falha porque o script/configuração ainda não existem.
- [ ] Instalar as dependências ESLint, TypeScript/React, `react-icons` e Husky nas versões do ecossistema 1e99.
- [ ] Configurar regras Google adaptadas ao ESLint 9 e regras React/TypeScript; declarar `react-icons` como peer e externo no bundle.
- [ ] Configurar `prepare` e `.husky/pre-commit` para executar `pnpm lint` e `pnpm test` antes de todo commit local.
- [ ] Executar `pnpm lint:fix`, `pnpm lint` e `pnpm typecheck`; confirmar sucesso sem avisos.
- [ ] Commit: `chore: add Google style linting`.

### Task 2: Organização e ícones compartilhados

**Files:**
- Move: arquivos de cada componente, testes e stories para `src/components/<name>/`
- Move: `src/storybook-theme.test.ts` para `test/storybook-theme.test.ts`
- Modify: `src/index.ts`, `tsconfig.json`, imports internos e testes

**Interfaces:**
- Consumes: exports atuais de `src/index.ts`.
- Produces: mesma API pública a partir da nova estrutura.

- [ ] Alterar os testes para exigirem ícones de `react-icons` com marcação decorativa e executar para observar a falha contra SVGs manuais.
- [ ] Mover arquivos sem alterar suas APIs, atualizar imports e substituir os quatro SVGs definidos no escopo.
- [ ] Executar `pnpm test` e `pnpm typecheck`; confirmar que todas as importações públicas e os comportamentos continuam íntegros.
- [ ] Commit: `refactor: organize shared components`.
- [ ] Commit: `refactor: use shared icon library`.

### Task 3: Documentação e verificação de distribuição

**Files:**
- Modify: `README.md`, `docs/architecture.md`, `tsup.config.ts`

- [ ] Documentar a estrutura, os comandos de qualidade e `react-icons` como peer dependency.
- [ ] Executar `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm build-storybook` e `pnpm pack:check`.
- [ ] Inspecionar `dist/index.js` para confirmar que imports de `react-icons` permanecem externos.
- [ ] Commit: `docs: document component quality standards`.
