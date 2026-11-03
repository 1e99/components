import {fireEvent, render, screen} from '@testing-library/react';
import {LuX} from 'react-icons/lu';
import {describe, expect, it, vi} from 'vitest';
import * as components from '../../index';
import {Button} from './button';

describe('Button', () => {
  it('exports a generic button with the shared control treatment', () => {
    const onClick = vi.fn();

    render(
        <Button aria-label="Fechar diálogo" onClick={onClick}>
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

  it('requires content from the consumer', () => {
    // @ts-expect-error the package must not choose default button content.
    const buttonWithoutContent = <Button />;

    expect(buttonWithoutContent).toBeDefined();
  });
});
