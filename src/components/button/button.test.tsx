import {fireEvent, render, screen} from '@testing-library/react';
import {LuX} from 'react-icons/lu';
import {describe, expect, it, vi} from 'vitest';
import * as components from '../../index';
import {Button} from './button';

describe('Button', () => {
  it('exports a generic button with the shared control treatment', () => {
    const onClick = vi.fn();

    render(
        <Button aria-label="Fechar diálogo" onClick={onClick} size="icon">
          <LuX aria-hidden="true" />
        </Button>,
    );

    const button = screen.getByRole('button', {name: 'Fechar diálogo'});
    const icon = button.querySelector('svg');

    expect(components).toHaveProperty('Button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass(
        'flex',
        'size-11',
        'shrink-0',
        'cursor-pointer',
        'items-center',
        'justify-center',
        'rounded-control',
        'hover:bg-surface-subtle',
    );
    expect(icon).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards native button behavior from the consumer', () => {
    render(
        <Button disabled type="submit">
          Salvar
        </Button>,
    );

    const button = screen.getByRole('button', {name: 'Salvar'});

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('uses the primary action treatment for text content', () => {
    render(<Button>Abrir planos</Button>);

    const button = screen.getByRole('button', {name: 'Abrir planos'});

    expect(button).toHaveClass(
        'inline-flex',
        'min-h-11',
        'cursor-pointer',
        'bg-action-primary',
        'px-4',
        'py-3',
        'text-content-inverse',
    );
    expect(button).not.toHaveClass('size-11');
  });

  it('offers secondary and outline text treatments without style overrides', () => {
    render(
        <>
          <Button variant="secondary">Ação secundária</Button>
          <Button variant="outline">Ação em outline</Button>
        </>,
    );

    expect(screen.getByRole('button', {name: 'Ação secundária'})).toHaveClass(
        'border',
        'border-border-subtle',
        'bg-surface-raised',
        'text-content-primary',
        'hover:bg-brand-cloud',
    );
    expect(screen.getByRole('button', {name: 'Ação em outline'})).toHaveClass(
        'border',
        'border-border-strong',
        'bg-transparent',
        'text-content-primary',
        'hover:bg-surface-subtle',
    );
  });

  it('uses a white surface for a secondary button when requested', () => {
    render(
        <Button variant="secondary" whiteSurface>
          Ação secundária em branco
        </Button>,
    );

    const button = screen.getByRole('button', {name: 'Ação secundária em branco'});

    expect(button).toHaveClass('bg-white');
    expect(button).not.toHaveClass('bg-surface-raised');
  });

  it('keeps the raised surface for a secondary button by default', () => {
    render(<Button variant="secondary">Ação secundária padrão</Button>);

    const button = screen.getByRole('button', {name: 'Ação secundária padrão'});

    expect(button).toHaveClass('bg-surface-raised');
    expect(button).not.toHaveClass('bg-white');
  });

  it('does not change non-secondary variants when whiteSurface is requested', () => {
    render(
        <Button whiteSurface>Ação primária</Button>,
    );

    const button = screen.getByRole('button', {name: 'Ação primária'});

    expect(button).toHaveClass('bg-action-primary');
    expect(button).not.toHaveClass('bg-white');
  });

  it('requires content from the consumer', () => {
    // @ts-expect-error the package must not choose default button content.
    const buttonWithoutContent = <Button />;

    expect(buttonWithoutContent).toBeDefined();
  });
});
