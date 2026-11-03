import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import * as components from '../../index';
import {CloseButton} from './close-button';

describe('CloseButton', () => {
  it('exports a labeled button with the shared close treatment', () => {
    const onClick = vi.fn();

    render(<CloseButton label="Fechar diálogo" onClick={onClick} />);

    const button = screen.getByRole('button', {name: 'Fechar diálogo'});
    const icon = button.querySelector('svg');

    expect(components).toHaveProperty('CloseButton');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass(
        'flex',
        'size-11',
        'shrink-0',
        'items-center',
        'justify-center',
        'rounded-control',
        'hover:bg-surface-subtle',
    );
    expect(icon).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards disabled behavior from the consumer', () => {
    render(<CloseButton disabled label="Close dialog" />);

    expect(screen.getByRole('button', {name: 'Close dialog'})).toBeDisabled();
  });

  it('requires a localized accessible label', () => {
    // @ts-expect-error the package must not choose a default language.
    const buttonWithoutLabel = <CloseButton />;

    expect(buttonWithoutLabel).toBeDefined();
  });
});
