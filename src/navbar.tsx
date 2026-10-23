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

export type NavbarWidth = "content" | "wide";
export type NavbarLinkTreatment = "plain" | "underlined";
export type NavbarMobileNavigation = "disclosure" | "hidden";

export type NavbarProps = {
  actions?: ReactNode;
  brand: ReactNode;
  items: readonly NavbarItem[];
  linkTreatment?: NavbarLinkTreatment;
  menuLabel?: string;
  mobileActions?: ReactNode;
  mobileNavigation?: NavbarMobileNavigation;
  mobileNavigationLabel?: string;
  navigationLabel: string;
  renderLink?: NavbarLinkRenderer;
  width?: NavbarWidth;
};

const baseLinkClassName =
  "text-label font-semibold text-content-secondary transition-colors duration-200 ease-brand hover:text-content-primary focus-visible:rounded-control focus-visible:outline-none focus-visible:shadow-focus";

const underlinedLinkClassName =
  "relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-action-primary after:transition-transform after:duration-200 after:ease-brand hover:after:scale-x-100 focus-visible:after:scale-x-100";

export function Navbar({
  actions,
  brand,
  items,
  linkTreatment = "plain",
  menuLabel,
  mobileActions,
  mobileNavigation = "hidden",
  mobileNavigationLabel,
  navigationLabel,
  renderLink,
  width = "content",
}: NavbarProps) {
  const linkClassName = [
    baseLinkClassName,
    linkTreatment === "underlined" ? underlinedLinkClassName : "",
  ]
    .filter(Boolean)
    .join(" ");
  const containerWidthClassName = width === "wide" ? "max-w-7xl" : "max-w-5xl";
  const mobileLabel = mobileNavigationLabel ?? navigationLabel;
  const mobileMenuLabel = menuLabel ?? navigationLabel;

  const renderLinks = () =>
    items.map((item) => (
      <Fragment key={item.href}>
        {renderLink ? (
          renderLink({
            children: item.label,
            className: linkClassName,
            href: item.href,
          })
        ) : (
          <a className={linkClassName} href={item.href}>
            {item.label}
          </a>
        )}
      </Fragment>
    ));

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-page/90 text-label font-semibold backdrop-blur-lg">
      <div
        className={`mx-auto flex min-h-20 ${containerWidthClassName} items-center justify-between gap-4 px-shell`}
      >
        <div className="shrink-0">{brand}</div>
        <div className="flex min-w-0 items-center gap-6">
          <nav aria-label={navigationLabel} className="hidden items-center gap-6 lg:flex">
            {renderLinks()}
          </nav>
          {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
          {mobileNavigation === "disclosure" ? (
            <details className="relative lg:hidden">
              <summary
                aria-label={mobileMenuLabel}
                className="flex cursor-pointer list-none items-center gap-2 rounded-control px-3 py-2 text-content-secondary transition-colors hover:text-content-primary focus-visible:outline-none focus-visible:shadow-focus [&::-webkit-details-marker]:hidden"
              >
                <span>{mobileMenuLabel}</span>
                <span aria-hidden="true">☰</span>
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 flex w-72 flex-col gap-4 rounded-card border border-border-subtle bg-surface-page p-4 shadow-focus">
                <nav aria-label={mobileLabel} className="flex flex-col gap-4">
                  {renderLinks()}
                </nav>
                {mobileActions ? (
                  <div className="border-t border-border-subtle pt-4">{mobileActions}</div>
                ) : null}
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </header>
  );
}
