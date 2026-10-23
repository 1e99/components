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
});
