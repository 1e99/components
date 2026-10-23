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
});
