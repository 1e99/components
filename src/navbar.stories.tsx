import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar, type NavbarProps } from "./navbar";

function BrandLogoPreview() {
  return (
    <a
      aria-label="Página inicial 1e99"
      className="shrink-0 rounded-control focus-visible:outline-none focus-visible:shadow-focus"
      href="/"
    >
      <img
        alt="1e99"
        className="h-auto w-32 sm:w-40"
        height="430"
        src="/brand/1e99-logo-horizontal.svg"
        width="1150"
      />
    </a>
  );
}

function LocalePreview({ compactOnMobile = false }: { compactOnMobile?: boolean }) {
  const sizeClasses = compactOnMobile
    ? "h-12 gap-2 px-3 md:gap-4 md:px-4 md:min-w-32"
    : "min-h-12 gap-4 px-4 md:min-w-32";

  return (
    <button
      aria-label="Idioma: Português"
      className={`flex w-full items-center justify-between rounded-control border border-border-subtle bg-surface-raised py-control-y text-label font-semibold text-content-primary shadow-card transition-colors duration-200 ease-brand hover:bg-brand-cloud focus-visible:outline-none focus-visible:shadow-focus ${sizeClasses}`}
      type="button"
    >
      <span>Português</span>
      <svg
        aria-hidden="true"
        className="size-5 shrink-0 text-content-secondary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        viewBox="0 0 20 20"
      >
        <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0"
      data-testid="google-mark"
      viewBox="0 0 48 48"
    >
      <path
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"
        fill="#ffc107"
      />
      <path
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691Z"
        fill="#ff3d00"
      />
      <path
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z"
        fill="#4caf50"
      />
      <path
        d="M43.611 20.083H42V20H24v8h11.303a12.02 12.02 0 0 1-4.087 5.571l6.193 5.236C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"
        fill="#1976d2"
      />
    </svg>
  );
}

function DomainGoogleLogin() {
  return (
    <button
      className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-control border border-border-subtle bg-surface-raised px-control-x py-control-y text-label font-semibold whitespace-nowrap text-content-primary shadow-card transition-[translate,scale,background-color] duration-200 ease-brand hover:-translate-y-0.5 hover:bg-brand-cloud active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-focus"
      type="button"
    >
      <GoogleMark />
      Entrar com Google
    </button>
  );
}

function DomainActions() {
  return (
    <div className="hidden items-center gap-3 md:flex">
      <LocalePreview />
      <DomainGoogleLogin />
    </div>
  );
}

function CurriculumActions() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <LocalePreview compactOnMobile />
      <a
        aria-label="Mais aplicativos"
        className="hidden min-h-11 items-center justify-center gap-2 rounded-control px-2 text-label font-bold text-content-secondary transition-colors hover:bg-surface-subtle hover:text-content-primary sm:inline-flex sm:px-3"
        href="/apps"
      >
        <span>Mais apps</span>
        <svg
          aria-hidden="true"
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M14 3h7v7M10 14 21 3M21 14v7h-7M3 10V3h7M3 14v7h7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </a>
      <button
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-action-primary px-control-x text-label font-bold text-content-inverse shadow-card transition duration-200 ease-brand hover:bg-brand-navy active:translate-y-px"
        type="button"
      >
        <GoogleMark />
        Entrar
      </button>
    </div>
  );
}

function renderDomain(args: NavbarProps) {
  return (
    <Navbar
      {...args}
      actions={<DomainActions />}
      brand={<BrandLogoPreview />}
      mobileNavigation={{
        actions: (
          <>
            <LocalePreview />
            <DomainGoogleLogin />
          </>
        ),
        menuLabel: "Abrir menu de navegação",
        navigationLabel: "Navegação principal móvel",
      }}
    />
  );
}

function renderCurriculum(args: NavbarProps) {
  return <Navbar {...args} actions={<CurriculumActions />} brand={<BrandLogoPreview />} />;
}

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    brand: <BrandLogoPreview />,
    items: [],
    navigationLabel: "Navegação principal",
  },
  argTypes: {
    actions: { control: false },
    brand: { control: false },
    mobileNavigation: { control: false },
    renderLink: { control: false },
  },
  render: renderDomain,
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DomainWebsite: Story = {
  args: {
    items: [
      { href: "/#aplicativos", label: "Aplicativos" },
      { href: "/sobre", label: "Sobre a 1e99" },
    ],
    layer: "above",
    linkTreatment: "underlined",
    linkWeight: "semibold",
    navigationLabel: "Navegação principal",
    width: "content",
  },
};

export const Curriculo: Story = {
  args: {
    items: [
      { href: "#modelos", label: "Modelos" },
      { href: "#planos", label: "Preço" },
      { href: "#duvidas", label: "Dúvidas" },
    ],
    layer: "standard",
    linkTreatment: "plain",
    linkWeight: "bold",
    navigationLabel: "Página inicial do 1e99 Currículo",
    width: "wide",
  },
  render: renderCurriculum,
};
