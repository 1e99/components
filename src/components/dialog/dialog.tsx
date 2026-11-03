import {type ReactNode, useEffect, useId, useRef} from 'react';
import {CloseButton} from '../close-button/close-button';

export type DialogProps = {
  ariaLabel?: string;
  children: ReactNode;
  closeLabel: string;
  onClose: () => void;
  open: boolean;
  title: ReactNode;
};

const dialogClassName =
  'fixed inset-0 m-auto max-h-5/6 w-11/12 max-w-lg overflow-y-auto rounded-control border border-border-subtle bg-surface-page p-0 text-content-primary shadow-float backdrop:bg-black/40';

export function Dialog({
  ariaLabel,
  children,
  closeLabel,
  onClose,
  open,
  title,
}: DialogProps) {
  const dialogReference = useRef<HTMLDialogElement>(null);
  const titleId = `dialog-title-${useId()}`;

  useEffect(() => {
    const dialog = dialogReference.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleNativeClose() {
    if (open) {
      onClose();
    }
  }

  return (
    <dialog
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel === undefined ? titleId : undefined}
      className={dialogClassName}
      onClose={handleNativeClose}
      ref={dialogReference}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-page p-5 sm:p-6">
        <h2 className="text-lg font-bold" id={titleId}>
          {title}
        </h2>
        <CloseButton label={closeLabel} onClick={onClose} />
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </dialog>
  );
}
