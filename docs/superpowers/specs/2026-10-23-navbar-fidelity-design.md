# Navbar fiel às implementações 1e99

## Intenção

A primeira versão do pacote generalizou demais a navbar e a sua Storybook não
representa a interface entregue. Esta correção trata `site-header.tsx` do
`domain-website` e `landing-header.tsx` do `curriculo` como especificação
visual. O resultado deve poder substituir a estrutura compartilhada sem mudar
logo, cores, tipografia, espaçamento, controles ou resposta móvel observados.

## Objetivos

- Manter o cabeçalho comum: `min-h-20`, `px-shell`, borda inferior,
  `bg-surface-page/90`, `backdrop-blur-lg` e tipografia `text-label`.
- Preservar três regiões irmãs no container: marca, navegação desktop e ações.
  O menu móvel também é irmão, nunca é agrupado com a navegação desktop.
- Modelar apenas as diferenças comprovadas entre os dois produtos.
- Fazer a story do domain representar a composição vista no site: logo real,
  navegação, seletor de idioma, login Google e menu móvel azul.
- Não alterar consumidores nem importar APIs de Next.js no pacote.

## Não objetivos

- Compartilhar autenticação, seletor de idioma, links localizados ou o
  componente de logo dos aplicativos.
- Alterar a identidade visual de qualquer produto.
- Produzir uma navbar visualmente neutra ou um novo design.

## Alternativas consideradas

1. Manter a API atual, que reúne navegação e ações em uma região direita.
   Rejeitada: muda o alinhamento do desktop e não reproduz o menu do domain.
2. Criar uma variante integral para cada aplicativo. Rejeitada: duplica a
   estrutura compartilhada e faz o pacote conhecer produtos específicos.
3. **Escolhida:** um shell com regiões irmãs e dados de links, com slots para
   integrações e um menu móvel configurável. A estrutura comum fica no pacote;
   os controles de cada produto permanecem nos slots.

## Contrato visual e API

`Navbar` recebe `brand`, `items`, `navigationLabel`, `renderLink` opcional e
`actions` como nó direto. `actions` contém, quando necessário, o seu próprio
wrapper responsivo; isso preserva exatamente `hidden md:flex` no domain e
`flex` no currículo.

As variantes são pequenas e baseadas no código-fonte existente:

| Diferença | API | domain-website | curriculo |
| --- | --- | --- | --- |
| Largura | `width` | `content` / `max-w-5xl` | `wide` / `max-w-7xl` |
| Camada | `layer` | `above` / `z-50` | `standard` / `z-40` |
| Links | `linkTreatment` + `linkWeight` | `underlined` + `semibold` | `plain` + `bold` |
| Mobile | `mobileNavigation` opcional | disclosure em `md:hidden` | ausente |

O disclosure reproduz o domain: controle quadrado `size-12`,
`bg-action-primary`, ícone de menu, `shadow-card`, painel `top-14 w-72`,
`bg-surface-raised` e `shadow-float`. Seus links usam o estilo móvel real, e
as ações móveis são um slot separado.

O Storybook terá cópia de demonstração do SVG horizontal oficial somente em
`.storybook/public`; o artefato publicado continua sem assets ou CSS global.

## Verificação

Testes unitários fixam a ordem estrutural das regiões, as classes/semântica do
disclosure e as variantes. As stories Domain e Currículo servem de referência
visual e são compiladas no build estático. O teste em Chromium continuará
configurado, com a pré-condição de bibliotecas de sistema já documentada.
