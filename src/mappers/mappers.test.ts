import { describe, expect, it, vi } from "vitest";
import { mapBusinessunits } from "./businessunitMapper";
import { mapFormats } from "./formatMapper";
import { mapLanguages } from "./languageMapper";
import { mapSitemap } from "./sitemapMapper";
import { mapSystemusers } from "./systemuserMapper";
import { mapTimezones } from "./timezoneMapper";
import { mapUsersettings } from "./usersettingsMapper";

describe("Dataverse mappers", () => {
  it("maps user settings and OData formatted lookup names", () => {
    expect(
      mapUsersettings({
        systemuserid: "user-1",
        paginglimit: 75,
        allowemailcredentials: false,
        _createdby_value: "creator-1",
        "_createdby_value@OData.Community.Display.V1.FormattedValue": "Ada Lovelace",
        _modifiedby_value: "modifier-1",
        "_modifiedby_value@OData.Community.Display.V1.FormattedValue": "Grace Hopper",
        businessunitid: "bu-1",
        defaultdashboardid: "dashboard-1",
      }),
    ).toMatchObject({
      systemuserid: "user-1",
      paginglimit: 75,
      allowemailcredentials: false,
      createdby: "creator-1",
      createdbyname: "Ada Lovelace",
      modifiedby: "modifier-1",
      modifiedbyname: "Grace Hopper",
      businessunitid: "bu-1",
      defaultdashboardid: "dashboard-1",
      businessunitidname: undefined,
      defaultdashboardidname: undefined,
    });
  });

  it("returns null for missing user settings data", () => {
    expect(mapUsersettings(null as never)).toBeNull();
  });

  it("maps valid timezones and drops records with invalid field types", () => {
    expect(
      mapTimezones([
        { timezonecode: 4, userinterfacename: "Pacific Standard Time" },
        { timezonecode: "4", userinterfacename: "Invalid code" },
        { timezonecode: 5, userinterfacename: 10 },
      ]),
    ).toEqual([{ timezonecode: 4, userinterfacename: "Pacific Standard Time" }]);
  });

  it("maps valid business units and ignores invalid records", () => {
    expect(
      mapBusinessunits([
        { businessunitid: "bu-1", name: "Sales" },
        { businessunitid: "bu-2", name: 42 },
        { businessunitid: null, name: "Invalid" },
      ]),
    ).toEqual([{ businessunitid: "bu-1", name: "Sales" }]);
  });

  it("maps system users including optional email and business unit labels", () => {
    expect(
      mapSystemusers([
        {
          systemuserid: "user-1",
          fullname: "Ada Lovelace",
          internalemailaddress: "ada@example.com",
          _businessunitid_value: "bu-1",
          "_businessunitid_value@OData.Community.Display.V1.FormattedValue": "Research",
        },
        { systemuserid: 7, fullname: "Invalid user" },
      ]),
    ).toEqual([
      {
        systemuserId: "user-1",
        fullname: "Ada Lovelace",
        internalemailaddress: "ada@example.com",
        businessunitid: "bu-1",
        businessunitname: "Research",
      },
    ]);
  });

  it("maps languages, normalizes empty regions, and keeps the first duplicate locale", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    expect(
      mapLanguages([
        { languagelocaleid: "en-us", localeid: 1033, language: "English", region: "US" },
        { languagelocaleid: "en-gb", localeid: 1033, language: "English", region: "UK" },
        { languagelocaleid: "de-de", localeid: 1031, language: "German", region: "" },
        { languagelocaleid: "", localeid: 1036, language: "French" },
      ]),
    ).toEqual([
      { languagelocaleid: "en-us", localeid: 1033, language: "English", region: "US" },
      { languagelocaleid: "de-de", localeid: 1031, language: "German", region: undefined },
    ]);

    log.mockRestore();
  });

  it("maps formats, normalizes empty regions, and keeps the first duplicate locale", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    expect(
      mapFormats([
        { localeid: 1033, language: "English", region: "United States" },
        { localeid: 1033, language: "English", region: "United Kingdom" },
        { localeid: 1031, language: "German", region: "" },
        { localeid: 0, language: "Invalid" },
      ]),
    ).toEqual([
      { localeid: 1033, language: "English", region: "United States" },
      { localeid: 1031, language: "German", region: undefined },
    ]);

    log.mockRestore();
  });
});

describe("mapSitemap", () => {
  it("returns empty collections when no XML is supplied", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    expect(mapSitemap("")).toEqual({ areas: [], subAreas: [] });

    log.mockRestore();
  });

  it("maps areas and subareas with localized titles and default fallbacks", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const xml = `
      <SiteMap>
        <Area Id="sales" Title="Sales default">
          <Titles>
            <Title LCID="1031" Title="Vertrieb" />
            <Title LCID="1033" Title="Sales localized" />
          </Titles>
          <Group Id="sales-group">
            <SubArea Id="accounts" Title="Accounts default">
              <Titles><Title LCID="1033" Title="Accounts localized" /></Titles>
            </SubArea>
            <SubArea Id="contacts" ResourceId="contacts.resource" />
          </Group>
        </Area>
        <Area ResourceId="settings.resource" />
        <Area Id="fallback" />
        <Area Title="No id" />
      </SiteMap>`;

    expect(mapSitemap(xml, 1033)).toEqual({
      areas: [
        { id: "sales", title: "Sales localized" },
        { id: "fallback", title: "fallback" },
      ],
      subAreas: [
        { id: "accounts", title: "Accounts localized", areaId: "sales" },
        { id: "contacts", title: "contacts.resource", areaId: "sales" },
      ],
    });

    expect(mapSitemap(xml)).toEqual({
      areas: [
        { id: "sales", title: "Sales default" },
        { id: "fallback", title: "fallback" },
      ],
      subAreas: [
        { id: "accounts", title: "Accounts default", areaId: "sales" },
        { id: "contacts", title: "contacts.resource", areaId: "sales" },
      ],
    });

    log.mockRestore();
  });

  it("uses IDs when empty localized/default titles are supplied", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const xml = `<SiteMap>
      <Area Id="area">
        <Titles><Title LCID="1033" Title="" /></Titles>
        <Group><SubArea Id="page"><Titles><Title LCID="1033" Title="" /></Titles></SubArea></Group>
      </Area>
    </SiteMap>`;

    expect(mapSitemap(xml, 1033)).toEqual({
      areas: [{ id: "area", title: "area" }],
      subAreas: [{ id: "page", title: "page", areaId: "area" }],
    });

    log.mockRestore();
  });

  it("falls back to an area or subarea ID when titles and resource IDs are missing", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const xml = `<SiteMap><Area Id="root"><Group><SubArea Id="child" /></Group></Area></SiteMap>`;

    expect(mapSitemap(xml)).toEqual({
      areas: [{ id: "root", title: "root" }],
      subAreas: [{ id: "child", title: "child", areaId: "root" }],
    });

    log.mockRestore();
  });

  it("ignores nodes without IDs and subareas outside an identified area", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const xml = `<SiteMap>
      <Area Title="No area id"><Group><SubArea Id="orphan" Title="Orphan" /></Group></Area>
      <Area Id="valid" Title="Valid">
        <Group><SubArea Title="Missing id" /></Group>
      </Area>
    </SiteMap>`;

    expect(mapSitemap(xml)).toEqual({
      areas: [{ id: "valid", title: "Valid" }],
      subAreas: [],
    });

    log.mockRestore();
  });

  it("returns no entries for malformed XML and catches parser failures", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const originalParser = globalThis.DOMParser;

    expect(mapSitemap("<SiteMap><Area Id=\"broken\"></SiteMap>")).toEqual({
      areas: [],
      subAreas: [],
    });

    vi.stubGlobal(
      "DOMParser",
      class {
        parseFromString(): never {
          throw new Error("parser unavailable");
        }
      },
    );
    expect(mapSitemap("<SiteMap />")).toEqual({ areas: [], subAreas: [] });
    expect(error).toHaveBeenCalledWith("Error parsing sitemap XML:", expect.any(Error));

    vi.stubGlobal("DOMParser", originalParser);
    vi.unstubAllGlobals();
    error.mockRestore();
  });
});
