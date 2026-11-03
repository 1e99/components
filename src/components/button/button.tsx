import type {ButtonHTMLAttributes, ReactNode} from 'react';

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className'
> & {
  children: ReactNode;
};

const buttonClassName =
  'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control hover:bg-surface-subtle';

export function Button({children, type = 'button', ...buttonProps}: ButtonProps) {
  return (
    <button {...buttonProps} className={buttonClassName} type={type}>
      {children}
    </button>
  );
}
