# Controlled Locale Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar as duas variantes de `LocaleSelector` controladas pelo
consumidor e impedir seleção acidental de texto.

**Architecture:** A variante `navigation` deixa de usar links e opções com
`href`; passa a reutilizar o fluxo de escolha controlada da variante
`document`: botão, `onValueChange`, fechamento do disclosure e re-render do
valor pelo consumidor. O nome de tipo público de navegação é preservado como
alias do tipo genérico de opção.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library,
Storybook.

**Spec:** `docs/superpowers/specs/2026-10-23-controlled-locale-selector-design.md`

## Global Constraints

- `value` é sempre controlado pelo consumidor e `onValueChange` recebe o novo
  valor nas duas variantes.
- A variante `navigation` não aceita nem interpreta `href` e nunca navega.
- Manter todas as labels e tags de idioma fornecidas pelo consumidor.
- Aplicar `select-none` ao gatilho e às opções de idioma.
- Não alterar `domain-website` nem `curriculo`.
- Criar commits pequenos diretamente em `main`, conforme instrução do usuário.

## Review Focus

- Clique em uma opção de navegação deve chamar o callback, fechar o menu e só
  alterar a UI quando o consumidor atualizar `value` (Tarefa 1).
- Valor inicialmente selecionado deve usar `aria-pressed` nas duas variantes,
  sem `aria-current` nem links na variante de navegação (Tarefa 1).
- Gatilhos e opções devem incluir `select-none` sem remover classes de
  densidade ou de acessibilidade existentes (Tarefa 1).
- Stories e exemplos não podem preservar campos `href` nem omitir o callback
  obrigatório (Tarefa 2).

### Task 1: Controlar a variante de navegação

**Files:**
- Modify: `src/components/locale-selector/locale-selector.tsx`
- Modify: `src/components/locale-selector/locale-selector.test.tsx`

**Interfaces:**
- Produces: `LocaleSelectorNavigationOption = LocaleSelectorOption` e
  `LocaleSelectorNavigationProps` com `onValueChange(value: string): void`.

- [ ] Escrever testes com um consumidor React controlado para clicar em
  `English`, observar o callback atualizar `value`, `aria-pressed`, o texto do
  gatilho e o fechamento do disclosure; exigir ausência de links e `href`.
- [ ] Executar o teste focalizado e observar falha, porque a variante ainda
  renderiza âncoras e não tem callback.
- [ ] Tornar `LocaleSelectorNavigationOption` alias de `LocaleSelectorOption`,
  exigir `onValueChange`, renderizar botões e compartilhar o fechamento do
  disclosure; acrescentar `select-none` às classes comum de gatilho e opção.
- [ ] Executar `pnpm test -- src/components/locale-selector/locale-selector.test.tsx`,
  `pnpm lint` e `pnpm typecheck`; confirmar sucesso.
- [ ] Commit: `feat: control navigation locale selection`.

### Task 2: Atualizar exemplos e documentação

**Files:**
- Modify: `src/components/locale-selector/locale-selector.stories.tsx`
- Modify: `src/components/navbar/navbar.stories.tsx`
- Modify: `README.md`
- Modify: `docs/architecture.md`

**Interfaces:**
- Consumes: props controladas produzidas pela Tarefa 1.
- Produces: exemplos sem `href`, com callbacks que pertencem ao consumidor.

- [ ] Atualizar stories com `useState` para a variante de navegação e remover
  todos os `href` das opções internas do pacote.
- [ ] Atualizar README e arquitetura para explicar que redirecionamento, se
  houver, é implementado em `onValueChange` pelo consumidor.
- [ ] Executar `pnpm test`, `pnpm lint`, `pnpm typecheck` e
  `pnpm build-storybook`; confirmar sucesso.
- [ ] Commit: `docs: explain controlled locale selection`.
