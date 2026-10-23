# Controles compartilhados da navbar

## Intenção

Além da `Navbar`, o pacote passa a oferecer os dois controles recorrentes
nos headers 1e99: entrada com Google e seleção de idioma. O objetivo é
eliminar as diferenças visuais acidentais, sem mover autenticação, roteamento
ou tradução para este pacote.

## Escopo

- `GoogleSignInButton` reproduz o botão do `domain-website` em toda situação;
  não possui variante visual. Ele recebe apenas atributos comportamentais de
  botão e um rótulo opcional. A autenticação continua no aplicativo.
- `LocaleSelector` reproduz o disclosure de idioma dos sites e possui duas
  variantes que já existem no currículo:
  - `navigation`: idioma atual e links de navegação, para a navbar;
  - `document`: escolha controlada por botões, para o diálogo de geração de
    PDF.
- A variante `navigation` preserva as densidades reais `standard`, `compact`
  e `compact-mobile`; `whiteSurface` cobre a superfície branca existente no
  editor do currículo.
- Storybook mostrará o perfil do domain, o perfil da navbar do currículo e a
  escolha de idioma do documento. Nenhum aplicativo consumidor será alterado.

## Limites de responsabilidade

O pacote não importa Next.js, `next-intl`, SweetAlert, serviços de
autenticação, regras de geração de PDF ou tabela de rotas. O consumidor
traduz rótulos, resolve `href`s e aplica a seleção de documento no seu próprio
estado. Para o caso do diálogo, o componente permite menu `fixed`; o
consumidor que precise deslocá-lo para um portal continua responsável por esse
container de diálogo.

## Alternativas consideradas

1. Manter um único slot genérico na navbar: descartado, pois não padroniza o
   botão Google e não torna reutilizável o seletor do diálogo.
2. Duplicar componentes independentes para cada tela: descartado, pois o
   menu e os itens teriam marcação e estilos repetidos.
3. Um seletor com uma variante para cada interação existente: escolhido. A
   estrutura visual comum fica centralizada, enquanto links e seleção
   controlada conservam semânticas diferentes.

## Acessibilidade e qualidade

`navigation` expõe `aria-current="page"` no idioma ativo; `document` usa
botões com `aria-pressed`. Ambas as variantes usam `<details>` e `<summary>`
nativos, ocultam o marcador padrão, fecham o disclosure após a escolha e
respeitam foco visível e redução de movimento. Testes de unidade verificam
essas semânticas, os contratos de estilo e o repasse da seleção.
