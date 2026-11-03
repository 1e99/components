import {fireEvent, render, screen} from '@testing-library/react';
import {StrictMode, useState} from 'react';
import {describe, expect, it, vi} from 'vitest';
import * as components from '../../index';
import {Dialog} from './dialog';

function installDialogMethods() {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true;
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    },
  });
}

installDialogMethods();

describe('Dialog', () => {
  it('opens as a labeled native modal and reports native close events', () => {
    const onClose = vi.fn();

    render(
        <Dialog closeLabel="Fechar planos" onClose={onClose} open title="Planos">
          Conteúdo do diálogo
        </Dialog>,
    );

    const dialog = screen.getByRole('dialog', {name: 'Planos'});

    expect(components).toHaveProperty('Dialog');
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveClass(
        'fixed',
        'max-h-5/6',
        'max-w-lg',
        'rounded-control',
        'bg-surface-page',
        'shadow-float',
        'backdrop:bg-black/40',
    );
    expect(screen.getByRole('heading', {name: 'Planos'})).toHaveAttribute(
        'id',
        dialog.getAttribute('aria-labelledby'),
    );

    fireEvent(dialog, new Event('close'));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('leaves open state to the consumer when the close button is clicked', () => {
    function ControlledDialog() {
      const [open, setOpen] = useState(true);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Abrir planos
          </button>
          <Dialog
            closeLabel="Fechar planos"
            onClose={() => setOpen(false)}
            open={open}
            title="Planos"
          >
            Conteúdo do diálogo
          </Dialog>
        </>
      );
    }

    render(<ControlledDialog />);

    const dialog = screen.getByRole('dialog', {name: 'Planos'});
    fireEvent.click(screen.getByRole('button', {name: 'Fechar planos'}));

    expect(dialog).not.toHaveAttribute('open');

    fireEvent.click(screen.getByRole('button', {name: 'Abrir planos'}));

    expect(dialog).toHaveAttribute('open');
  });

  it('keeps its title and close control fixed while content scrolls', () => {
    render(
        <Dialog closeLabel="Fechar planos" onClose={() => undefined} open title="Planos">
          Conteúdo do diálogo
        </Dialog>,
    );

    const dialog = screen.getByRole('dialog', {name: 'Planos'});
    const heading = screen.getByRole('heading', {name: 'Planos'});
    const header = heading.parentElement;

    expect(dialog).toHaveClass('overflow-y-auto', 'p-0');
    expect(header).toHaveClass('sticky', 'top-0', 'z-10', 'bg-surface-page');
    expect(header).toContainElement(screen.getByRole('button', {name: 'Fechar planos'}));
  });

  it('uses optional ariaLabel instead of the visible title when provided', () => {
    render(
        <Dialog
          ariaLabel="Escolha uma forma de pagamento"
          closeLabel="Fechar pagamento"
          onClose={() => undefined}
          open
          title="Pagamento"
        >
          Escolha o método de pagamento.
        </Dialog>,
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Escolha uma forma de pagamento',
    });

    expect(dialog).toHaveAttribute('aria-label', 'Escolha uma forma de pagamento');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('gives simultaneously rendered dialogs independent title IDs', () => {
    render(
        <>
          <Dialog closeLabel="Fechar primeiro" onClose={() => undefined} open title="Primeiro">
            Primeiro conteúdo
          </Dialog>
          <Dialog closeLabel="Fechar segundo" onClose={() => undefined} open title="Segundo">
            Segundo conteúdo
          </Dialog>
        </>,
    );

    const first = screen.getByRole('dialog', {name: 'Primeiro'});
    const second = screen.getByRole('dialog', {name: 'Segundo'});

    expect(first.getAttribute('aria-labelledby')).toBeTruthy();
    expect(second.getAttribute('aria-labelledby')).toBeTruthy();
    expect(first.getAttribute('aria-labelledby')).not.toBe(
        second.getAttribute('aria-labelledby'),
    );
  });

  it('does not call showModal twice during Strict Mode effects', () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');

    render(
        <StrictMode>
          <Dialog closeLabel="Fechar planos" onClose={() => undefined} open title="Planos">
            Conteúdo do diálogo
          </Dialog>
        </StrictMode>,
    );

    expect(showModal).toHaveBeenCalledOnce();

    showModal.mockRestore();
  });

  it('requires the consumer to localize the title and close label', () => {
    // @ts-expect-error the package must not choose a default title or label.
    const dialogWithoutCopy = <Dialog onClose={() => undefined} open />;

    expect(dialogWithoutCopy).toBeDefined();
  });
});
