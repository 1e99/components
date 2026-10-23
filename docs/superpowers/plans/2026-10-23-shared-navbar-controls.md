# Shared Navbar Controls Implementation Plan

> **Histórico — superado em 2026-10-23.** A variante `document` e sua story
> foram removidas do pacote; consulte `README.md` e `docs/architecture.md`
> para o único `LocaleSelector` controlado atual.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expor botão Google e seletor de idioma fiéis aos aplicativos 1e99, sem dependências de framework ou regras de produto.

**Architecture:** `GoogleSignInButton` é presentacional e imutável visualmente. `LocaleSelector` usa uma união discriminada para separar links de navegação de seleção controlada de idioma do documento, mantendo a marcação comum de disclosure e as densidades já usadas pelo currículo.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library, Storybook.

**Spec:** `docs/superpowers/specs/2026-10-23-shared-navbar-controls-design.md`

## Global Constraints

- Não importar Next.js, `next-intl`, SweetAlert ou SDKs de autenticação.
- Usar os tokens Tailwind de marca já documentados no pacote.
- Não modificar `domain-website` nem `curriculo`.
- O botão Google deve conservar em qualquer uso o estilo do `domain-website`.
- Criar commits pequenos e independentes diretamente a partir de `main`.

## Review Focus

- Opções ativas: cobrir `aria-current` na navegação e `aria-pressed` no documento (Tarefa 2).
- Fechamento do disclosure: cobrir a escolha de link e de botão (Tarefa 2).
- Largura compacta: cobrir as três densidades reais (Tarefa 2).
- Rótulo e atributos de autenticação: cobrir `disabled` e rótulo alternativo (Tarefa 1).
- Integração visual: cobrir que as duas stories de navbar usam os controles públicos (Tarefa 3).

### Task 1: Botão de entrada Google

**Files:**
- Create: `src/google-sign-in-button.tsx`
- Create: `src/google-sign-in-button.test.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `GoogleSignInButton` e `GoogleSignInButtonProps`.

- [ ] Escrever testes que esperem rótulo fornecido pelo consumidor, SVG de quatro paths, `type="button"`, atributos comportamentais e o tratamento visual do domain.
- [ ] Rodar `pnpm test -- src/google-sign-in-button.test.tsx` e confirmar falha de módulo/export ausente.
- [ ] Implementar `GoogleSignInButton(props: GoogleSignInButtonProps)` sem prop de variante ou `className` e exportá-lo pelo índice.
- [ ] Rodar o teste focal e `pnpm test`; confirmar sucesso.
- [ ] Commit: `feat: add shared Google sign-in button`.

### Task 2: Seletor de idioma

**Files:**
- Create: `src/locale-selector.tsx`
- Create: `src/locale-selector.test.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: React nodes e atributos nativos.
- Produces: `LocaleSelector`, `LocaleSelectorNavigationProps`, `LocaleSelectorDocumentProps`, `LocaleSelectorOption` e `LocaleSelectorDensity`.

- [ ] Escrever testes para os links da navbar, densidades e o menu controlado por botões do documento.
- [ ] Rodar `pnpm test -- src/locale-selector.test.tsx` e confirmar falha pelo componente/export ausente.
- [ ] Implementar a união `variant: "navigation" | "document"`; fechar o `<details>` após uma escolha e aplicar as classes fiéis de cada caso.
- [ ] Rodar o teste focal e `pnpm test`; confirmar sucesso.
- [ ] Commit: `feat: add shared locale selector variants`.

### Task 3: Demonstração e documentação

**Files:**
- Modify: `src/navbar.stories.tsx`
- Modify: `src/navbar.stories.test.tsx`
- Modify: `README.md`
- Modify: `docs/architecture.md`

- [ ] Substituir as prévias locais de Google/idioma por componentes públicos nas stories de domain e currículo; acrescentar a story de seleção do documento.
- [ ] Adicionar teste de story que garanta a presença dos dois controles compartilhados.
- [ ] Documentar responsabilidades do consumidor, props e as duas variantes de idioma.
- [ ] Rodar `pnpm typecheck`, `pnpm build`, `pnpm build-storybook` e `pnpm pack:check`.
- [ ] Commit: `docs: demonstrate shared navbar controls`.
