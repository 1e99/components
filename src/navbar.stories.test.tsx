import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import navbarMeta, { DomainWebsite } from "./navbar.stories";

describe("Navbar stories", () => {
  it("renders the official horizontal logo in the domain reference", () => {
    const renderDomain = navbarMeta.render;

    render(renderDomain?.({ ...navbarMeta.args, ...DomainWebsite.args } as never) ?? null);

    expect(screen.getByRole("img", { name: "1e99" })).toHaveAttribute(
      "src",
      "/brand/1e99-logo-horizontal.svg",
    );
  });
});
