# Seletor genérico e playground da navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o seletor de idioma em um `Selector` controlado e genérico, e tornar a composição de controles da navbar configurável no Storybook.

**Architecture:** O pacote exportará um único `Selector` com uma opção-base mínima (`value` e `label`) e renderizadores opcionais para o conteúdo do gatilho e de cada opção. A `Navbar` permanecerá agnóstica: suas stories transformarão args serializáveis em `actions` para desktop e mobile, mantendo o logotipo oficial fixo apenas na demonstração.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Storybook 10, Vitest, Testing Library e react-icons.

**Spec:** `docs/superpowers/specs/2026-10-23-generic-selector-navbar-playground-design.md`

## Global Constraints

- Trabalhar diretamente na branch `main`; não alterar os aplicativos consumidores nem publicar o pacote.
- Preservar o padrão Google de lint, Tailwind e o uso de `react-icons` para ícones.
- O `Selector` continua totalmente controlado por `value` e `onValueChange`; ele não redireciona nem altera o valor por conta própria.
- O pacote preserva semântica e foco: opções são botões com `aria-pressed`, o disclosure fecha após a escolha e nenhum `renderOption` pode substituir o botão controlado pelo pacote.
- Manter `select-none` no gatilho e nas opções.
- A `Navbar` não receberá props específicas de idioma, Google ou produtos; `items`, `actions` e `mobileNavigation` continuam sendo seus pontos de composição.
- Usar commits pequenos e temáticos; o hook Husky deve validar lint e testes em cada commit.

## Review Focus

- Uma opção estendida por um consumidor deve permanecer tipada em `renderOption` e `renderTrigger`; cobrir na Task 1.
- Um valor controlado que ainda não está na lista não deve quebrar o gatilho; ele deve mostrar o próprio valor; cobrir na Task 1.
- Selecionar uma opção customizada deve notificar o consumidor e fechar o disclosure, sem modificar a UI até o valor controlado mudar; cobrir na Task 1.
- Desativar o seletor e o botão Google nos args da story deve remover ambos das ações desktop e mobile; cobrir na Task 2.
- Alterar itens e rótulos pelos args deve aparecer na navbar sem tornar o logotipo um controle da story; cobrir na Task 2.

---

## Estrutura de arquivos

- `src/components/selector/selector.tsx`: componente genérico controlado, seus tipos e a semântica do disclosure.
- `src/components/selector/selector.test.tsx`: contratos de acessibilidade, controle externo e renderizadores genéricos.
- `src/components/selector/selector.stories.tsx`: exemplos de opções simples e estendidas para o Storybook.
- `src/components/navbar/navbar.stories.tsx`: playground com args serializáveis e referências DomainWebsite/Curriculo.
- `src/components/navbar/navbar.stories.test.tsx`: comportamento observável da composição da story.
- `src/components/google-sign-in-button/google-sign-in-button.stories.tsx`: página própria e controlável para o botão.
- `src/index.ts`, `README.md`, `docs/architecture.md`: API pública e orientação de composição atualizadas.

### Task 1: Substituir LocaleSelector por Selector genérico controlado

**Files:**

- Create: `src/components/selector/selector.tsx`
- Create: `src/components/selector/selector.test.tsx`
- Create: `src/components/selector/selector.stories.tsx`
- Modify: `src/index.ts`
- Delete: `src/components/locale-selector/locale-selector.tsx`
- Delete: `src/components/locale-selector/locale-selector.test.tsx`
- Delete: `src/components/locale-selector/locale-selector.stories.tsx`

**Interfaces:**

- Consumes: o layout visual e as classes Tailwind do `LocaleSelector` atual.
- Produces: `Selector`, `SelectorOption`, `SelectorProps`, `SelectorDensity`, `SelectorRenderOptionContext` e `SelectorRenderTriggerContext`, todos exportados por `src/index.ts`.

- [ ] **Step 1: Escrever testes que definem a API genérica antes da implementação.**

  Em `src/components/selector/selector.test.tsx`, portar os contratos atuais para `Selector` e adicionar uma opção estendida, por exemplo `{value, label, description, icon}`. Validar que `renderTrigger` recebe a opção selecionada, `renderOption` recebe a opção estendida, `isSelected` e `select`; validar `aria-pressed`, `select-none`, fechamento do `details`, ausência de links/redirecionamento e que a UI só muda depois de o consumidor atualizar `value`. Acrescentar o caso `value="unknown"`, cujo gatilho mostra `unknown`.

- [ ] **Step 2: Executar o teste isolado para confirmar a falha.**

  Run: `pnpm vitest run src/components/selector/selector.test.tsx`

  Expected: FAIL porque `Selector` e os tipos genéricos ainda não existem no novo caminho.

- [ ] **Step 3: Implementar o contrato genérico em `src/components/selector/selector.tsx`.**

  Definir:

  ```ts
  export type SelectorOption = {label: ReactNode; value: string};
  export type SelectorProps<TOption extends SelectorOption = SelectorOption> = {
    label: string;
    value: TOption['value'];
    options: readonly TOption[];
    onValueChange: (value: TOption['value']) => void;
    renderOption?: (context: SelectorRenderOptionContext<TOption>) => ReactNode;
    renderTrigger?: (context: SelectorRenderTriggerContext<TOption>) => ReactNode;
    density?: SelectorDensity;
    triggerAriaLabel?: string;
    whiteSurface?: boolean;
  };
  export function Selector<TOption extends SelectorOption>(props: SelectorProps<TOption>): ReactNode;
  ```

  Reutilizar o disclosure atual e seu `LuChevronDown`; invocar os renderizadores somente para conteúdo interno do `summary` e do botão. O botão chama `onValueChange(option.value)` e fecha o `details`; sem `languageTag` no tipo base.

- [ ] **Step 4: Mover a API pública e as stories para o novo nome.**

  Usar `git mv` para preservar o histórico quando aplicável, remover todos os exports `LocaleSelector*` de `src/index.ts` e exportar apenas a nova API. Criar stories `Controls/Selector` para uma coleção simples e outra com conteúdo customizado, aplicando `lang` no conteúdo da story de idiomas — não no componente genérico.

- [ ] **Step 5: Executar testes, tipos e lint da Task 1.**

  Run: `pnpm vitest run src/components/selector/selector.test.tsx && pnpm typecheck && pnpm lint`

  Expected: PASS, sem imports ou tipos `LocaleSelector` remanescentes no código-fonte.

- [ ] **Step 6: Fazer micro-commits da API e das stories.**

  ```bash
  git add -A src/components/locale-selector src/components/selector src/index.ts
  git commit -m "refactor: generalize controlled selector"
  git add src/components/selector/selector.stories.tsx
  git commit -m "docs: add generic selector stories"
  ```

### Task 2: Criar o playground configurável da navbar e a story do botão Google

**Files:**

- Create: `src/components/google-sign-in-button/google-sign-in-button.stories.tsx`
- Modify: `src/components/navbar/navbar.stories.tsx`
- Modify: `src/components/navbar/navbar.stories.test.tsx`

**Interfaces:**

- Consumes: `Selector` e `SelectorOption` da Task 1; `GoogleSignInButton`; `NavbarProps` e `NavbarMobileNavigation` existentes.
- Produces: stories `Navigation/Navbar` com args `items`, `showSelector`, `selectorLabel`, `selectorOptions`, `showGoogleSignIn`, `googleSignInLabel`, `showMobileNavigation`, `mobileMenuLabel` e `mobileNavigationLabel`, além de `Controls/GoogleSignInButton`.

- [ ] **Step 1: Escrever testes da story antes de reestruturar a composição.**

  Em `src/components/navbar/navbar.stories.test.tsx`, adicionar um teste que renderiza o playground com `showSelector: false` e `showGoogleSignIn: false` e afirma que eles estão ausentes no desktop e no menu móvel. Adicionar um teste que passa itens e rótulos próprios, abre o menu móvel e encontra os mesmos controles e rótulos. Preservar a asserção de que a marca oficial está presente e fixa.

- [ ] **Step 2: Executar o teste de stories para confirmar a falha.**

  Run: `pnpm vitest run src/components/navbar/navbar.stories.test.tsx`

  Expected: FAIL porque o renderizador atual fixa `LocalePreview`, `GoogleSignInButton` e as ações por variante.

- [ ] **Step 3: Implementar `NavbarPlayground` em `src/components/navbar/navbar.stories.tsx`.**

  Criar um tipo local que combine os args configuráveis com `Omit<NavbarProps, 'actions' | 'brand' | 'mobileNavigation'>`. O renderizador deve manter `BrandLogoPreview` fora dos args e construir, a partir dos booleans/rótulos/lista serializável, um `Selector` controlado e um `GoogleSignInButton` para `actions` e `mobileNavigation.actions`. Os itens recebidos devem ser passados diretamente à `Navbar`. DomainWebsite e Curriculo devem apenas fornecer valores iniciais desse playground.

- [ ] **Step 4: Criar a story do botão Google.**

  Em `src/components/google-sign-in-button/google-sign-in-button.stories.tsx`, expor `Controls/GoogleSignInButton` com `label` e atributos HTML já aceitos, incluindo o estado `disabled`; não alterar a API do botão.

- [ ] **Step 5: Executar os testes e a construção de stories.**

  Run: `pnpm vitest run src/components/navbar/navbar.stories.test.tsx && pnpm build-storybook`

  Expected: PASS e o build contém o playground da navbar e a story própria do GoogleSignInButton.

- [ ] **Step 6: Fazer micro-commits da composição.**

  ```bash
  git add src/components/navbar/navbar.stories.tsx src/components/navbar/navbar.stories.test.tsx
  git commit -m "feat: make navbar story controls configurable"
  git add src/components/google-sign-in-button/google-sign-in-button.stories.tsx
  git commit -m "docs: add google sign-in button story"
  ```

### Task 3: Documentar a nova superfície pública e verificar o pacote

**Files:**

- Modify: `README.md`
- Modify: `docs/architecture.md`

**Interfaces:**

- Consumes: os exports e as stories concluídos nas Tasks 1 e 2.
- Produces: instruções atualizadas para importar/compor `Selector` e usar o playground, sem alegações sobre um componente específico de locale.

- [ ] **Step 1: Atualizar a documentação da API e composição.**

  Substituir referências vivas a `LocaleSelector` por `Selector`; documentar o contrato controlado, a extensão de opções com generics e os dois renderizadores. Explicar que atributos de idioma pertencem ao conteúdo de quem consome, e que Google/Selector são exemplos configurados nas stories, não props da `Navbar`.

- [ ] **Step 2: Executar busca de regressão de nomenclatura.**

  Run: `rg -n "LocaleSelector|LocaleSelector[A-Z]" src README.md docs/architecture.md`

  Expected: nenhum resultado em documentação/API vigente.

- [ ] **Step 3: Executar a verificação integral antes do commit.**

  Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm build-storybook && pnpm pack --pack-destination /tmp/one99-components-pack`

  Expected: todos os comandos terminam com status 0; o tarball contém a API pública esperada.

- [ ] **Step 4: Fazer o micro-commit de documentação.**

  ```bash
  git add README.md docs/architecture.md
  git commit -m "docs: explain generic selector composition"
  ```

