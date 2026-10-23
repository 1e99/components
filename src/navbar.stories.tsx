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
    <span aria-hidden="true" className="text-base font-bold text-[#4285f4]">
      G
    </span>
  );
}

function DomainGoogleLogin() {
  return (
    <button
      className="brand-action inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-control border border-border-subtle bg-surface-raised px-control-x py-control-y text-label font-semibold whitespace-nowrap text-content-primary shadow-card transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-brand-cloud focus-visible:outline-none focus-visible:shadow-focus"
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
