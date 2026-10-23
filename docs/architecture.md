# Arquitetura

## Escopo

`@1e99/components` fornece componentes React reutilizáveis sem dependência de
roteador, framework de renderização, autenticação ou biblioteca de
internacionalização. O aplicativo consumidor fornece marca, rotas, ações,
estado e textos visíveis.

## Componentes

- `Navbar` recebe `brand`, `items`, `actions` e, opcionalmente,
  `mobileNavigation`. As variants `width`, `layer`, `linkTreatment` e
  `linkWeight` permitem adaptar a apresentação sem incorporar regras de
  produto.
- `GoogleSignInButton` oferece somente a apresentação do botão. A integração
  de autenticação e seus estados permanecem no consumidor.
- `Selector` é um disclosure controlado por `value` e `onValueChange`. Cada
  opção possui `value` e `label`, e pode ser estendida pelo consumidor por meio
  de `renderOption` e `renderTrigger`.

Os componentes preservam semântica HTML e não alteram estado externo por conta
própria. Labels e nomes acessíveis são recebidos por props para que cada uso
possa ser internacionalizado.

## Estilos e distribuição

Os componentes usam utilities Tailwind CSS 4 e tokens fornecidos pelo tema do
consumidor. Como Tailwind não examina `node_modules` automaticamente, o
diretório distribuído deve ser incluído com `@source` na folha de entrada do
aplicativo.

O pacote publica `dist/`, `README.md` e `package.json`. `react`, `react-dom`,
`react-icons` e `tailwindcss` são peer dependencies, e `src/index.ts` é a
única fronteira pública de imports.

## Qualidade e releases

ESLint, TypeScript, Vitest, Testing Library e Storybook verificam código,
contratos, interações e acessibilidade. O CI executa lint, tipos, testes,
build, Storybook e uma prévia do tarball antes de publicar uma tag cuja versão
corresponda a `package.json`.

As publicações usam Trusted Publishing do npm via OIDC. O job de publicação
recebe uma identidade efêmera do GitHub Actions e não armazena credenciais npm
de longa duração.
