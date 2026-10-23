# Seletor genérico e playground da navbar

## Intenção

O atual `LocaleSelector` deixou de ter comportamento específico de diálogo,
mas ainda está nomeado e tipado para idiomas. Ele deve se tornar um
`Selector` genérico para qualquer conjunto de escolhas controladas. A navbar
já recebe `items` e `actions`, porém suas stories fixam o seletor e o botão de
Google; o Storybook deve expor essa composição como configuração interativa.

## Selector

`Selector` substitui `LocaleSelector` como exportação pública. Suas opções
possuem uma chave estável `value` e conteúdo base `label`, mas o consumidor
pode acrescentar campos próprios tipando a coleção. `renderOption` recebe a
opção, seu estado selecionado e o callback de seleção para exibir conteúdo
customizado dentro do botão que o pacote controla. `renderTrigger` recebe a
opção selecionada e permite personalizar o conteúdo visível do gatilho.

O componente continua controlado por `value` e `onValueChange`, mantém
botões com `aria-pressed`, fecha o disclosure após escolher, não navega e
mantém `select-none`. `languageTag` sai da opção genérica: consumidores que
precisem de `lang` podem aplicar esse atributo no conteúdo retornado por seus
renderizadores.

## Navbar e Storybook

`Navbar` preserva seus slots genéricos existentes: `items` já permite
adicionar/remover links e `actions` aceita qualquer conteúdo React. Não serão
adicionadas props de Google ou seletor ao componente, pois isso o acoplaria a
produtos específicos.

A story terá um playground cujo logo oficial 1e99 fica fixo. Seus args
serializáveis controlarão a lista de itens, a presença e os rótulos do
`Selector` e do `GoogleSignInButton`. O renderizador da story monta o slot
`actions` a partir desses args tanto no desktop quanto no menu móvel. As
referências DomainWebsite e Curriculo podem definir seus valores iniciais,
mas nenhum dos controles fica embutido no componente `Navbar`.

## Limites

Não serão alterados os aplicativos consumidores. Não haverá renderização de
botões inteiros por `renderOption`: essa limitação preserva semântica, foco,
fechamento e acessibilidade sob responsabilidade do `Selector`.
