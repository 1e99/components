import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {GoogleSignInButton} from '../google-sign-in-button/google-sign-in-button';
import {Selector, type SelectorOption} from '../selector/selector';
import {Navbar, type NavbarProps} from './navbar';

type NavbarStoryItem = {
  href: string;
  label: string;
};

type NavbarSelectorOption = SelectorOption & {
  label: string;
};

export type NavbarPlaygroundArgs = Omit<
  NavbarProps,
  'actions' | 'brand' | 'items' | 'mobileNavigation'
> & {
  googleSignInLabel: string;
  items: readonly NavbarStoryItem[];
  mobileMenuLabel: string;
  mobileNavigationLabel: string;
  selectorLabel: string;
  selectorOptions: readonly NavbarSelectorOption[];
  showGoogleSignIn: boolean;
  showMobileNavigation: boolean;
  showSelector: boolean;
};

const defaultSelectorOptions = [
  {label: 'Português', value: 'pt'},
  {label: 'English', value: 'en'},
  {label: 'Español', value: 'es'},
] as const;

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

function NavbarControls({
  googleSignInLabel,
  onValueChange,
  selectorLabel,
  selectorOptions,
  showGoogleSignIn,
  showSelector,
  value,
}: {
  googleSignInLabel: string;
  onValueChange: (value: string) => void;
  selectorLabel: string;
  selectorOptions: readonly NavbarSelectorOption[];
  showGoogleSignIn: boolean;
  showSelector: boolean;
  value: string;
}) {
  const selectedOption = selectorOptions.find(
      (option) => option.value === value,
  );
  const triggerAriaLabel = selectedOption ?
    `${selectorLabel}: ${selectedOption.label}` : selectorLabel;

  return (
    <>
      {showSelector ? (
        <Selector
          label={selectorLabel}
          onValueChange={onValueChange}
          options={selectorOptions}
          triggerAriaLabel={triggerAriaLabel}
          value={value}
        />
      ) : null}
      {showGoogleSignIn ? (
        <GoogleSignInButton label={googleSignInLabel} />
      ) : null}
    </>
  );
}

export function NavbarPlayground({
  googleSignInLabel,
  items,
  mobileMenuLabel,
  mobileNavigationLabel,
  selectorLabel,
  selectorOptions,
  showGoogleSignIn,
  showMobileNavigation,
  showSelector,
  ...navbarProps
}: NavbarPlaygroundArgs) {
  const [selectedValue, setSelectedValue] = useState('');
  const selectorValueIsAvailable = selectorOptions.some(
      (option) => option.value === selectedValue,
  );
  const value = selectorValueIsAvailable ?
    selectedValue : selectorOptions[0]?.value ?? '';
  const hasSelector = showSelector && selectorOptions.length > 0;
  const hasActions = hasSelector || showGoogleSignIn;

  const controls = (
    <NavbarControls
      googleSignInLabel={googleSignInLabel}
      onValueChange={setSelectedValue}
      selectorLabel={selectorLabel}
      selectorOptions={selectorOptions}
      showGoogleSignIn={showGoogleSignIn}
      showSelector={hasSelector}
      value={value}
    />
  );

  return (
    <Navbar
      {...navbarProps}
      actions={hasActions ? (
        <div className="hidden items-center gap-3 md:flex">{controls}</div>
      ) : undefined}
      brand={<BrandLogoPreview />}
      items={items}
      mobileNavigation={showMobileNavigation ? {
        actions: hasActions ? controls : undefined,
        menuLabel: mobileMenuLabel,
        navigationLabel: mobileNavigationLabel,
      } : undefined}
    />
  );
}

const meta = {
  title: 'Navigation/Navbar',
  component: NavbarPlayground,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    googleSignInLabel: 'Entrar com Google',
    items: [],
    mobileMenuLabel: 'Abrir menu de navegação',
    mobileNavigationLabel: 'Navegação principal móvel',
    navigationLabel: 'Navegação principal',
    selectorLabel: 'Idioma',
    selectorOptions: defaultSelectorOptions,
    showGoogleSignIn: true,
    showMobileNavigation: true,
    showSelector: true,
  },
  argTypes: {
    items: {control: 'object'},
    selectorOptions: {control: 'object'},
  },
  render: (args) => <NavbarPlayground {...args} />,
} satisfies Meta<NavbarPlaygroundArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ElevatedNavigation: Story = {
  args: {
    items: [
      {href: '/#products', label: 'Produtos'},
      {href: '/about', label: 'Sobre'},
    ],
    layer: 'above',
    linkTreatment: 'underlined',
    linkWeight: 'semibold',
    width: 'content',
  },
};

export const WideNavigation: Story = {
  args: {
    items: [
      {href: '#modelos', label: 'Modelos'},
      {href: '#planos', label: 'Preço'},
      {href: '#duvidas', label: 'Dúvidas'},
    ],
    linkTreatment: 'plain',
    linkWeight: 'bold',
    navigationLabel: 'Navegação de página',
    width: 'wide',
  },
};
