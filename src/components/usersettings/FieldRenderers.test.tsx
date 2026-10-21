import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { useFieldRenderers, type FieldRendererProps } from "./FieldRenderers";
import type { Systemuser } from "../../types/systemuser";
import type { Usersettings } from "../../types/usersettings";

const formatContext: FieldRendererProps["formatContext"] = {
  timezones: [],
  languages: [],
  formats: [],
  sitemapData: { areas: [], subAreas: [] },
  dashboards: [],
  currencies: [],
};

interface HarnessProps {
  initial: Usersettings | null;
  allUsersettings: Usersettings[];
  systemusers?: Systemuser[];
  onFieldChange?: FieldRendererProps["onFieldChange"];
}

const RendererHarness: React.FC<HarnessProps> = ({
  initial,
  allUsersettings,
  systemusers = [],
  onFieldChange,
}) => {
  const [editedSettings, setEditedSettings] = useState(initial);
  const renderers = useFieldRenderers({
    allUsersettings,
    editedSettings,
    setEditedSettings,
    systemusers,
    formatContext,
    onFieldChange,
  });

  return (
    <>
      {renderers.renderTextField("Country prefix", "defaultcountrycode", true)}
      {renderers.renderTextField("Read-only user", "systemuserid")}
      {renderers.renderDropdown("Page size", "paginglimit", { 25: "25", 50: "50" })}
      {renderers.renderBooleanDropdown("Email credentials", "allowemailcredentials")}
      {renderers.renderCombobox(
        "Language",
        "uilanguageid",
        [{ id: 1033, label: "English" }],
        (item) => String(item.id),
        (item) => item.label,
        (value) => parseInt(value, 10),
      )}
      {renderers.renderCombobox(
        "Currency choice",
        "transactioncurrencyid",
        [{ id: "eur", label: "Euro" }],
        (item) => String(item.id),
        (item) => item.label,
      )}
      <div data-testid="plain-label">{renderers.renderLabelWithInfo("Plain label")}</div>
      <div data-testid="different-label">
        {renderers.renderLabelWithInfo("Different values", "paginglimit")}
      </div>
      <output data-testid="edited-settings">{JSON.stringify(editedSettings)}</output>
    </>
  );
};

describe("useFieldRenderers", () => {
  it("shows current text values and keeps non-editable fields read-only", () => {
    render(
      <RendererHarness
        initial={{ systemuserid: "user-1", defaultcountrycode: "+1" }}
        allUsersettings={[{ systemuserid: "user-1", defaultcountrycode: "+1" }]}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Country prefix" })).toHaveProperty("value", "+1");
    expect(screen.getByRole("textbox", { name: "Country prefix" })).toHaveProperty("readOnly", false);
    expect(screen.getByRole("textbox", { name: "Read-only user" })).toHaveProperty("readOnly", true);
    expect(screen.getByRole("textbox", { name: "Read-only user" })).toHaveProperty("value", "user-1");
  });

  it("updates controlled text fields and notifies the parent", () => {
    const onFieldChange = vi.fn();

    render(
      <RendererHarness
        initial={{ systemuserid: "user-1", defaultcountrycode: "+1" }}
        allUsersettings={[{ systemuserid: "user-1", defaultcountrycode: "+1" }]}
        onFieldChange={onFieldChange}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Country prefix" }), {
      target: { value: "+44" },
    });

    expect(screen.getByRole("textbox", { name: "Country prefix" })).toHaveProperty("value", "+44");
    expect(onFieldChange).toHaveBeenCalledWith("defaultcountrycode", "+44");
    expect(screen.getByTestId("edited-settings").textContent).toContain('"defaultcountrycode":"+44"');
  });

  it("shows no-change when selected values differ across users", () => {
    render(
      <RendererHarness
        initial={{ systemuserid: "bulk-edit" }}
        systemusers={[
          { systemuserId: "user-1", fullname: "Ada Lovelace" },
          { systemuserId: "user-2", fullname: "Grace Hopper" },
        ]}
        allUsersettings={[
          { systemuserid: "user-1", defaultcountrycode: "+1", paginglimit: 25 },
          { systemuserid: "user-2", defaultcountrycode: "+44", paginglimit: 50 },
        ]}
      />,
    );

    expect(screen.getByRole("textbox", { name: /^Country prefix/ })).toHaveProperty("value", "No change");
    expect(screen.getByRole("combobox", { name: /^Page size/ })).toHaveProperty("value", "No change");
  });

  it("updates dropdown and boolean fields and notifies the parent", () => {
    const onFieldChange = vi.fn();

    render(
      <RendererHarness
        initial={{
          systemuserid: "bulk-edit",
          paginglimit: 25,
          allowemailcredentials: true,
        }}
        allUsersettings={[
          {
            systemuserid: "user-1",
            paginglimit: 25,
            allowemailcredentials: true,
          },
        ]}
        onFieldChange={onFieldChange}
      />,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Page size" }));
    fireEvent.click(screen.getByRole("option", { name: "50" }));
    expect(onFieldChange).toHaveBeenCalledWith("paginglimit", 50);

    fireEvent.click(screen.getByRole("combobox", { name: "Email credentials" }));
    fireEvent.click(screen.getByRole("option", { name: "No" }));
    expect(onFieldChange).toHaveBeenCalledWith("allowemailcredentials", false);
    expect(screen.getByTestId("edited-settings").textContent).toContain('"allowemailcredentials":false');
  });

  it("handles missing edits, empty inputs, unknown option values, and optional callbacks", () => {
    render(
      <RendererHarness
        initial={null}
        allUsersettings={[{ systemuserid: "user-1" }]}
      />,
    );

    expect(screen.getByTestId("plain-label").textContent).toBe("Plain label");
    expect(screen.getByRole("textbox", { name: "Country prefix" })).toHaveProperty("value", "");

    fireEvent.change(screen.getByRole("textbox", { name: "Country prefix" }), {
      target: { value: "ignored" },
    });
    fireEvent.click(screen.getByRole("combobox", { name: "Page size" }));
    fireEvent.click(screen.getByRole("option", { name: "50" }));
    expect(screen.getByTestId("edited-settings").textContent).toBe("null");
  });

  it("shows raw unknown dropdown values and clears a choice when no change is selected", () => {
    const onFieldChange = vi.fn();

    render(
      <RendererHarness
        initial={{ systemuserid: "user-1", paginglimit: 999, allowemailcredentials: false }}
        allUsersettings={[{ systemuserid: "user-1", paginglimit: 999, allowemailcredentials: false }]}
        onFieldChange={onFieldChange}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Page size" })).toHaveProperty("value", "999");
    expect(screen.getByRole("combobox", { name: "Email credentials" })).toHaveProperty("value", "No");

    fireEvent.click(screen.getByRole("combobox", { name: "Page size" }));
    fireEvent.click(screen.getByRole("option", { name: "No change" }));
    expect(onFieldChange).toHaveBeenCalledWith("paginglimit", undefined);

    fireEvent.click(screen.getByRole("combobox", { name: "Email credentials" }));
    fireEvent.click(screen.getByRole("option", { name: "No change" }));
    expect(onFieldChange).toHaveBeenCalledWith("allowemailcredentials", undefined);
  });

  it("renders and selects lookup combobox values", () => {
    const onFieldChange = vi.fn();

    render(
      <RendererHarness
        initial={{ systemuserid: "user-1", uilanguageid: 1033 }}
        allUsersettings={[{ systemuserid: "user-1", uilanguageid: 1033 }]}
        onFieldChange={onFieldChange}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Language" })).toHaveProperty("value", "English");
    fireEvent.click(screen.getByRole("combobox", { name: "Language" }));
    fireEvent.click(screen.getByRole("option", { name: "English" }));
    expect(onFieldChange).toHaveBeenCalledWith("uilanguageid", 1033);
    expect(screen.getByTestId("edited-settings").textContent).toContain('"uilanguageid":1033');
  });

  it("uses raw values for unknown lookup entries and keeps string lookups intact", () => {
    const onFieldChange = vi.fn();

    render(
      <RendererHarness
        initial={{
          systemuserid: "user-1",
          uilanguageid: 9999,
          transactioncurrencyid: "eur",
        }}
        allUsersettings={[
          {
            systemuserid: "user-1",
            uilanguageid: 9999,
            transactioncurrencyid: "eur",
          },
        ]}
        onFieldChange={onFieldChange}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Language" })).toHaveProperty("value", "9999");
    expect(screen.getByRole("combobox", { name: "Currency choice" })).toHaveProperty("value", "Euro");

    fireEvent.click(screen.getByRole("combobox", { name: "Currency choice" }));
    fireEvent.click(screen.getByRole("option", { name: "Euro" }));
    expect(onFieldChange).toHaveBeenCalledWith("transactioncurrencyid", "eur");
  });

  it("adds difference info to labels when values diverge across users", () => {
    render(
      <RendererHarness
        initial={{ systemuserid: "bulk-edit" }}
        systemusers={[
          { systemuserId: "user-1", fullname: "Ada Lovelace" },
          { systemuserId: "user-2", fullname: "Grace Hopper" },
        ]}
        allUsersettings={[
          { systemuserid: "user-1", paginglimit: 25 },
          { systemuserid: "user-2", paginglimit: 50 },
        ]}
      />,
    );

    expect(screen.getByTestId("different-label").textContent).toBe("Different values");
    expect(screen.getByTestId("different-label").querySelector("svg")).not.toBeNull();
  });
});
