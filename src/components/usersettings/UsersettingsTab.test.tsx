import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UsersettingsTab } from "./UsersettingsTab";
import type { Usersettings } from "../../types/usersettings";

const baseProps = {
  usersettings: {
    systemuserid: "user-1",
    paginglimit: 50,
    homepagearea: "sales",
    homepagesubarea: "accounts",
  } satisfies Usersettings,
  isLoading: false,
  sitemapData: {
    areas: [
      { id: "sales", title: "Sales" },
      { id: "service", title: "Service" },
    ],
    subAreas: [
      { id: "accounts", title: "Accounts", areaId: "sales" },
      { id: "cases", title: "Cases", areaId: "service" },
    ],
  },
  timezones: [{ timezonecode: 4, userinterfacename: "Pacific Standard Time" }],
  languages: [
    { languagelocaleid: "en-us", localeid: 1033, language: "English", region: "United States" },
  ],
  formats: [{ localeid: 1033, language: "English", region: "United States" }],
  systemusers: [{ systemuserId: "user-1", fullname: "Ada Lovelace" }],
  allUsersettings: [
    {
      systemuserid: "user-1",
      paginglimit: 50,
      homepagearea: "sales",
      homepagesubarea: "accounts",
    } satisfies Usersettings,
  ],
  dashboards: [{ formid: "dashboard-1", name: "Sales dashboard" }],
  currencies: [{ transactioncurrencyid: "currency-1", currencyname: "Euro" }],
};

describe("UsersettingsTab", () => {
  it("shows loading and missing-settings states", () => {
    const { rerender } = render(<UsersettingsTab {...baseProps} isLoading />);
    expect(screen.getByText("Loading user settings...")).toBeTruthy();

    rerender(<UsersettingsTab {...baseProps} usersettings={null} />);
    expect(screen.getByText("No user settings available")).toBeTruthy();
  });

  it("renders settings sections and resolves existing lookup values", () => {
    render(<UsersettingsTab {...baseProps} />);

    expect(screen.getByText("Display Settings")).toBeTruthy();
    expect(screen.getByText("Regional & Language Settings")).toBeTruthy();
    expect(screen.getByText("Home Page Settings")).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Records Per Page" })).toHaveProperty("value", "50");
    expect(screen.getByRole("combobox", { name: "App" })).toHaveProperty("value", "Sales");
    expect(screen.getByRole("combobox", { name: "Page" })).toHaveProperty("value", "Accounts");
  });

  it("notifies when the app area changes and clears the dependent page", () => {
    const onFieldChange = vi.fn();
    render(<UsersettingsTab {...baseProps} onFieldChange={onFieldChange} />);

    fireEvent.click(screen.getByRole("combobox", { name: "App" }));
    fireEvent.click(screen.getByRole("option", { name: "Service" }));

    expect(onFieldChange).toHaveBeenCalledWith("homepagesubarea", undefined);
    expect(onFieldChange).toHaveBeenCalledWith("homepagearea", "service");
    fireEvent.click(screen.getByRole("combobox", { name: "Page" }));
    expect(screen.getByRole("option", { name: "Cases" })).toBeTruthy();
    expect(screen.queryByRole("option", { name: "Accounts" })).toBeNull();
  });

  it("shows all pages when no app area is selected and falls back to raw lookup IDs", () => {
    render(
      <UsersettingsTab
        {...baseProps}
        usersettings={{ systemuserid: "user-1", homepagesubarea: "unknown-page", timezonecode: 999 }}
        allUsersettings={[
          { systemuserid: "user-1", homepagesubarea: "unknown-page", timezonecode: 999 },
        ]}
        sitemapData={{ ...baseProps.sitemapData, areas: [], subAreas: baseProps.sitemapData.subAreas }}
        timezones={[]}
        languages={[{ languagelocaleid: "de", localeid: 1031, language: "German" }]}
        formats={[{ localeid: 1031, language: "German" }]}
      />,
    );

    expect(screen.getByRole("combobox", { name: "App" })).toHaveProperty("value", "No change");
    expect(screen.getByRole("combobox", { name: "Page" })).toHaveProperty("value", "unknown-page");
    expect(screen.getByRole("combobox", { name: "Time Zone" })).toHaveProperty("value", "999");

    fireEvent.click(screen.getByRole("combobox", { name: "Page" }));
    expect(screen.getByRole("option", { name: "Accounts" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Cases" })).toBeTruthy();
  });

  it("handles empty values and no-change bulk values in settings comboboxes", () => {
    render(
      <UsersettingsTab
        {...baseProps}
        usersettings={{ systemuserid: "bulk-edit" }}
        allUsersettings={[
          { systemuserid: "user-1", homepagearea: "sales", timezonecode: 4 },
          { systemuserid: "user-2", homepagearea: "service", timezonecode: 5 },
        ]}
        timezones={[]}
        languages={[]}
        formats={[]}
      />,
    );

    expect(screen.getByRole("combobox", { name: /^Time Zone/ })).toHaveProperty("value", "No change");
    expect(screen.getByRole("combobox", { name: /^App/ })).toHaveProperty("value", "No change");
  });

  it("clears a selected app and notifies of the primary and dependent changes", () => {
    const onFieldChange = vi.fn();
    render(<UsersettingsTab {...baseProps} onFieldChange={onFieldChange} />);

    fireEvent.click(screen.getByRole("combobox", { name: "App" }));
    fireEvent.click(screen.getByRole("option", { name: "No change" }));

    expect(onFieldChange).toHaveBeenCalledWith("homepagesubarea", undefined);
    expect(onFieldChange).toHaveBeenCalledWith("homepagearea", undefined);
  });

  it("updates a number-based setting and reports a cleared selection", () => {
    const onFieldChange = vi.fn();
    render(<UsersettingsTab {...baseProps} onFieldChange={onFieldChange} />);

    fireEvent.click(screen.getByRole("combobox", { name: "Time Zone" }));
    fireEvent.click(screen.getByRole("option", { name: "Pacific Standard Time" }));
    expect(onFieldChange).toHaveBeenCalledWith("timezonecode", 4);

    fireEvent.click(screen.getByRole("combobox", { name: "Time Zone" }));
    fireEvent.click(screen.getByRole("option", { name: "No change" }));
    expect(onFieldChange).toHaveBeenCalledWith("timezonecode", undefined);
  });
});
