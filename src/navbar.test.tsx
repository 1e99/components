import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

  it("renders a mobile disclosure with its own navigation and actions", () => {
    render(
      <Navbar
        brand={<a href="/">1e99</a>}
        items={[{ href: "/apps", label: "Apps" }]}
        menuLabel="Open navigation menu"
        mobileActions={<button type="button">Mobile sign in</button>}
        mobileNavigation="disclosure"
        mobileNavigationLabel="Mobile primary navigation"
        navigationLabel="Primary navigation"
      />,
    );

    expect(screen.getByText("Open navigation menu")).toBeInTheDocument();

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile primary navigation",
    });
    expect(within(mobileNavigation).getByRole("link", { name: "Apps" })).toHaveAttribute(
      "href",
      "/apps",
    );
    expect(screen.getByRole("button", { name: "Mobile sign in" })).toBeInTheDocument();
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
    expect(
      screen.queryByRole("navigation", { name: "Mobile primary navigation" }),
    ).not.toBeInTheDocument();
  });
});
