# Componentes compartilhados 1e99

## Objetivo inicial

Este repositório reúne componentes React reutilizáveis pelos aplicativos 1e99.
O primeiro é a navbar já aplicada, com pequenas diferenças, em
`domain-website` e `curriculo`.

O pacote será independente de Next.js. Logo, links localizados, imagem da
marca, autenticação, seletor de idioma e ações de produto continuam sendo
fornecidos pelo aplicativo consumidor.

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
traduções, ícones de ações ou regras de conta. Isso evita acoplamento entre
os aplicativos e mantém a navbar compatível com React fora de Next.js.

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
domain-website; o currículo não o fornece.

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

Storybook React/Vite exibe os perfis visuais fiéis dos dois headers, com o SVG
oficial de logo apenas em `.storybook/public`, viewport móvel para o
disclosure e os tokens reais de superfície, sombra e tipografia. Vitest e
Testing Library cobrem semântica, layout de regiões irmãs, variantes e menu
móvel. Storybook também tem os addons Vitest e accessibility para tornar as
stories pontos de partida de teste visual e de interação.

## Publicação

O destino recomendado é o registro público npm, como `@1e99/components`.
Em 2026-10-23 esse nome não retornou uma versão pública no registro. A
publicação exigirá que a organização `@1e99` exista no npm, autenticação com
permissão de publicação e `npm publish --access public`. O pacote publicará
somente `dist/`, terá `react`, `react-dom` e `tailwindcss` como peer
dependencies, e usará `exports` para JavaScript e tipos.

GitHub Packages permanece alternativa privada, mas exigiria configuração de
registro e token em todos os consumidores; npm público é mais simples para os
dois aplicativos atuais. Este escopo prepara o pacote e documenta o processo,
mas não publica nada nem altera os consumidores.
