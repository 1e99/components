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

`Selector` é controlado: `value` determina a opção visível e
`onValueChange` informa uma nova escolha. As opções exigem somente `value` e
`label`, mas podem ser estendidas com outros campos e apresentadas por
`renderOption` e `renderTrigger`. O componente não navega nem muda estado por
conta própria.

## Desenvolvimento

```sh
pnpm lint
pnpm lint:fix
pnpm format
pnpm storybook
pnpm test
pnpm test:stories
pnpm build
pnpm build-storybook
pnpm pack:check
```

Husky executa `pnpm lint` e `pnpm test` antes de cada commit. As stories são
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
