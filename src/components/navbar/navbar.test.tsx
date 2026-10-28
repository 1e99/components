import {describe, expect, it} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import * as components from '../../index';
import {Navbar} from '../../index';

describe('Navbar', () => {
  it('exports the shared navigation component', () => {
    expect(components).toHaveProperty('Navbar');
  });

  it('renders the brand and desktop navigation with default anchors', () => {
    render(
        <Navbar
          brand={<a href="/">1e99</a>}
          items={[
            {href: '/apps', label: 'Apps'},
            {href: '/about', label: 'About'},
          ]}
          navigationLabel="Primary navigation"
        />,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: '1e99'})).toHaveAttribute('href', '/');

    const navigation = screen.getByRole('navigation', {
      name: 'Primary navigation',
    });
    expect(within(navigation).getByRole('link', {name: 'Apps'})).toHaveAttribute(
        'href',
        '/apps',
    );
    expect(within(navigation).getByRole('link', {name: 'About'})).toHaveAttribute(
        'href',
        '/about',
    );
  });

  it('accepts a router-aware link renderer and an actions slot', () => {
    render(
        <Navbar
          actions={<button type="button">Sign in</button>}
          brand={<a href="/">1e99</a>}
          items={[{href: '/apps', label: 'Apps'}]}
          navigationLabel="Primary navigation"
          renderLink={({children, href, className}) => (
            <a className={className} data-router-link="true" href={`/en${href}`}>
              {children}
            </a>
          )}
        />,
    );

    expect(screen.getByRole('link', {name: 'Apps'})).toHaveAttribute(
        'href',
        '/en/apps',
    );
    expect(screen.getByRole('link', {name: 'Apps'})).toHaveAttribute(
        'data-router-link',
        'true',
    );
    expect(screen.getByRole('button', {name: 'Sign in'})).toBeInTheDocument();
  });

  it('keeps the brand, desktop navigation, and actions as sibling regions', () => {
    render(
        <Navbar
          actions={<div data-testid="navbar-actions">Actions</div>}
          brand={<a href="/">1e99</a>}
          items={[{href: '/apps', label: 'Apps'}]}
          navigationLabel="Primary navigation"
        />,
    );

    const container = screen.getByRole('banner').firstElementChild;
    expect(container?.children).toHaveLength(3);
    expect(container?.children[0]).toContainElement(
        screen.getByRole('link', {name: '1e99'}),
    );
    expect(container?.children[1]).toBe(
        screen.getByRole('navigation', {name: 'Primary navigation'}),
    );
    expect(container?.children[2]).toContainElement(screen.getByTestId('navbar-actions'));
  });

  it('matches the domain and curriculum desktop style variants', () => {
    const {rerender} = render(
        <Navbar
          brand={<a href="/">1e99</a>}
          items={[{href: '/apps', label: 'Apps'}]}
          layer="above"
          linkTreatment="underlined"
          linkWeight="semibold"
          navigationLabel="Primary navigation"
        />,
    );

    expect(screen.getByRole('banner')).toHaveClass('z-50');
    expect(screen.getByRole('link', {name: 'Apps'})).toHaveClass(
        'font-semibold',
        'after:h-0.5',
        'after:bg-action-primary',
    );

    rerender(
        <Navbar
          brand={<a href="/">1e99</a>}
          items={[{href: '#models', label: 'Models'}]}
          layer="standard"
          linkTreatment="plain"
          linkWeight="bold"
          navigationLabel="Primary navigation"
        />,
    );

    expect(screen.getByRole('banner')).toHaveClass('z-40');
    expect(screen.getByRole('link', {name: 'Models'})).toHaveClass('font-bold');
    expect(screen.getByRole('link', {name: 'Models'})).not.toHaveClass(
        'after:scale-x-0',
    );
  });

  it('matches the domain mobile menu trigger, panel, links, and actions', () => {
    render(
        <Navbar
          brand={<a href="/">1e99</a>}
          items={[{href: '/apps', label: 'Apps'}]}
          mobileNavigation={{
            actions: <button type="button">Mobile sign in</button>,
            menuLabel: 'Open navigation menu',
            navigationLabel: 'Mobile primary navigation',
          }}
          navigationLabel="Primary navigation"
        />,
    );

    const menuTrigger = screen.getByLabelText('Open navigation menu');
    const menuIcon = menuTrigger.querySelector('svg');

    expect(menuIcon?.querySelectorAll('line')).toHaveLength(3);
    expect(menuIcon).toHaveAttribute('stroke-linejoin', 'round');
    expect(menuTrigger.parentElement).toHaveClass('relative', 'md:hidden');
    expect(menuTrigger).toHaveClass(
        'size-12',
        'bg-action-primary',
        'text-content-inverse',
        'shadow-card',
        'transition-[translate,scale,background-color]',
        'active:scale-[0.97]',
    );

    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Mobile primary navigation',
    });
    expect(mobileNavigation).toHaveClass(
        'fixed',
        'top-[4.5rem]',
        'right-[1.25rem]',
        'w-72',
        'bg-surface-raised',
        'shadow-float',
        '[position-anchor:--navbar-mobile-menu-trigger]',
        '[@supports(position-anchor:--navbar-mobile-menu-trigger)]:absolute',
        '[@supports(position-anchor:--navbar-mobile-menu-trigger)]:left-[anchor(right)]',
    );
    expect(within(mobileNavigation).getByRole('link', {name: 'Apps'})).toHaveAttribute(
        'href',
        '/apps',
    );
    expect(within(mobileNavigation).getByRole('link', {name: 'Apps'})).toHaveClass(
        'min-h-12',
        'px-3',
        'font-semibold',
    );
    expect(screen.getByRole('button', {name: 'Mobile sign in'})).toBeInTheDocument();
  });

  it('wires the mobile menu to an auto popover', () => {
    render(
        <Navbar
          brand={<a href="/">1e99</a>}
          items={[{href: '/apps', label: 'Apps'}]}
          mobileNavigation={{
            menuLabel: 'Open navigation menu',
            navigationLabel: 'Mobile primary navigation',
          }}
          navigationLabel="Primary navigation"
        />,
    );

    const menuTrigger = screen.getByLabelText('Open navigation menu');
    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Mobile primary navigation',
    });
    const targetId = menuTrigger.getAttribute('popovertarget');

    expect(menuTrigger).toHaveAttribute('popovertargetaction', 'toggle');
    expect(targetId).toBeTruthy();
    expect(mobileNavigation).toHaveAttribute('id', targetId);
    expect(mobileNavigation).toHaveAttribute('popover', 'auto');
    expect(menuTrigger.closest('details')).not.toBeInTheDocument();
  });

  it('gives each mobile menu an independent popover target', () => {
    render(
        <>
          <Navbar
            brand={<a href="/">First</a>}
            items={[{href: '/first', label: 'First item'}]}
            mobileNavigation={{
              menuLabel: 'Open first navigation menu',
              navigationLabel: 'First mobile navigation',
            }}
            navigationLabel="First navigation"
          />
          <Navbar
            brand={<a href="/">Second</a>}
            items={[{href: '/second', label: 'Second item'}]}
            mobileNavigation={{
              menuLabel: 'Open second navigation menu',
              navigationLabel: 'Second mobile navigation',
            }}
            navigationLabel="Second navigation"
          />
        </>,
    );

    const firstTrigger = screen.getByLabelText('Open first navigation menu');
    const secondTrigger = screen.getByLabelText('Open second navigation menu');
    const firstNavigation = screen.getByRole('navigation', {
      name: 'First mobile navigation',
    });
    const secondNavigation = screen.getByRole('navigation', {
      name: 'Second mobile navigation',
    });

    expect(firstTrigger).toHaveAttribute(
        'popovertarget',
        firstNavigation.getAttribute('id'),
    );
    expect(secondTrigger).toHaveAttribute(
        'popovertarget',
        secondNavigation.getAttribute('id'),
    );
    expect(firstNavigation.id).not.toBe(secondNavigation.id);
  });

  it('applies the wide and underlined variants without rendering mobile navigation by default', () => {
    render(
        <Navbar
          brand={<a href="/">1e99</a>}
          items={[{href: '/apps', label: 'Apps'}]}
          linkTreatment="underlined"
          navigationLabel="Primary navigation"
          width="wide"
        />,
    );

    expect(screen.getByRole('banner').firstElementChild).toHaveClass('max-w-7xl');
    expect(screen.getByRole('link', {name: 'Apps'})).toHaveClass('after:scale-x-0');
    expect(screen.queryByRole('button', {name: 'Open navigation menu'})).not.toBeInTheDocument();
  });
});
