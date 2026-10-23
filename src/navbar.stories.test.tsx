import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { NavbarProps } from "./navbar";
import navbarMeta, { DomainWebsite } from "./navbar.stories";

describe("Navbar stories", () => {
  it("renders the official horizontal logo in the domain reference", () => {
    const renderDomain = navbarMeta.render;
    const domainArgs: NavbarProps = {
      brand: <span>1e99</span>,
      items: [],
      navigationLabel: "Navegação principal",
      ...DomainWebsite.args,
    };

    render(renderDomain?.(domainArgs) ?? null);

    expect(screen.getByRole("img", { name: "1e99" })).toHaveAttribute(
      "src",
      "/brand/1e99-logo-horizontal.svg",
    );

    for (const mark of screen.getAllByTestId("google-mark")) {
      expect(mark).toHaveAttribute("viewBox", "0 0 48 48");
      expect(mark.querySelectorAll("path")).toHaveLength(4);
    }
  });
});
