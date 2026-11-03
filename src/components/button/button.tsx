import type {ButtonHTMLAttributes, ReactNode} from 'react';

export type ButtonSize = 'default' | 'icon';

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className'
> & {
  children: ReactNode;
  size?: ButtonSize;
};

const buttonClassNames: Record<ButtonSize, string> = {
  default:
    'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control bg-action-primary px-4 py-3 text-label font-semibold text-content-inverse',
  icon:
    'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control hover:bg-surface-subtle',
};

export function Button({
  children,
  size = 'default',
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button {...buttonProps} className={buttonClassNames[size]} type={type}>
      {children}
    </button>
  );
}
