import type {ButtonHTMLAttributes} from 'react';
import {LuX} from 'react-icons/lu';

export type CloseButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children' | 'className' | 'type'
> & {
  label: string;
};

const closeButtonClassName =
  'flex size-11 shrink-0 items-center justify-center rounded-control hover:bg-surface-subtle';

export function CloseButton({label, ...buttonProps}: CloseButtonProps) {
  return (
    <button
      {...buttonProps}
      aria-label={label}
      className={closeButtonClassName}
      type="button"
    >
      <LuX aria-hidden="true" />
    </button>
  );
}
