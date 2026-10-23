# @1e99/components

Componentes React compartilhados pelos produtos 1e99. O primeiro componente é
`Navbar`, extraído das implementações de `domain-website` e `curriculo` sem
introduzir dependência de Next.js, autenticação ou i18n.

## Instalação futura

Após a primeira publicação pública, instale o pacote no app consumidor:

```sh
pnpm add @1e99/components
```

O pacote declara `react`, `react-dom` e `tailwindcss` como peer dependencies.

### Tailwind CSS 4

O Tailwind 4 não lê automaticamente classes presentes em `node_modules`.
Adicione esta diretiva à folha CSS que já contém `@import "tailwindcss"`, com
o caminho relativo àquela folha:

```css
@source "../../node_modules/@1e99/components/dist";
```

Nos consumidores atuais, a alteração futura será em:

- `domain-website/src/app/globals.css`;
- `curriculo/src/app/brand.css`.

Os dois projetos já fornecem os tokens usados pela navbar, incluindo
`surface-page`, `content-primary`, `content-secondary`, `border-subtle`,
`action-primary`, `shadow-focus`, `ease-brand`, `shell`, `control` e `card`.
O pacote não redefine esses tokens nem importa CSS global no aplicativo.

## Uso

```tsx
import { Navbar } from "@1e99/components";

<Navbar
  brand={<a href="/"><BrandLogo /></a>}
  items={[
    { href: "/apps", label: "Apps" },
    { href: "/about", label: "Sobre" },
  ]}
  navigationLabel="Navegação principal"
  renderLink={({ href, children, className }) => (
    <Link className={className} href={href}>{children}</Link>
  )}
  actions={<AccountActions />}
  width="content"
  linkTreatment="underlined"
  mobileNavigation="disclosure"
  menuLabel="Abrir menu de navegação"
  mobileNavigationLabel="Navegação principal móvel"
  mobileActions={<MobileAccountActions />}
/>
```

| Prop | Opções | Uso nos projetos existentes |
| --- | --- | --- |
| `width` | `content` (padrão), `wide` | domain-website / curriculo |
| `linkTreatment` | `plain` (padrão), `underlined` | curriculo / domain-website |
| `mobileNavigation` | `hidden` (padrão), `disclosure` | curriculo / domain-website |

`brand`, `actions` e `mobileActions` são slots. `renderLink` recebe `href`,
`children` e `className`, permitindo usar `next/link`, `next-intl/link` ou
outro roteador sem acoplar o pacote a ele.

## Desenvolvimento e testes

```sh
pnpm storybook
pnpm test
pnpm test:stories
pnpm build
pnpm build-storybook
pnpm pack:check
```

`pnpm test` roda testes de contrato em Vitest + Testing Library. As stories
exibem os perfis dos dois aplicativos e são verificadas em Chromium por
`pnpm test:stories`, com os addons oficiais de acessibilidade e Vitest.

Em uma máquina Linux nova, instale as dependências do Chromium uma vez antes
do teste de stories:

```sh
pnpm exec playwright install chromium
sudo pnpm exec playwright install-deps chromium
```

## Publicação

O destino recomendado é o npm público, como `@1e99/components`: ele evita
configuração de registry e token em cada consumidor. GitHub Packages é uma
alternativa para distribuição privada, mas exige registry e token GitHub nos
aplicativos.

Antes do primeiro release, um administrador da organização `1e99` no npm deve
confirmar a política de licença (o pacote está `UNLICENSED` por enquanto),
criar ou habilitar o escopo, autenticar-se e publicar:

```sh
pnpm pack:check
npm publish --access public
```

O comando de publicação não faz parte deste repositório nem foi executado por
esta implementação.
