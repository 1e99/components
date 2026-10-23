# @1e99/components

Componentes React compartilhados pelos produtos 1e99. `Navbar`,
`GoogleSignInButton` e `Selector` foram extraídos fielmente de
`domain-website` e `curriculo`, sem introduzir dependência de Next.js,
autenticação, i18n ou geração de PDF.

## Instalação futura

Após a primeira publicação pública, instale o pacote no app consumidor:

```sh
pnpm add @1e99/components
```

O pacote declara `react`, `react-dom`, `react-icons` e `tailwindcss` como
peer dependencies. Os apps 1e99 já usam `react-icons` 5.7.0; ele fornece os
ícones Google e Lucide que o pacote renderiza, sem duplicar SVGs manualmente.

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
`action-primary`, `surface-raised`, `content-inverse`, `shadow-card`,
`shadow-float`, `shadow-focus`, `ease-brand`, `shell`, `control` e `card`.
O pacote não redefine esses tokens nem importa CSS global no aplicativo.

## Uso

```tsx
import {useState} from "react";
import {
  GoogleSignInButton,
  Navbar,
  Selector,
} from "@1e99/components";

type LocaleOption = {
  label: string;
  languageTag: string;
  value: string;
};

const localeOptions = [
  { value: "pt", label: "Português", languageTag: "pt-BR" },
  { value: "en", label: "English", languageTag: "en" },
  { value: "es", label: "Español", languageTag: "es" },
] satisfies readonly LocaleOption[];

function Header() {
  const [locale, setLocale] = useState("pt");

  return (
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
      actions={
        <div className="hidden items-center gap-3 md:flex">
          <Selector
            label={t("language")}
            onValueChange={setLocale}
            options={localeOptions}
            renderOption={({ option }) => (
              <span lang={option.languageTag}>{option.label}</span>
            )}
            renderTrigger={({ selectedOption, value }) => (
              <span lang={selectedOption?.languageTag}>
                {selectedOption?.label ?? value}
              </span>
            )}
            value={locale}
          />
          <GoogleSignInButton
            label={t("signInWithGoogle")}
            onClick={startGoogleLogin}
          />
        </div>
      }
      width="content"
      layer="above"
      linkTreatment="underlined"
      linkWeight="semibold"
      mobileNavigation={{
        menuLabel: t("openNavigation"),
        navigationLabel: t("mobileNavigation"),
        actions: <MobileAccountActions />,
      }}
    />
  );
}
```

| Prop | Opções | Uso nos projetos existentes |
| --- | --- | --- |
| `width` | `content` (padrão), `wide` | domain-website / curriculo |
| `layer` | `standard` (padrão), `above` | curriculo / domain-website |
| `linkTreatment` | `plain` (padrão), `underlined` | curriculo / domain-website |
| `linkWeight` | `semibold` (padrão), `bold` | domain-website / curriculo |
| `mobileNavigation` | ausente ou objeto de disclosure | curriculo / domain-website |

`brand` e `actions` são slots e, junto da navegação desktop, permanecem como
regiões irmãs no container — o mesmo layout dos dois headers fonte. O objeto
`mobileNavigation` reproduz o menu do domain (botão azul de 48px e painel
elevado); ele fica ausente no perfil do currículo. `renderLink` recebe `href`,
`children` e `className`, permitindo usar `next/link`, `next-intl/link` ou
outro roteador sem acoplar o pacote a ele.

### Controles de header

`GoogleSignInButton` é o único tratamento visual para entrar com Google e
segue o botão do `domain-website` em todos os usos. `label` é obrigatório e
deve receber a string já traduzida pelo consumidor; também aceita atributos
comportamentais nativos de botão (`onClick`, `disabled`, `aria-*`). Não aceita
variante nem `className`; autenticação e estado de carregamento são do
consumidor.

`Selector` é um disclosure genérico para uma coleção controlada. Cada opção
tem apenas `value` estável e `label` como contrato-base; o consumidor pode
acrescentar campos ao tipar sua própria coleção, como `languageTag`, descrição
ou ícone. `value` e `onValueChange` são controlados pelo consumidor: ao clicar
em uma opção, o componente informa o novo valor e fecha o disclosure, mas não
navega nem atualiza estado por conta própria.

`renderOption` recebe `option`, `isSelected` e `select`; ele renderiza somente
o conteúdo interno do botão que o pacote controla. `renderTrigger` recebe
`selectedOption` e `value` para personalizar o conteúdo do gatilho. Dessa
forma, atributos como `lang` ficam no conteúdo do aplicativo consumidor, não
no tipo genérico do pacote. O componente preserva botões com `aria-pressed`,
`select-none`, as densidades `standard` (padrão), `compact` e
`compact-mobile` e `whiteSurface`. Sem `triggerAriaLabel`, o nome acessível do
gatilho vem do conteúdo selecionado visível; use essa prop quando o consumidor
precisar de um nome mais descritivo e atualize-o junto do valor controlado.

`Navbar` não recebe props de idioma nem de autenticação. `items`, `actions` e
`mobileNavigation.actions` são os pontos de composição para qualquer controle
ou CTA do produto. No Storybook, `Navigation/Navbar` inclui o playground de
referência com o logo oficial fixo; seus args serializáveis controlam itens,
seletor, botão Google e menu móvel. O seletor e o botão também possuem stories
próprias em `Controls/Selector` e `Controls/GoogleSignInButton`.

## Desenvolvimento e testes

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

`pnpm lint` aplica o padrão Google para TypeScript e React; `pnpm lint:fix`
corrige automaticamente o que for seguro, e `pnpm format` é seu atalho. O
Husky executa `pnpm lint` e `pnpm test` antes de cada commit local, portanto
ambos devem passar antes de o histórico ser criado.

`pnpm test` roda testes de contrato em Vitest + Testing Library. As stories
exibem o playground configurável da navbar, o seletor genérico e o botão
Google, incluindo o SVG oficial somente como asset de demonstração do
Storybook. Elas são verificadas em Chromium por `pnpm test:stories`, com os
addons oficiais de acessibilidade e Vitest.

Em uma máquina Linux nova, instale as dependências do Chromium uma vez antes
do teste de stories:

```sh
pnpm exec playwright install chromium
sudo pnpm exec playwright install-deps chromium
```

## Organização do código

Cada componente é uma unidade em `src/components/<nome>/`: implementação,
testes e story (quando houver) ficam juntos. `src/index.ts` é o único ponto de
entrada público; mudar a organização interna não altera como os aplicativos
importam `@1e99/components`. Testes transversais ficam em `test/`.

## Publicação

O destino recomendado é o npm público, como `@1e99/components`: ele evita
configuração de registry e token em cada consumidor. GitHub Packages é uma
alternativa para distribuição privada, mas exige registry e token GitHub nos
aplicativos.

`.github/workflows/ci.yml` valida pull requests e pushes para `main` com lint,
tipos, testes, build, Storybook e prévia do tarball. `.github/workflows/publish.yml`
repete essas verificações e publica somente quando uma tag `vX.Y.Z` corresponde
exatamente à versão em `package.json` e aponta para um commit ancestral de
`main`. Os actions usados nos workflows estão fixados em commits revisáveis.

### Trusted Publishing

O pacote usa Trusted Publishing do npm com OIDC. Em **Trusted Publisher** do
`@1e99/components`, a configuração precisa apontar para GitHub Actions, com
organização `1e99`, repositório `components` e arquivo `publish.yml`. O job de
publicação recebe `id-token: write` e não lê token npm algum; o npm troca a
identidade efêmera do GitHub Actions pela autorização de publicação.

Depois da próxima publicação OIDC bem-sucedida, apague o secret `NPM_TOKEN` do
GitHub e revogue o token granular usado somente no bootstrap de `0.1.0`. Nunca
grave ou compartilhe tokens em chat, issues, commits ou logs. Para uma próxima
versão, atualize a versão e envie a tag criada pelo gerenciador:

```sh
pnpm version patch
git push origin main --follow-tags
```

O workflow recusa a tag se ela não corresponder exatamente à versão em
`package.json` ou se o commit não fizer parte de `main`; ele publica com
`publishConfig.access: public` se todas as verificações passarem. Configure
também regras do GitHub para exigir o CI antes de merge em `main` e restringir
a criação e atualização de tags `v*` a mantenedores autorizados.
