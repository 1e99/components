# Componentes compartilhados 1e99

## Objetivo inicial

Este repositório reúne componentes React reutilizáveis pelos aplicativos 1e99.
Ele iniciou com a navbar já aplicada, com pequenas diferenças, em
`domain-website` e `curriculo`; agora também concentra os controles visuais de
seleção e entrada com Google usados por esses headers.

O pacote será independente de Next.js. Logo, links localizados, imagem da
marca, autenticação, traduções, rotas e regras de geração de documento
continuam sendo fornecidos pelo aplicativo consumidor.

## Estudo das navbars existentes

Ambas possuem cabeçalho fixo, fundo translúcido, borda inferior, conteúdo
centralizado com altura mínima de 80 px, logo à esquerda, links de navegação
visíveis a partir de `lg` e área de ações à direita. Marca, navegação e ações
são regiões irmãs do container; essa estrutura é importante para preservar o
alinhamento que já existe nos sites. Elas usam React 19, Tailwind CSS 4.3 e os
mesmos tokens da marca.

| Aspecto | domain-website | curriculo | Decisão do pacote |
| --- | --- | --- | --- |
| Largura | `max-w-5xl` | `max-w-7xl` | variant `width` |
| Camada | `z-50` | `z-40` | variant `layer` |
| Links | sublinhado animado | simples | variant `linkTreatment` |
| Peso dos links | `font-semibold` | `font-bold` | variant `linkWeight` |
| Mobile | disclosure com menu e ações | links ocultos, sem menu | variant `mobileNavigation` |
| Link | `next-intl` | `next/link` e `a` | renderização injetada pelo consumidor |
| Ações | idioma + conta/login | apps + CTA + conta/login | slots injetados pelo consumidor |
| Logo | `next/image` local | `next/image` local | slot injetado pelo consumidor |

Não serão compartilhados autenticação, `next-intl`, `next/image`, rotas,
traduções, ícones de ações ou regras de conta. `GoogleSignInButton` centraliza
somente a apresentação do login; `Selector` centraliza um disclosure genérico
e controlado, mas recebe os dados e a seleção pelo consumidor. Isso evita
acoplamento entre os aplicativos e mantém os componentes compatíveis com React
fora de Next.js.

## Organização do pacote

Cada componente ocupa `src/components/<nome>/`, mantendo implementação,
testes e story como uma única unidade de manutenção. `src/index.ts` continua
como a única fronteira pública do pacote, e `test/` reúne somente testes que
não pertencem a um componente específico. Essa divisão não altera os imports
dos consumidores.

Os ícones internos usam `react-icons` 5.7.0 — `FcGoogle` e os ícones Lucide
`LuChevronDown` e `LuMenu` — a mesma biblioteca usada pelos dois projetos
fonte. Eles são decorativos (`aria-hidden`); os rótulos acessíveis vêm das
props internacionalizadas de cada consumidor.

## API proposta

`Navbar` recebe:

- `brand`: nó React do link e logo da marca;
- `items`: links com `href` e `label`;
- `renderLink`: função opcional para integrar o roteador do consumidor;
- `actions`: nó React direto para a área direita do cabeçalho; o consumidor
  fornece o próprio wrapper responsivo para preservar seus controles;
- `mobileNavigation`: objeto opcional com `menuLabel`, `navigationLabel` e
  `actions` para o disclosure do domain;
- variants `width` (`content` ou `wide`), `layer` (`standard` ou `above`),
  `linkTreatment` (`underlined` ou `plain`) e `linkWeight` (`semibold` ou
  `bold`).

O disclosure usa elementos HTML nativos, portanto o componente permanece
compatível com renderização no servidor e não introduz uma dependência de
estado ou de framework.

`content`, `standard`, `plain` e `semibold` são os defaults. O disclosure só
existe quando `mobileNavigation` é fornecido e usa `md:hidden`, igual ao
domain-website; o currículo não o fornece. `Navbar` permanece desacoplada de
qualquer controle de idioma ou login: esses elementos são compostos nos slots
pelos consumidores.

## Controles compartilhados

`GoogleSignInButton` fixa em todo o ecossistema a apresentação do botão do
`domain-website`: superfície elevada, borda sutil, ícone oficial multicolorido
e tipografia semibold. Ele não possui variante visual; `label` é obrigatório
e já deve chegar traduzido, junto dos atributos comportamentais nativos.

`Selector` é um disclosure genérico controlado por `value` e
`onValueChange`. Cada opção declara `value` e `label`, e os consumidores podem
estender essa estrutura com os próprios campos. Escolher uma opção fecha o
menu e informa o novo valor, mas não muda a aplicação por conta própria; o
consumidor decide se deve atualizar estado, rotear ou gravar uma preferência.
`renderOption` recebe `option`, `isSelected` e `select` para compor apenas o
conteúdo dentro do botão que o pacote controla. `renderTrigger` recebe a opção
selecionada e o valor atual. Por isso, um consumidor de idiomas aplica `lang`
no conteúdo que renderiza, sem acoplar idioma ao tipo base. O componente
preserva `standard`, `compact`, `compact-mobile`, `whiteSurface`,
botões com `aria-pressed` e `select-none`. Quando `triggerAriaLabel` não é
fornecida, o conteúdo selecionado é o nome acessível do gatilho; aplicações
podem fornecer um nome mais descritivo que acompanhe o valor controlado.

## Tailwind

O componente será escrito com utilities Tailwind 4 e consumirá os tokens de
marca que já existem nos aplicativos (`surface-page`, `border-subtle`,
`action-primary`, `content-primary` e similares). O pacote não fornece tokens
nem reset global.

Como Tailwind 4 não examina `node_modules` automaticamente, cada consumidor
deve registrar o diretório publicado com `@source` na sua folha de entrada.
O README incluirá o exemplo e a localização apropriada dependerá do caminho
da folha CSS no aplicativo consumidor.

## Visualização e qualidade

Storybook React/Vite exibe o playground configurável da navbar e stories
próprias para `Selector` e `GoogleSignInButton`, com o SVG oficial de logo
fixo apenas na demonstração da navbar. O playground transforma args
serializáveis de itens, seletor, Google e menu móvel nos slots genéricos da
navbar — eles não viram props específicas do componente. Vitest e Testing
Library cobrem semântica, layout de regiões irmãs, opções estendidas do
seletor, menu móvel e os estados ativos dos controles. Storybook também tem os
addons Vitest e accessibility para tornar as stories pontos de partida de teste
visual e de interação.

ESLint 9 usa `eslint-config-google` junto das regras TypeScript e React.
`pnpm lint` verifica o padrão, `pnpm lint:fix` aplica as correções automáticas
e Husky exige `pnpm lint` e `pnpm test` antes de cada commit local.

## Publicação

O destino é o registro público npm, como `@1e99/components`. O pacote publica
somente `dist/`, `README.md` e `package.json`, declara `react`, `react-dom`,
`tailwindcss` e `react-icons` como peer dependencies e usa `exports` para
JavaScript e tipos.

O workflow `CI` é executado em pull requests e pushes para `main`; ele valida
lint, tipos, testes, build, Storybook e o conteúdo publicável. O workflow
`Publish package` é acionado apenas por tags `v*`, exige que a tag seja igual a
`v${package.json.version}`, verifica que o commit marcado pertence ao histórico
de `main` e só então cria o artefato publicável. O job privilegiado recebe esse
artefato e, isolado das etapas que executam código do projeto, executa
`npm publish` com `id-token: write`. Todos os actions são fixados em SHAs.

O primeiro release usa o secret temporário `NPM_TOKEN`, um token granular de
curta duração com bypass de 2FA e permissão de publicação limitada a `@1e99`.
Como o pacote ainda não existe nesse momento, essa é uma exceção temporária de
escopo que deve ser revogada após a migração. O npm planeja remover publish
direto com tokens granular de bypass de 2FA em janeiro de 2027; releases
iniciais posteriores devem usar o fluxo de staged publishing suportado então.
Depois que `@1e99/components` existir no npm, o mantenedor configura Trusted
Publisher para GitHub Actions com organização `1e99`, repositório `components`
e workflow `publish.yml`, permitindo `npm publish`. Então o secret é removido
do GitHub e o token é revogado; as próximas releases usam OIDC com
`id-token: write` e não mantêm uma credencial npm duradoura.

As regras do repositório devem exigir o CI antes de merges em `main` e impedir
que pessoas não autorizadas criem ou atualizem tags `v*`; o workflow é uma
segunda barreira, não um substituto dessas proteções no GitHub.

GitHub Packages permanece alternativa privada, mas exigiria configuração de
registro e token em todos os consumidores; npm público é mais simples para os
dois aplicativos atuais. Este escopo automatiza validação e publicação, mas
não cria tags, envia commits nem publica versões por conta própria.
