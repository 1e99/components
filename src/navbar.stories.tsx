import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar } from "./navbar";

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    brand: <span>1e99</span>,
    items: [],
    navigationLabel: "Navegação principal",
  },
  argTypes: {
    actions: { control: false },
    brand: { control: false },
    renderLink: { control: false },
  },
  render: (args) => (
    <Navbar
      {...args}
      actions={
        <a
          className="rounded-control bg-action-primary px-3 py-2 text-sm font-semibold text-white"
          href="/account"
        >
          Área do cliente
        </a>
      }
      brand={
        <a className="text-lg font-bold text-content-primary" href="/">
          1e99
        </a>
      }
    />
  ),
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DomainWebsite: Story = {
  args: {
    items: [
      { href: "/apps", label: "Apps" },
      { href: "/about", label: "Sobre" },
    ],
    linkTreatment: "underlined",
    mobileNavigation: {
      actions: (
        <a className="block rounded-control bg-action-primary px-3 py-2 text-center text-sm font-semibold text-white" href="/account">
          Área do cliente
        </a>
      ),
      menuLabel: "Abrir menu de navegação",
      navigationLabel: "Navegação principal móvel",
    },
    navigationLabel: "Navegação principal",
    width: "content",
  },
};

export const Curriculo: Story = {
  args: {
    items: [
      { href: "#modelos", label: "Modelos" },
      { href: "#preco", label: "Preço" },
      { href: "#duvidas", label: "Dúvidas" },
    ],
    linkTreatment: "plain",
    navigationLabel: "Navegação principal",
    width: "wide",
  },
};
