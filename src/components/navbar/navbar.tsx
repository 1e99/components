import {Fragment, type ReactNode, useId} from 'react';
import {LuMenu} from 'react-icons/lu';

export type NavbarItem = {
  href: string;
  label: ReactNode;
};

export type NavbarLinkRenderer = (props: {
  children: ReactNode;
  className: string;
  href: string;
}) => ReactNode;

export type NavbarWidth = 'content' | 'wide';
export type NavbarLinkTreatment = 'plain' | 'underlined';
export type NavbarLinkWeight = 'bold' | 'semibold';
export type NavbarLayer = 'above' | 'standard';
export type NavbarMobileNavigation = {
  actions?: ReactNode;
  menuLabel: string;
  navigationLabel: string;
};

export type NavbarProps = {
  actions?: ReactNode;
  brand: ReactNode;
  items: readonly NavbarItem[];
  layer?: NavbarLayer;
  linkTreatment?: NavbarLinkTreatment;
  linkWeight?: NavbarLinkWeight;
  mobileNavigation?: NavbarMobileNavigation;
  navigationLabel: string;
  renderLink?: NavbarLinkRenderer;
  width?: NavbarWidth;
};

const baseLinkClassName =
  'text-label text-content-secondary transition-colors duration-200 ease-brand hover:text-content-primary focus-visible:rounded-control focus-visible:outline-none focus-visible:shadow-focus';

const underlinedLinkClassName =
  'relative after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-action-primary after:transition-transform after:duration-200 after:ease-brand hover:after:scale-x-100 focus-visible:after:scale-x-100';

const mobileLinkClassName =
  'flex min-h-12 items-center rounded-control px-3 text-label font-semibold text-content-secondary transition-colors duration-200 ease-brand hover:text-content-primary focus-visible:outline-none focus-visible:shadow-focus';

export function Navbar({
  actions,
  brand,
  items,
  layer = 'standard',
  linkTreatment = 'plain',
  linkWeight = 'semibold',
  mobileNavigation,
  navigationLabel,
  renderLink,
  width = 'content',
}: NavbarProps) {
  const mobileNavigationReference = useId();
  const mobileNavigationId = `navbar-mobile-navigation-${mobileNavigationReference}`;
  const mobileNavigationAnchorName = `--navbar-mobile-menu-trigger-${mobileNavigationReference.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const linkClassName = [
    baseLinkClassName,
    linkWeight === 'bold' ? 'font-bold' : 'font-semibold',
    linkTreatment === 'underlined' ? underlinedLinkClassName : '',
  ]
      .filter(Boolean)
      .join(' ');
  const containerWidthClassName = width === 'wide' ? 'max-w-7xl' : 'max-w-5xl';
  const layerClassName = layer === 'above' ? 'z-50' : 'z-40';
  const renderLinks = (className: string) =>
    items.map((item) => (
      <Fragment key={item.href}>
        {renderLink ? (
          renderLink({
            children: item.label,
            className,
            href: item.href,
          })
        ) : (
          <a className={className} href={item.href}>
            {item.label}
          </a>
        )}
      </Fragment>
    ));

  return (
    <header
      className={`sticky top-0 ${layerClassName} border-b border-border-subtle bg-surface-page/90 text-label font-semibold backdrop-blur-lg`}
    >
      <div
        className={`mx-auto flex min-h-20 ${containerWidthClassName} items-center justify-between gap-4 px-shell`}
      >
        <div className="shrink-0">{brand}</div>
        <nav aria-label={navigationLabel} className="hidden items-center gap-6 lg:flex">
          {renderLinks(linkClassName)}
        </nav>
        {actions}
        {mobileNavigation ? (
          <div className="relative md:hidden">
            <button
              aria-controls={mobileNavigationId}
              aria-label={mobileNavigation.menuLabel}
              className="flex size-12 cursor-pointer items-center justify-center rounded-control bg-action-primary text-content-inverse shadow-card transition-[translate,scale,background-color] duration-200 ease-brand active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-focus"
              popoverTarget={mobileNavigationId}
              popoverTargetAction="toggle"
              style={{anchorName: mobileNavigationAnchorName}}
              type="button"
            >
              <span className="sr-only">{mobileNavigation.menuLabel}</span>
              <LuMenu aria-hidden="true" className="size-6" />
            </button>
            <nav
              aria-label={mobileNavigation.navigationLabel}
              className="fixed top-[4.5rem] right-[1.25rem] m-0 w-72 rounded-card border border-border-subtle bg-surface-raised p-3 shadow-float [@supports(position-anchor:--navbar-mobile-menu-trigger)]:absolute [@supports(position-anchor:--navbar-mobile-menu-trigger)]:top-[calc(anchor(bottom)+0.5rem)] [@supports(position-anchor:--navbar-mobile-menu-trigger)]:right-auto [@supports(position-anchor:--navbar-mobile-menu-trigger)]:left-[anchor(right)] [@supports(position-anchor:--navbar-mobile-menu-trigger)]:-translate-x-full"
              id={mobileNavigationId}
              popover="auto"
              style={{positionAnchor: mobileNavigationAnchorName}}
            >
              {renderLinks(mobileLinkClassName)}
              {mobileNavigation.actions ? (
                <div className="mt-2 space-y-3 border-t border-border-subtle pt-3">
                  {mobileNavigation.actions}
                </div>
              ) : null}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
