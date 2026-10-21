import { describe, expect, it, vi } from "vitest";
import {
  getFieldDifferences,
  getFieldEffectiveValue,
  getFieldState,
} from "./fieldStateUtils";
import type { Systemuser } from "../../types/systemuser";
import type { Usersettings } from "../../types/usersettings";

const usersettings = (...settings: Partial<Usersettings>[]): Usersettings[] =>
  settings.map((setting, index) => ({
    systemuserid: `user-${index + 1}`,
    ...setting,
  }));

const systemusers: Systemuser[] = [
  { systemuserId: "user-1", fullname: "Ada Lovelace" },
  { systemuserId: "user-2", fullname: "Grace Hopper" },
];

describe("getFieldState", () => {
  it("returns an unset, consistent state for an empty list", () => {
    expect(getFieldState("paginglimit", [])).toEqual({
      value: undefined,
      isDifferent: false,
    });
  });

  it("returns a shared value when every user has the same value", () => {
    expect(
      getFieldState("paginglimit", usersettings({ paginglimit: 50 }, { paginglimit: 50 })),
    ).toEqual({ value: 50, isDifferent: false });
  });

  it("treats null and undefined as the same unset value", () => {
    expect(
      getFieldState("preferredsolution", [
        { systemuserid: "user-1", preferredsolution: null as unknown as string },
        { systemuserid: "user-2" },
      ]),
    ).toEqual({ value: null, isDifferent: false });
  });

  it("marks different values and does not expose a shared value", () => {
    expect(
      getFieldState("paginglimit", usersettings({ paginglimit: 25 }, { paginglimit: 100 })),
    ).toEqual({ value: undefined, isDifferent: true });
  });
});

describe("getFieldEffectiveValue", () => {
  it("uses the common value when no edit is present", () => {
    expect(
      getFieldEffectiveValue("paginglimit", usersettings({ paginglimit: 50 }), null),
    ).toMatchObject({ value: 50, showNoChange: false });
  });

  it("indicates differing current values until an edit is made", () => {
    const current = usersettings({ paginglimit: 25 }, { paginglimit: 100 });

    expect(getFieldEffectiveValue("paginglimit", current, null)).toMatchObject({
      value: undefined,
      showNoChange: true,
    });
    expect(
      getFieldEffectiveValue("paginglimit", current, {
        systemuserid: "edited",
        paginglimit: 75,
      }),
    ).toMatchObject({ value: 75, showNoChange: false });
  });

  it("preserves explicit falsy edits", () => {
    expect(
      getFieldEffectiveValue("allowemailcredentials", usersettings({ allowemailcredentials: true }), {
        systemuserid: "edited",
        allowemailcredentials: false,
      }),
    ).toMatchObject({ value: false, showNoChange: false });
  });
});

describe("getFieldDifferences", () => {
  it("returns null when there is not enough data to compare", () => {
    expect(getFieldDifferences("paginglimit", [], [])).toBeNull();
    expect(getFieldDifferences("paginglimit", systemusers, [])).toBeNull();
    expect(getFieldDifferences("paginglimit", null as unknown as Systemuser[], [])).toBeNull();
  });

  it("warns and returns null when user and settings counts do not match", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    expect(
      getFieldDifferences(
        "paginglimit",
        [...systemusers, { systemuserId: "user-3", fullname: "Katherine Johnson" }],
        usersettings({ paginglimit: 25 }, { paginglimit: 100 }),
      ),
    ).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      "Mismatch between systemusers and allUsersettings lengths",
    );

    warn.mockRestore();
  });

  it("returns null if all values match and returns user/value pairs otherwise", () => {
    expect(
      getFieldDifferences("paginglimit", systemusers, usersettings({ paginglimit: 50 }, { paginglimit: 50 })),
    ).toBeNull();

    expect(
      getFieldDifferences("paginglimit", systemusers, usersettings({ paginglimit: 25 }, { paginglimit: 100 })),
    ).toEqual([
      { user: systemusers[0], value: 25 },
      { user: systemusers[1], value: 100 },
    ]);
  });

  it("ignores a missing user entry and returns null if no user can be paired", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const usersWithHole = [
      systemusers[0],
      undefined,
      { systemuserId: "user-3", fullname: "Katherine Johnson" },
    ] as unknown as Systemuser[];

    expect(
      getFieldDifferences(
        "paginglimit",
        usersWithHole,
        usersettings(
          { paginglimit: 25 },
          { paginglimit: 100 },
          { paginglimit: 75 },
        ),
      ),
    ).toEqual([
      { user: systemusers[0], value: 25 },
      { user: usersWithHole[2], value: 75 },
    ]);
    expect(error).toHaveBeenCalledWith("User not found at index", 1);
    expect(
      getFieldDifferences(
        "paginglimit",
        [undefined, undefined, undefined] as unknown as Systemuser[],
        usersettings(
          { paginglimit: 25 },
          { paginglimit: 100 },
          { paginglimit: 75 },
        ),
      ),
    ).toBeNull();

    error.mockRestore();
  });
});
