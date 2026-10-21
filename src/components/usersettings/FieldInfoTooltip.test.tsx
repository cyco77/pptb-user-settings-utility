import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FieldInfoTooltip } from "./FieldInfoTooltip";
import type { FormatValueContext } from "./formatFieldValue";
import type { Systemuser } from "../../types/systemuser";
import type { Usersettings } from "../../types/usersettings";

const { getFieldDifferencesMock } = vi.hoisted(() => ({
  getFieldDifferencesMock: vi.fn(),
}));

vi.mock("./fieldStateUtils", () => ({
  getFieldDifferences: getFieldDifferencesMock,
}));

const systemusers: Systemuser[] = [
  { systemuserId: "user-1", fullname: "Grace Hopper" },
  { systemuserId: "user-2", fullname: "Ada Lovelace" },
];

const formatContext: FormatValueContext = {
  timezones: [],
  languages: [],
  formats: [],
  sitemapData: { areas: [], subAreas: [] },
  dashboards: [],
  currencies: [],
};

const settings = (paginglimit: number): Usersettings => ({
  systemuserid: `user-${paginglimit}`,
  paginglimit,
});

describe("FieldInfoTooltip", () => {
  beforeEach(() => {
    getFieldDifferencesMock.mockReset();
    getFieldDifferencesMock.mockImplementation(
      (_field: string, _users: Systemuser[], rows: Usersettings[]) => {
        if (rows.length < 2 || rows.every((row) => row.paginglimit === rows[0].paginglimit)) return null;
        return rows.map((row, index) => ({
          user: systemusers[index],
          value: row.paginglimit,
        }));
      },
    );
  });

  it("does not render an info icon when user values are the same", () => {
    const { container } = render(
      <FieldInfoTooltip
        fieldKey="paginglimit"
        systemusers={systemusers}
        allUsersettings={[settings(50), settings(50)]}
        formatContext={formatContext}
      />,
    );

    expect(container.querySelector("span[aria-labelledby]")).toBeNull();
  });

  it("renders an info icon when users have different values", () => {
    const { container } = render(
      <FieldInfoTooltip
        fieldKey="paginglimit"
        systemusers={systemusers}
        allUsersettings={[settings(25), settings(100)]}
        formatContext={formatContext}
      />,
    );

    expect(container.querySelector("span[aria-labelledby]")).not.toBeNull();
  });

  it("shows values sorted by user name when the info icon is hovered", async () => {
    render(
      <FieldInfoTooltip
        fieldKey="paginglimit"
        systemusers={systemusers}
        allUsersettings={[settings(25), settings(100)]}
        formatContext={formatContext}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Different values for 2 users")).toBeTruthy();
    });

    const names = screen.getAllByText(/^(Ada Lovelace|Grace Hopper):$/);
    expect(names.map((name) => name.textContent)).toEqual([
      "Ada Lovelace:",
      "Grace Hopper:",
    ]);
  });

  it("handles missing user names in the differences list", async () => {
    getFieldDifferencesMock.mockReturnValue([
      { user: undefined, value: 25 },
      { user: { systemuserId: "user-1", fullname: "Ada Lovelace" }, value: 100 },
      { user: undefined, value: 75 },
    ]);

    render(
      <FieldInfoTooltip
        fieldKey="paginglimit"
        systemusers={systemusers}
        allUsersettings={[settings(25), settings(100)]}
        formatContext={formatContext}
      />,
    );

    await waitFor(() => expect(screen.getAllByText(/Unknown:/)).toHaveLength(2));
  });

  it("uses a zero user count when the user list is absent", () => {
    getFieldDifferencesMock.mockReturnValue([{ user: undefined, value: 25 }]);

    render(
      <FieldInfoTooltip
        fieldKey="paginglimit"
        systemusers={null as unknown as Systemuser[]}
        allUsersettings={[settings(25), settings(100)]}
        formatContext={formatContext}
      />,
    );

    expect(screen.getByText("Different values for 0 users")).toBeTruthy();
  });

  it("prevents the info icon mouse events from bubbling or triggering defaults", () => {
    const parentClick = vi.fn();

    render(
      <div onClick={parentClick}>
        <FieldInfoTooltip
          fieldKey="paginglimit"
          systemusers={systemusers}
          allUsersettings={[settings(25), settings(100)]}
          formatContext={formatContext}
        />
      </div>,
    );

    const wrapper = document.querySelector("span[aria-labelledby]")!;
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    const mouseDown = new MouseEvent("mousedown", { bubbles: true, cancelable: true });

    fireEvent(wrapper, click);
    fireEvent(wrapper, mouseDown);

    expect(click.defaultPrevented).toBe(true);
    expect(mouseDown.defaultPrevented).toBe(true);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it("logs rendering errors and returns no icon", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const exception = new Error("comparison failed");
    getFieldDifferencesMock.mockImplementation(() => {
      throw exception;
    });

    const { container } = render(
      <FieldInfoTooltip
        fieldKey="paginglimit"
        systemusers={systemusers}
        allUsersettings={[settings(25), settings(100)]}
        formatContext={formatContext}
      />,
    );

    expect(container.querySelector("svg")).toBeNull();
    expect(error).toHaveBeenCalledWith(
      "Error rendering info icon for",
      "paginglimit",
      exception,
    );
    error.mockRestore();
  });
});
