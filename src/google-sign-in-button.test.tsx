import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GoogleSignInButton } from "./google-sign-in-button";

describe("GoogleSignInButton", () => {
  it("preserves the domain website's Google sign-in treatment", () => {
    const { container } = render(<GoogleSignInButton />);

    const button = screen.getByRole("button", { name: "Entrar com Google" });
    const mark = container.querySelector("svg");

    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass(
      "min-h-12",
      "border-border-subtle",
      "bg-surface-raised",
      "font-semibold",
      "text-content-primary",
      "shadow-card",
      "hover:bg-brand-cloud",
    );
    expect(mark).toHaveAttribute("viewBox", "0 0 48 48");
    expect(mark?.querySelectorAll("path")).toHaveLength(4);
  });

  it("forwards behavior while allowing the consumer to localize its label", () => {
    render(<GoogleSignInButton disabled label="Continue with Google" />);

    const button = screen.getByRole("button", { name: "Continue with Google" });

    expect(button).toBeDisabled();
  });
});
