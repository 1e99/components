# Organização do código e padrão de qualidade

## Intenção

O pacote deixará de concentrar componentes, stories e testes diretamente em
`src/`. A estrutura deve tornar cada componente fácil de localizar e manter,
além de automatizar o padrão de código Google com ESLint.

## Estrutura escolhida

```text
src/
  components/
    google-sign-in-button/
      google-sign-in-button.tsx
      google-sign-in-button.test.tsx
    locale-selector/
      locale-selector.tsx
      locale-selector.test.tsx
      locale-selector.stories.tsx
    navbar/
      navbar.tsx
      navbar.test.tsx
      navbar.stories.tsx
      navbar.stories.test.tsx
  index.ts
test/
  storybook-theme.test.ts
```

Implementação, teste e story ficam juntos porque mudam como uma unidade. O
índice permanece o único arquivo de entrada pública. A API e os caminhos de
importação do pacote publicado não mudam.

## Ferramentas de qualidade

Será usado ESLint 9, alinhado aos projetos consumidores, com
`eslint-config-google` como base do padrão Google. `typescript-eslint`,
`eslint-plugin-react` e `eslint-plugin-react-hooks` acrescentam análise para
TypeScript e React. As duas regras JSDoc removidas pelo ESLint 9 ficam
desativadas; as demais regras Google continuam ativas.

Os comandos serão:

- `pnpm lint`: verifica todo o código sem avisos;
- `pnpm lint:fix`: aplica correções automáticas do ESLint;
- `pnpm format`: atalho para `lint:fix`.

Arquivos gerados, dependências, cobertura e artefatos Storybook não entram no
lint. A configuração incluirá fontes de Node, browser e Vitest conforme cada
arquivo do pacote.

Husky 9 configurará `.husky/pre-commit` via `prepare`. Antes de qualquer
commit local, o hook executará `pnpm lint` e `pnpm test`, em sequência; se um
deles falhar, o commit será interrompido. Não será usado `lint-staged`, pois a
solicitação é validar a suíte inteira.

## Ícones

Os dois consumidores usam `react-icons` 5.7.0, em especial `FcGoogle` e os
ícones Lucide de `react-icons/lu`. O pacote declarará `react-icons` como peer
dependency compatível e dependência de desenvolvimento para suas stories e
testes. Ele substituirá SVGs desenhados manualmente pelos mesmos ícones:

- `FcGoogle` no botão de Google;
- `LuChevronDown` no seletor de idioma;
- `LuMenu` na navbar móvel;
- `LuExternalLink` na story do currículo.

`aria-hidden` será mantido nos ícones decorativos; os rótulos acessíveis
continuam vindo das props internacionais já existentes.

## Limites

Não haverá alteração nos consumidores, nos tokens Tailwind, nas props
públicas nem nas labels fornecidas pelo consumidor. ESLint substitui apenas a
formatação e validação de código; não será adicionado outro formatador em
paralelo.
