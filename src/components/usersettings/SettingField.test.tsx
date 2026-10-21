import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SettingField } from "./SettingField";

describe("SettingField", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders field label and control children", () => {
    render(
      <SettingField fieldKey="paginglimit" label="Rows per page">
        <input aria-label="Rows per page value" value="50" readOnly />
      </SettingField>,
    );

    expect(screen.getAllByText("Rows per page")).toHaveLength(2);
    expect(screen.getByLabelText("Rows per page value")).toHaveProperty("value", "50");
    expect(screen.getByRole("link", { name: "Microsoft help for paginglimit" })).toBeTruthy();
  });

  it("opens its Microsoft help link through PPTB and falls back to window.open", async () => {
    const openInConnectionBrowser = vi.fn().mockRejectedValue(new Error("unavailable"));
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    vi.stubGlobal("toolboxAPI", { utils: { openInConnectionBrowser } });

    render(
      <SettingField fieldKey="paginglimit" label="Rows per page">
        <input />
      </SettingField>,
    );

    const helpLink = screen.getByRole("link", { name: "Microsoft help for paginglimit" });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    fireEvent(helpLink, event);

    expect(event.defaultPrevented).toBe(true);
    await waitFor(() => {
      expect(openInConnectionBrowser).toHaveBeenCalledWith(
        "https://learn.microsoft.com/power-apps/user/set-personal-options#general-tab-options",
      );
      expect(open).toHaveBeenCalledWith(
        "https://learn.microsoft.com/power-apps/user/set-personal-options#general-tab-options",
        "_blank",
        "noopener,noreferrer",
      );
    });
  });

  it("uses the generic help text for fields without a dedicated summary", () => {
    render(
      <SettingField fieldKey="currencyformatcode" label="Currency format">
        <input />
      </SettingField>,
    );

    expect(screen.getByRole("link", { name: "Microsoft help for currencyformatcode" })).toBeTruthy();
  });

  it("opens the documentation in a browser when PPTB navigation succeeds", async () => {
    const openInConnectionBrowser = vi.fn().mockResolvedValue(undefined);
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    vi.stubGlobal("toolboxAPI", { utils: { openInConnectionBrowser } });

    render(
      <SettingField fieldKey="defaultcountrycode" label="Country prefix">
        <input />
      </SettingField>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Microsoft help for defaultcountrycode" }));

    await waitFor(() => {
      expect(openInConnectionBrowser).toHaveBeenCalledWith(
        "https://learn.microsoft.com/power-apps/user/set-personal-options#general-tab-options",
      );
    });
    expect(open).not.toHaveBeenCalled();
  });

  it("does not render a help link for settings without documentation", () => {
    render(
      <SettingField fieldKey="emailpassword" label="Email password">
        <input />
      </SettingField>,
    );

    expect(screen.queryByRole("link")).toBeNull();
  });
});
