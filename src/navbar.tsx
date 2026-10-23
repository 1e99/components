import type { ReactNode } from "react";

export type NavbarItem = {
  href: string;
  label: ReactNode;
};

export type NavbarProps = {
  brand: ReactNode;
  items: readonly NavbarItem[];
  navigationLabel: string;
};

export function Navbar({ brand, items, navigationLabel }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-page/90 text-label font-semibold backdrop-blur-lg">
      <div className="mx-auto flex min-h-20 max-w-5xl items-center justify-between gap-4 px-shell">
        <div className="shrink-0">{brand}</div>
        <nav aria-label={navigationLabel} className="hidden items-center gap-6 lg:flex">
          {items.map((item) => (
            <a
              className="text-label font-semibold text-content-secondary transition-colors duration-200 ease-brand hover:text-content-primary focus-visible:rounded-control focus-visible:outline-none focus-visible:shadow-focus"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
