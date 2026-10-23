import type {ButtonHTMLAttributes, ReactNode} from 'react';
import {FcGoogle} from 'react-icons/fc';

export type GoogleSignInButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'type'
> & {
  label: ReactNode;
};

const buttonClassName =
  'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-control border border-border-subtle bg-surface-raised px-control-x py-control-y text-label font-semibold whitespace-nowrap text-content-primary shadow-card transition-[translate,scale,background-color] duration-200 ease-brand hover:-translate-y-0.5 hover:bg-brand-cloud active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-wait disabled:opacity-70 motion-reduce:transform-none';

export function GoogleSignInButton(
    {label, ...buttonProps}: GoogleSignInButtonProps,
) {
  return (
    <button {...buttonProps} className={buttonClassName} type="button">
      <FcGoogle
        aria-hidden="true"
        className="size-5 shrink-0"
        data-testid="google-mark"
      />
      {label}
    </button>
  );
}
