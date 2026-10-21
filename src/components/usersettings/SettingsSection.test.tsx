import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SettingsSection } from "./SettingsSection";

describe("SettingsSection", () => {
  it("renders its title and grouped children", () => {
    render(
      <SettingsSection title="Regional settings">
        <label htmlFor="timezone">Time zone</label>
        <input id="timezone" value="Pacific" readOnly />
      </SettingsSection>,
    );

    expect(screen.getByText("Regional settings")).toBeTruthy();
    expect(screen.getByLabelText("Time zone")).toHaveProperty("value", "Pacific");
  });
});
