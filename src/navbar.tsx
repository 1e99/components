import { Fragment, type ReactNode } from "react";

export type NavbarItem = {
  href: string;
  label: ReactNode;
};

export type NavbarLinkRenderer = (props: {
  children: ReactNode;
  className: string;
  href: string;
}) => ReactNode;

export type NavbarProps = {
  actions?: ReactNode;
  brand: ReactNode;
  items: readonly NavbarItem[];
  navigationLabel: string;
  renderLink?: NavbarLinkRenderer;
};

const desktopLinkClassName =
  "text-label font-semibold text-content-secondary transition-colors duration-200 ease-brand hover:text-content-primary focus-visible:rounded-control focus-visible:outline-none focus-visible:shadow-focus";

export function Navbar({
  actions,
  brand,
  items,
  navigationLabel,
  renderLink,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-page/90 text-label font-semibold backdrop-blur-lg">
      <div className="mx-auto flex min-h-20 max-w-5xl items-center justify-between gap-4 px-shell">
        <div className="shrink-0">{brand}</div>
        <div className="flex min-w-0 items-center gap-6">
          <nav aria-label={navigationLabel} className="hidden items-center gap-6 lg:flex">
            {items.map((item) => (
              <Fragment key={item.href}>
                {renderLink ? (
                  renderLink({
                    children: item.label,
                    className: desktopLinkClassName,
                    href: item.href,
                  })
                ) : (
                  <a className={desktopLinkClassName} href={item.href}>
                    {item.label}
                  </a>
                )}
              </Fragment>
            ))}
          </nav>
          {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}
