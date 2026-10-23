import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as components from "./index";
import { Navbar } from "./index";

describe("Navbar", () => {
  it("exports the shared navigation component", () => {
    expect(components).toHaveProperty("Navbar");
  });

  it("renders the brand and desktop navigation with default anchors", () => {
    render(
      <Navbar
        brand={<a href="/">1e99</a>}
        items={[
          { href: "/apps", label: "Apps" },
          { href: "/about", label: "About" },
        ]}
        navigationLabel="Primary navigation"
      />,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "1e99" })).toHaveAttribute("href", "/");

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    expect(within(navigation).getByRole("link", { name: "Apps" })).toHaveAttribute(
      "href",
      "/apps",
    );
    expect(within(navigation).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("accepts a router-aware link renderer and an actions slot", () => {
    render(
      <Navbar
        actions={<button type="button">Sign in</button>}
        brand={<a href="/">1e99</a>}
        items={[{ href: "/apps", label: "Apps" }]}
        navigationLabel="Primary navigation"
        renderLink={({ children, href, className }) => (
          <a className={className} data-router-link="true" href={`/en${href}`}>
            {children}
          </a>
        )}
      />,
    );

    expect(screen.getByRole("link", { name: "Apps" })).toHaveAttribute(
      "href",
      "/en/apps",
    );
    expect(screen.getByRole("link", { name: "Apps" })).toHaveAttribute(
      "data-router-link",
      "true",
    );
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("keeps the brand, desktop navigation, and actions as sibling regions", () => {
    render(
      <Navbar
        actions={<div data-testid="navbar-actions">Actions</div>}
        brand={<a href="/">1e99</a>}
        items={[{ href: "/apps", label: "Apps" }]}
        navigationLabel="Primary navigation"
      />,
    );

    const container = screen.getByRole("banner").firstElementChild;
    expect(container?.children).toHaveLength(3);
    expect(container?.children[0]).toContainElement(
      screen.getByRole("link", { name: "1e99" }),
    );
    expect(container?.children[1]).toBe(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    );
    expect(container?.children[2]).toContainElement(screen.getByTestId("navbar-actions"));
  });

  it("matches the domain and curriculum desktop style variants", () => {
    const { rerender } = render(
      <Navbar
        brand={<a href="/">1e99</a>}
        items={[{ href: "/apps", label: "Apps" }]}
        layer="above"
        linkTreatment="underlined"
        linkWeight="semibold"
        navigationLabel="Primary navigation"
      />,
    );

    expect(screen.getByRole("banner")).toHaveClass("z-50");
    expect(screen.getByRole("link", { name: "Apps" })).toHaveClass(
      "font-semibold",
      "after:h-0.5",
      "after:bg-action-primary",
    );

    rerender(
      <Navbar
        brand={<a href="/">1e99</a>}
        items={[{ href: "#models", label: "Models" }]}
        layer="standard"
        linkTreatment="plain"
        linkWeight="bold"
        navigationLabel="Primary navigation"
      />,
    );

    expect(screen.getByRole("banner")).toHaveClass("z-40");
    expect(screen.getByRole("link", { name: "Models" })).toHaveClass("font-bold");
    expect(screen.getByRole("link", { name: "Models" })).not.toHaveClass(
      "after:scale-x-0",
    );
  });

  it("matches the domain mobile menu trigger, panel, links, and actions", () => {
    render(
      <Navbar
        brand={<a href="/">1e99</a>}
        items={[{ href: "/apps", label: "Apps" }]}
        mobileNavigation={{
          actions: <button type="button">Mobile sign in</button>,
          menuLabel: "Open navigation menu",
          navigationLabel: "Mobile primary navigation",
        }}
        navigationLabel="Primary navigation"
      />,
    );

    const menuTrigger = screen.getByLabelText("Open navigation menu");
    expect(menuTrigger.closest("details")).toHaveClass("relative", "md:hidden");
    expect(menuTrigger).toHaveClass(
      "size-12",
      "bg-action-primary",
      "text-content-inverse",
      "shadow-card",
      "transition-[translate,scale,background-color]",
      "active:scale-[0.97]",
    );

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile primary navigation",
    });
    expect(mobileNavigation).toHaveClass(
      "absolute",
      "top-14",
      "right-0",
      "w-72",
      "bg-surface-raised",
      "shadow-float",
    );
    expect(within(mobileNavigation).getByRole("link", { name: "Apps" })).toHaveAttribute(
      "href",
      "/apps",
    );
    expect(within(mobileNavigation).getByRole("link", { name: "Apps" })).toHaveClass(
      "min-h-12",
      "px-3",
      "font-semibold",
    );
    expect(screen.getByRole("button", { name: "Mobile sign in" })).toBeInTheDocument();
  });

  it("opens the native mobile disclosure", async () => {
    const user = userEvent.setup();

    render(
      <Navbar
        brand={<a href="/">1e99</a>}
        items={[{ href: "/apps", label: "Apps" }]}
        mobileNavigation={{
          menuLabel: "Open navigation menu",
          navigationLabel: "Mobile primary navigation",
        }}
        navigationLabel="Primary navigation"
      />,
    );

    const menu = screen.getByLabelText("Open navigation menu");
    await user.click(menu);

    expect(menu.closest("details")).toHaveAttribute("open");
  });

  it("applies the wide and underlined variants without rendering mobile navigation by default", () => {
    render(
      <Navbar
        brand={<a href="/">1e99</a>}
        items={[{ href: "/apps", label: "Apps" }]}
        linkTreatment="underlined"
        navigationLabel="Primary navigation"
        width="wide"
      />,
    );

    expect(screen.getByRole("banner").firstElementChild).toHaveClass("max-w-7xl");
    expect(screen.getByRole("link", { name: "Apps" })).toHaveClass("after:scale-x-0");
    expect(screen.queryByRole("button", { name: "Open navigation menu" })).not.toBeInTheDocument();
  });
});
