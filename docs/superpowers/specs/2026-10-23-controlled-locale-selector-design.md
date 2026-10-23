# Seletor de idioma controlado

> **Histórico — superado em 2026-10-23.** O pacote deixou de oferecer a
> variante `document`; consulte `README.md` e `docs/architecture.md` para a
> API atual de um único seletor controlado.

## Intenção

`LocaleSelector` não deve decidir como uma troca de idioma altera a aplicação.
Hoje a variante `navigation` exige `href` e renderiza links, assumindo que
escolher um idioma sempre redireciona. A variante `document` já entrega a
escolha ao consumidor por `onValueChange`.

As duas variantes passarão a seguir o mesmo contrato controlado: o consumidor
fornece `value`, recebe a nova opção em `onValueChange` e decide se atualiza
estado, roteia, persiste uma preferência ou executa outra ação. O componente
nunca cria um redirecionamento.

## API

`LocaleSelectorNavigationOption` continuará exportado por compatibilidade de
nome, mas será um alias de `LocaleSelectorOption` e não terá `href`.
`LocaleSelectorNavigationProps` exigirá `onValueChange(value: string): void`.

As opções de `navigation` serão renderizadas como `button`, com
`aria-pressed` para indicar o valor controlado. A variante `document` mantém
o mesmo padrão. Em ambas, escolher uma opção chama o callback e fecha o
disclosure; somente o consumidor muda o `value` renderizado.

## Estilo e acessibilidade

O gatilho e cada opção recebem a utility Tailwind `select-none`, impedindo
seleção acidental de texto durante interação. Os ícones continuam
decorativos, e labels, idioma (`lang`) e rótulos acessíveis continuam vindo do
consumidor internacionalizado.

## Limites

Não serão alterados os projetos consumidores. A remoção de `href` é uma
mudança pública deliberada para o pacote pré-1.0, requerida para remover a
suposição de redirecionamento. Documentação e stories demonstrarão um
consumidor controlando o valor.
