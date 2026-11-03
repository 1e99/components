# @1e99/components

Componentes React reutilizáveis, estilizados com Tailwind CSS.

## Instalação

```sh
pnpm add @1e99/components
```

O pacote declara `react`, `react-dom`, `react-icons` e `tailwindcss` como peer
dependencies.

### Tailwind CSS 4

O Tailwind 4 não examina automaticamente classes em `node_modules`. Na folha
CSS que importa o Tailwind, adicione uma diretiva `@source` cujo caminho seja
relativo a ela:

```css
@import "tailwindcss";
@source "../../node_modules/@1e99/components/dist";
```

Os componentes usam tokens Tailwind do tema do aplicativo, como
`surface-page`, `content-primary`, `content-secondary`, `border-subtle`,
`action-primary`, `surface-raised`, `content-inverse`, `shadow-card`,
`shadow-float`, `shadow-focus`, `ease-brand`, `shell`, `control` e `card`.
O pacote não cria tokens nem importa CSS global.

## Uso

```tsx
import {useState} from "react";
import {
  AccountControl,
  CloseButton,
  Dialog,
  GoogleSignInButton,
  Navbar,
  Selector,
} from "@1e99/components";

const languageOptions = [
  {label: "Português", value: "pt"},
  {label: "English", value: "en"},
] as const;

function Header() {
  const [language, setLanguage] = useState("pt");

  return (
    <Navbar
      actions={
        <div className="hidden items-center gap-3 md:flex">
          <Selector
            label="Idioma"
            onValueChange={setLanguage}
            options={languageOptions}
            value={language}
          />
          <GoogleSignInButton
            label="Entrar com Google"
            onClick={() => undefined}
          />
        </div>
      }
      brand={<a aria-label="Início" href="/">Marca</a>}
      items={[
        {href: "/products", label: "Produtos"},
        {href: "/about", label: "Sobre"},
      ]}
      navigationLabel="Navegação principal"
    />
  );
}
```

`Navbar` mantém marca, itens de navegação e ações como regiões independentes.
Use `renderLink` para integrar um roteador próprio sem acoplar o pacote a uma
biblioteca de navegação. Os itens podem ser adicionados ou removidos, e
`actions` e `mobileNavigation.actions` aceitam qualquer nó React.

| Prop | Opções | Finalidade |
| --- | --- | --- |
| `width` | `content` (padrão), `wide` | Largura máxima da navegação |
| `layer` | `standard` (padrão), `above` | Camada de empilhamento |
| `linkTreatment` | `plain` (padrão), `underlined` | Aparência dos links |
| `linkWeight` | `semibold` (padrão), `bold` | Peso dos links |
| `mobileNavigation` | ausente ou objeto de disclosure | Navegação móvel opcional |

`GoogleSignInButton` recebe uma `label` obrigatória e os atributos nativos de
um botão, como `onClick`, `disabled` e `aria-*`. Autenticação, estado de
carregamento e traduções pertencem ao aplicativo que o utiliza.

`AccountControl` apresenta a identidade autenticada e a ação de saída. Passe
nome/e-mail, um `fallbackIdentity`, textos traduzidos e `onSignOut`; a ação
concreta de logout, Auth.js, rotas e locale continuam no aplicativo consumidor.
Como ele compõe um `Selector` interativo, use-o a partir de um componente do
cliente:

```tsx
<AccountControl
  email="ada@example.com"
  fallbackIdentity="Conta"
  menuAriaLabel="Menu da conta de Ada Lovelace"
  menuText="Conta"
  name="Ada Lovelace"
  onSignOut={() => logout()}
  signOutAriaLabel="Sair desta conta"
  signOutText="Sair"
/>
```

Use `children` para inserir conteúdo ou ações específicas do produto entre a
identidade e a saída. O conteúdo não é uma opção selecionável; o consumidor
continua responsável pelo estado, efeitos e traduções dessas ações:

```tsx
<AccountControl {...accountProps}>
  <button onClick={() => clearLocalDrafts()} type="button">
    Limpar dados locais
  </button>
</AccountControl>
```

`getInitials(value)` é um utilitário puro exportado pelo pacote. Ele retorna
até duas iniciais (primeira e última palavras), normaliza espaços e usa `"1"`
quando não há identidade disponível.

`Selector` é controlado: `value` determina a opção visível e
`onValueChange` informa uma nova escolha. As opções exigem somente `value` e
`label`, mas podem ser estendidas com outros campos e apresentadas por
`renderOption` e `renderTrigger`. O componente não navega nem muda estado por
conta própria.

`Dialog` também é controlado. Passe `open` e atualize esse estado em `onClose`;
o componente usa o elemento nativo `<dialog>` para apresentar um modal com
título, backdrop e botão de fechar consistentes. O título obrigatório fornece o
nome acessível por padrão. Use `ariaLabel` somente quando ele precisar ser mais
específico do que o título visível:

```tsx
function PlansDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Ver planos
      </button>
      <Dialog
        closeLabel="Fechar planos"
        onClose={() => setOpen(false)}
        open={open}
        title="Planos disponíveis"
      >
        <p>Compare os recursos antes de escolher.</p>
      </Dialog>
    </>
  );
}
```

`CloseButton` é o mesmo controle de fechar estilizado e pode ser reutilizado em
outros elementos dispensáveis. Ele exige `label` para que cada consumidor use o
texto traduzido apropriado:

```tsx
<CloseButton label="Fechar painel" onClick={() => setPanelOpen(false)} />
```

## Desenvolvimento

```sh
pnpm lint
pnpm lint:fix
pnpm format
pnpm storybook
pnpm test
pnpm test:utils
pnpm test:stories
pnpm build
pnpm build-storybook
pnpm pack:check
```

Husky executa `pnpm lint` e `pnpm test` antes de cada commit. Utilitários puros
são verificados pelo Jest com `pnpm test:utils`. As stories são
verificadas em Chromium por `pnpm test:stories`; em uma máquina Linux nova,
instale as dependências uma vez:

```sh
pnpm exec playwright install chromium
sudo pnpm exec playwright install-deps chromium
```

Cada componente fica em `src/components/<nome>/`, junto dos seus testes e
stories. `src/index.ts` é o ponto de entrada público, e testes transversais
ficam em `test/`.

## Licença

Este pacote é licenciado sob a [MIT License](LICENSE). Você pode usar, copiar,
modificar, distribuir e sublicenciar o software, inclusive comercialmente,
desde que preserve o aviso de copyright e a licença.
