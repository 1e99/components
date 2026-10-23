import type {Meta, StoryObj} from '@storybook/react-vite';
import {GoogleSignInButton} from '../google-sign-in-button/google-sign-in-button';
import {LocaleSelector, type LocaleSelectorDensity} from '../locale-selector/locale-selector';
import {Navbar, type NavbarProps} from './navbar';

function BrandLogoPreview() {
  return (
    <a
      aria-label="Página inicial 1e99"
      className="shrink-0 rounded-control focus-visible:outline-none focus-visible:shadow-focus"
      href="/"
    >
      <img
        alt="1e99"
        className="h-auto w-32 sm:w-40"
        height="430"
        src="/brand/1e99-logo-horizontal.svg"
        width="1150"
      />
    </a>
  );
}

const localeOptions = [
  {href: '/pt', label: 'Português', languageTag: 'pt-BR', value: 'pt'},
  {href: '/en', label: 'English', languageTag: 'en', value: 'en'},
  {href: '/es', label: 'Español', languageTag: 'es', value: 'es'},
] as const;

function LocalePreview({
  density = 'standard',
  triggerAriaLabel = 'Idioma',
}: {
  density?: LocaleSelectorDensity;
  triggerAriaLabel?: string;
}) {
  return (
    <LocaleSelector
      density={density}
      label="Idioma"
      options={localeOptions}
      triggerAriaLabel={triggerAriaLabel}
      value="pt"
      variant="navigation"
    />
  );
}

function DomainActions() {
  return (
    <div className="hidden items-center gap-3 md:flex">
      <LocalePreview />
      <GoogleSignInButton label="Entrar com Google" />
    </div>
  );
}

function CurriculumActions() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <LocalePreview density="compact-mobile" triggerAriaLabel="Idioma: Português" />
      <a
        aria-label="Mais aplicativos"
        className="hidden min-h-11 items-center justify-center gap-2 rounded-control px-2 text-label font-bold text-content-secondary transition-colors hover:bg-surface-subtle hover:text-content-primary sm:inline-flex sm:px-3"
        href="/apps"
      >
        <span>Mais apps</span>
        <svg
          aria-hidden="true"
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M14 3h7v7M10 14 21 3M21 14v7h-7M3 10V3h7M3 14v7h7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </a>
      <div className="w-52 shrink-0">
        <GoogleSignInButton label="Entrar com Google" />
      </div>
    </div>
  );
}

function renderDomain(args: NavbarProps) {
  return (
    <Navbar
      {...args}
      actions={<DomainActions />}
      brand={<BrandLogoPreview />}
      mobileNavigation={{
        actions: (
          <>
            <LocalePreview />
            <GoogleSignInButton label="Entrar com Google" />
          </>
        ),
        menuLabel: 'Abrir menu de navegação',
        navigationLabel: 'Navegação principal móvel',
      }}
    />
  );
}

function renderCurriculum(args: NavbarProps) {
  return (
    <Navbar
      {...args}
      actions={<CurriculumActions />}
      brand={<BrandLogoPreview />}
    />
  );
}

const meta = {
  title: 'Navigation/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    brand: <BrandLogoPreview />,
    items: [],
    navigationLabel: 'Navegação principal',
  },
  argTypes: {
    actions: {control: false},
    brand: {control: false},
    mobileNavigation: {control: false},
    renderLink: {control: false},
  },
  render: renderDomain,
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DomainWebsite: Story = {
  args: {
    items: [
      {href: '/#aplicativos', label: 'Aplicativos'},
      {href: '/sobre', label: 'Sobre a 1e99'},
    ],
    layer: 'above',
    linkTreatment: 'underlined',
    linkWeight: 'semibold',
    navigationLabel: 'Navegação principal',
    width: 'content',
  },
};

export const Curriculo: Story = {
  args: {
    items: [
      {href: '#modelos', label: 'Modelos'},
      {href: '#planos', label: 'Preço'},
      {href: '#duvidas', label: 'Dúvidas'},
    ],
    layer: 'standard',
    linkTreatment: 'plain',
    linkWeight: 'bold',
    navigationLabel: 'Página inicial do 1e99 Currículo',
    width: 'wide',
  },
  render: renderCurriculum,
};
