import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import type {NavbarProps} from './navbar';
import navbarMeta, {Curriculo, DomainWebsite} from './navbar.stories';

describe('Navbar stories', () => {
  it('renders the official horizontal logo in the domain reference', () => {
    const renderDomain = navbarMeta.render;
    const domainArgs: NavbarProps = {
      brand: <span>1e99</span>,
      items: [],
      navigationLabel: 'Navegação principal',
      ...DomainWebsite.args,
    };

    render(renderDomain?.(domainArgs) ?? null);

    expect(screen.getByRole('img', {name: '1e99'})).toHaveAttribute(
        'src',
        '/brand/1e99-logo-horizontal.svg',
    );
    const languageTriggers = screen
        .getAllByLabelText('Idioma')
        .filter((element) => element.tagName === 'SUMMARY');

    expect(languageTriggers).toHaveLength(2);
    const googleButtons = screen.getAllByRole('button', {name: 'Entrar com Google'});

    expect(googleButtons).toHaveLength(2);
    googleButtons.forEach((button) => expect(button).toHaveClass('bg-surface-raised', 'font-semibold'));

    for (const mark of screen.getAllByTestId('google-mark')) {
      expect(mark).toHaveAttribute('viewBox', '0 0 48 48');
      expect(mark.querySelectorAll('path')).toHaveLength(4);
    }
  });

  it('uses the shared locale and Google controls in the curriculum reference', () => {
    const renderCurriculum = Curriculo.render;
    const curriculumArgs: NavbarProps = {
      brand: <span>1e99</span>,
      items: [],
      navigationLabel: 'Página inicial do 1e99 Currículo',
      ...Curriculo.args,
    };

    render(
        renderCurriculum?.(
            curriculumArgs,
        {} as Parameters<NonNullable<typeof renderCurriculum>>[1],
        ) ?? null,
    );

    expect(screen.getByLabelText('Idioma: Português').tagName).toBe('SUMMARY');
    const appsIcon = screen.getByRole('link', {name: 'Mais aplicativos'}).querySelector('svg');
    const googleButton = screen.getByRole('button', {name: 'Entrar com Google'});

    expect(appsIcon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(appsIcon?.querySelectorAll('path')).toHaveLength(3);
    expect(googleButton.parentElement).toHaveClass('w-52', 'shrink-0');
    expect(googleButton).toHaveClass(
        'bg-surface-raised',
        'font-semibold',
    );
  });
});
