import {fireEvent, render, screen, within} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {NavbarPlayground, type NavbarPlaygroundArgs} from './navbar.stories';

const defaultArgs: NavbarPlaygroundArgs = {
  googleSignInLabel: 'Entrar com Google',
  items: [
    {href: '/#products', label: 'Produtos'},
    {href: '/about', label: 'Sobre'},
  ],
  mobileMenuLabel: 'Abrir menu de navegação',
  mobileNavigationLabel: 'Navegação principal móvel',
  navigationLabel: 'Navegação principal',
  selectorLabel: 'Idioma',
  selectorOptions: [
    {label: 'Português', value: 'pt'},
    {label: 'English', value: 'en'},
  ],
  showGoogleSignIn: true,
  showMobileNavigation: true,
  showSelector: true,
};

function getSelectorTriggers(label: string) {
  return screen
      .getAllByLabelText(label)
      .filter((element) => element.tagName === 'BUTTON');
}

describe('Navbar stories', () => {
  it('keeps the official horizontal logo fixed in the playground', () => {
    render(<NavbarPlayground {...defaultArgs} />);

    expect(screen.getByRole('img', {name: '1e99'})).toHaveAttribute(
        'src',
        '/brand/1e99-logo-horizontal.svg',
    );
  });

  it('removes selector and Google controls from desktop and mobile actions', () => {
    render(
        <NavbarPlayground
          {...defaultArgs}
          showGoogleSignIn={false}
          showSelector={false}
        />,
    );

    expect(screen.queryByRole('button', {name: 'Entrar com Google'})).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Idioma')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Abrir menu de navegação'));

    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Navegação principal móvel',
    });

    expect(within(mobileNavigation).queryByRole(
        'button',
        {name: 'Entrar com Google'},
    )).not.toBeInTheDocument();
    expect(within(mobileNavigation).queryByLabelText('Idioma')).not.toBeInTheDocument();
  });

  it('builds desktop and mobile actions from custom labels and items', () => {
    render(
        <NavbarPlayground
          {...defaultArgs}
          googleSignInLabel="Continuar com Google"
          items={[{href: '/biblioteca', label: 'Biblioteca'}]}
          mobileNavigationLabel="Navegação personalizada móvel"
          selectorLabel="Escolher idioma"
          selectorOptions={[
            {label: 'Français', value: 'fr'},
            {label: 'Deutsch', value: 'de'},
          ]}
        />,
    );

    expect(screen.getAllByRole('link', {name: 'Biblioteca'})).toHaveLength(2);
    expect(getSelectorTriggers('Escolher idioma: Français')).toHaveLength(2);
    expect(screen.getAllByRole('button', {name: 'Continuar com Google'})).toHaveLength(2);

    fireEvent.click(screen.getByLabelText('Abrir menu de navegação'));

    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Navegação personalizada móvel',
    });

    expect(within(mobileNavigation).getByRole(
        'link',
        {name: 'Biblioteca'},
    )).toBeVisible();
    const mobileSelector = within(mobileNavigation)
        .getAllByLabelText('Escolher idioma: Français')
        .find((element) => element.tagName === 'BUTTON');

    expect(mobileSelector).toBeVisible();
    expect(within(mobileNavigation).getByRole(
        'button',
        {name: 'Continuar com Google'},
    )).toBeVisible();
  });
});
