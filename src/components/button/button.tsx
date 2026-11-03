import type {ButtonHTMLAttributes, ReactNode} from 'react';

export type ButtonSize = 'default' | 'icon';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className'
> & {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const buttonSizeClassNames: Record<ButtonSize, string> = {
  default:
    'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control px-4 py-3 text-label font-semibold',
  icon:
    'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control',
};

const buttonVariantClassNames: Record<ButtonVariant, string> = {
  primary: 'bg-action-primary text-content-inverse',
  secondary:
    'border border-border-subtle bg-surface-raised text-content-primary hover:bg-brand-cloud',
  outline:
    'border border-border-strong bg-transparent text-content-primary hover:bg-surface-subtle',
  ghost: 'hover:bg-surface-subtle',
};

export function Button({
  children,
  size = 'default',
  type = 'button',
  variant = size === 'icon' ? 'ghost' : 'primary',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      className={`${buttonSizeClassNames[size]} ${buttonVariantClassNames[variant]}`}
      type={type}
    >
      {children}
    </button>
  );
}
