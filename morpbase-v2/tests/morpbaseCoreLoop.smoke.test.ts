// @vitest-environment jsdom

import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "../src/App";

describe("morpbase core loop smoke", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("moves a shaped line from workspace into memory", async () => {
    render(createElement(App));

    expect(
      screen.getByRole("heading", { name: "Shape a keep-worthy portrait workflow." }),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Oracle" }));
    fireEvent.click(screen.getByRole("button", { name: "Painterly" }));
    fireEvent.click(screen.getByRole("button", { name: "Close Portrait" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep to Memory" }));

    expect(
      await screen.findByRole("heading", { name: "A second home for work that still matters." }),
    ).toBeTruthy();
    expect(screen.getByText("Oracle Study was kept and moved into Memory.")).toBeTruthy();
    expect(screen.getAllByText("Oracle Study").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Continue this line" })).toBeTruthy();
  });

  it("returns a kept line from memory back into workspace", async () => {
    render(createElement(App));

    fireEvent.click(screen.getByRole("button", { name: "Oracle" }));
    fireEvent.click(screen.getByRole("button", { name: "Painterly" }));
    fireEvent.click(screen.getByRole("button", { name: "Close Portrait" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep to Memory" }));
    fireEvent.click(await screen.findByRole("button", { name: "Continue this line" }));

    expect(
      await screen.findByRole("heading", { name: "Shape a keep-worthy portrait workflow." }),
    ).toBeTruthy();
    expect(screen.getByText("Continuing Oracle Study from Memory.")).toBeTruthy();
    expect(screen.getByText("Continuing a kept line")).toBeTruthy();
    expect(screen.getAllByText("Oracle").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Painterly look").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Close Portrait framing").length).toBeGreaterThan(0);
  });

  it("lets a public result come inward as an authored new version", async () => {
    render(createElement(App));

    fireEvent.click(screen.getByRole("button", { name: "Oracle" }));
    fireEvent.click(screen.getByRole("button", { name: "Painterly" }));
    fireEvent.click(screen.getByRole("button", { name: "Close Portrait" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep to Memory" }));
    fireEvent.click(await screen.findByRole("button", { name: "Release to Community" }));

    expect(
      await screen.findByRole("heading", { name: "Public life should grow from real MorpBase work." }),
    ).toBeTruthy();
    expect(screen.getByText("Oracle Study moved from Memory into Discover.")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", { name: "Invite Versions" })[0]);
    fireEvent.click(await screen.findByRole("button", { name: "Make your own version" }));

    expect(
      await screen.findByRole("heading", { name: "A second home for work that still matters." }),
    ).toBeTruthy();
    expect(screen.getByText("Oracle Study started a new version line in Memory.")).toBeTruthy();
    expect(screen.getAllByText("Oracle Study Version").length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "This line began as your own version of public work. Keep changing it, distill something from it, or release the new version later.",
      ),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Continue this line" }));

    expect(
      await screen.findByRole("heading", { name: "Shape a keep-worthy portrait workflow." }),
    ).toBeTruthy();
    expect(screen.getByText("Continuing Oracle Study Version from Memory.")).toBeTruthy();
    expect(screen.getByText("Continuing a kept line")).toBeTruthy();
  });

  it("reactivates a continuity line back into workspace as carried sameness", async () => {
    render(createElement(App));

    fireEvent.click(screen.getByRole("button", { name: "Oracle" }));
    fireEvent.click(screen.getByRole("button", { name: "Painterly" }));
    fireEvent.click(screen.getByRole("button", { name: "Close Portrait" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep to Memory" }));
    fireEvent.click(await screen.findByRole("button", { name: "Continue this line" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep to Memory" }));
    fireEvent.click(await screen.findByRole("button", { name: "Continuity" }));

    expect(
      await screen.findByRole("heading", { name: "Recurring sameness should feel visible and reusable." }),
    ).toBeTruthy();
    expect(screen.getAllByText("Oracle Line").length).toBeGreaterThan(0);
    expect(screen.getByText("2 readable appearances")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Carry this line forward" }));

    expect(
      await screen.findByRole("heading", { name: "Shape a keep-worthy portrait workflow." }),
    ).toBeTruthy();
    expect(screen.getByText("Activated Oracle Line back into Workspace.")).toBeTruthy();
    expect(screen.getByText("Carrying a continuity line forward")).toBeTruthy();
    expect(screen.getAllByText("Oracle").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Painterly look").length).toBeGreaterThan(0);
  });
});
