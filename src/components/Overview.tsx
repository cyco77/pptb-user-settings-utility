import React, { useState, useCallback, useEffect } from "react";

import { makeStyles, Spinner, tokens } from "@fluentui/react-components";
import { Systemuser } from "../types/systemuser";
import { SitemapData } from "../types/sitemap";
import { Businessunit } from "../types/businessunit";
import { Timezone } from "../types/timezone";
import { Language } from "../types/language";
import { Format } from "../types/format";
import { Dashboard } from "../types/dashboard";
import { Currency } from "../types/currency";
import {
  loadSystemusers,
  loadSitemapData,
  loadBusinessunits,
  loadTimezones,
  loadLanguages,
  loadFormats,
  loadDashboards,
  loadCurrencies,
} from "../services/dataverseService";
import { Filter } from "./Filter";
import { SystemuserGrid } from "./SystemuserGrid";
import { SystemuserDetails } from "./SystemuserDetails";

interface IOverviewProps {
  connection: ToolBoxAPI.DataverseConnection | null;
}

export const Overview: React.FC<IOverviewProps> = ({ connection }) => {
  const [systemusers, setSystemusers] = useState<Systemuser[]>([]);
  const [selectedSystemusers, setSelectedSystemusers] = useState<Systemuser[]>(
    []
  );
  const [detailsPanelWidth, setDetailsPanelWidth] = useState(40);
  const [sitemapData, setSitemapData] = useState<SitemapData>({
    areas: [],
    subAreas: [],
  });
  const [businessunits, setBusinessunits] = useState<Businessunit[]>([]);
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [formats, setFormats] = useState<Format[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [textFilter, setTextFilter] = useState<string>("");
  const [businessunitFilter, setBusinessunitFilter] = useState<string>("");
  const [isLoadingSystemusers, setIsLoadingSystemusers] = useState(false);

  const handleSelectionChange = (users: Systemuser[]) => {
    setSelectedSystemusers(users);
  };

  const useStyles = makeStyles({
    mainContainer: {
      display: "flex",
      gap: "4px",
      height: "100%",
      minHeight: 0,
      minWidth: 0,
      overflow: "hidden",
    },
    leftPanel: {
      flex: "1 1 0",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minHeight: 0,
      minWidth: 0,
    },
    leftPanelFullWidth: {
      flex: "1 1 100%",
    },
    rightPanel: {
      flex: `0 0 ${detailsPanelWidth}%`,
      display: "flex",
      flexDirection: "column",
      borderLeft: `2px solid ${tokens.colorNeutralStroke1}`,
      borderRadius: tokens.borderRadiusMedium,
      padding: "16px 8px",
      overflow: "hidden",
      minHeight: 0,
      minWidth: 0,
    },
    resizeHandle: {
      flex: "0 0 8px",
      cursor: "col-resize",
      touchAction: "none",
      backgroundColor: "transparent",
      borderRadius: tokens.borderRadiusMedium,
      outlineStyle: "none",
      ":hover": {
        backgroundColor: tokens.colorNeutralBackground3,
      },
      ":focus-visible": {
        backgroundColor: tokens.colorNeutralBackground3,
        outline: `2px solid ${tokens.colorCompoundBrandStroke}`,
      },
    },
    filterContainer: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "12px",
      flexShrink: 0,
    },
    gridContainer: {
      flex: 1,
      overflowY: "auto",
      minHeight: 0,
    },
    buttonGroup: {
      display: "flex",
      gap: "8px",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
    },
  });

  const styles = useStyles();

  const resizeDetailsPanel = (clientX: number, container: HTMLElement) => {
    const { left, width } = container.getBoundingClientRect();
    if (width === 0) return;

    const nextWidth = ((left + width - clientX - 16) / width) * 100;
    setDetailsPanelWidth(Math.min(70, Math.max(25, nextWidth)));
  };

  const handleResizeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const adjustment = event.key === "ArrowLeft" ? 2 : -2;
    setDetailsPanelWidth((width) =>
      Math.min(70, Math.max(25, width + adjustment))
    );
  };

  useEffect(() => {
    const initialize = async () => {
      if (!connection) {
        return;
      }
      querySystemusers();
    };

    initialize();
  }, [connection]);

  const showNotification = useCallback(
    async (
      title: string,
      body: string,
      type: "success" | "info" | "warning" | "error"
    ) => {
      try {
        await window.toolboxAPI.utils.showNotification({
          title,
          body,
          type,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error showing notification:", error);
      }
    },
    []
  );

  const querySystemusers = useCallback(async () => {
    try {
      setSelectedSystemusers([]);
      setIsLoadingSystemusers(true);

      // Load languages first to determine preferred language for sitemap
      const languages = await loadLanguages();
      setLanguages(languages);

      // Determine preferred LCID: English (1033) if available, otherwise first language
      const englishLanguage = languages.find((lang) => lang.localeid === 1033);
      const preferredLcid = englishLanguage
        ? 1033
        : languages[0]?.localeid || undefined;

      console.log(
        `Using preferred language LCID for sitemap: ${preferredLcid}`
      );

      // Load remaining data in parallel, using preferred LCID for sitemap
      const [
        systemusers,
        sitemap,
        businessunits,
        timezones,
        formats,
        dashboards,
        currencies,
      ] = await Promise.all([
        loadSystemusers(),
        loadSitemapData(preferredLcid),
        loadBusinessunits(),
        loadTimezones(),
        loadFormats(),
        loadDashboards(),
        loadCurrencies(),
      ]);
      setSystemusers(systemusers);
      setSitemapData(sitemap);
      setBusinessunits(businessunits);
      setTimezones(timezones);
      setFormats(formats);
      setDashboards(dashboards);
      setCurrencies(currencies);
    } catch (error) {
      showNotification(
        "Error",
        `Failed to load data: ${(error as Error).message}`,
        "error"
      );
    } finally {
      setIsLoadingSystemusers(false);
    }
  }, [connection, showNotification]);

  const filteredSystemusers = React.useMemo(() => {
    let filtered = systemusers;

    // Apply business unit filter
    if (businessunitFilter) {
      filtered = filtered.filter(
        (user) => user.businessunitid === businessunitFilter
      );
    }

    // Apply text search filter
    if (textFilter) {
      const searchTerm = textFilter.toLowerCase();
      filtered = filtered.filter((user) => {
        return (
          user.fullname?.toLowerCase().includes(searchTerm) ||
          user.internalemailaddress?.toLowerCase().includes(searchTerm) ||
          user.businessunitname?.toLowerCase().includes(searchTerm)
        );
      });
    }

    return filtered;
  }, [systemusers, textFilter, businessunitFilter]);

  return (
    <div className={styles.mainContainer}>
      {isLoadingSystemusers ? (
        <div className={styles.loadingContainer}>
          <Spinner label="Loading systemusers..." />
        </div>
      ) : (
        <>
          <div
            className={`${styles.leftPanel} ${selectedSystemusers.length === 0 ? styles.leftPanelFullWidth : ""}`}
          >
            <div className={styles.filterContainer}>
              <Filter
                businessunits={businessunits}
                onTextFilterChanged={(searchText: string) => {
                  setTextFilter(searchText);
                }}
                onBusinessunitFilterChanged={(businessunitId: string) => {
                  setBusinessunitFilter(businessunitId);
                }}
              />
            </div>
            <div className={styles.gridContainer}>
              <SystemuserGrid
                systemusers={filteredSystemusers}
                onSelectionChange={handleSelectionChange}
              />
            </div>
          </div>
          {selectedSystemusers.length > 0 && (
            <>
              <div
                className={styles.resizeHandle}
                role="separator"
                aria-label="Resize user details panel"
                aria-orientation="vertical"
                aria-valuemin={25}
                aria-valuemax={70}
                aria-valuenow={Math.round(detailsPanelWidth)}
                tabIndex={0}
                onKeyDown={handleResizeKeyDown}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  resizeDetailsPanel(
                    event.clientX,
                    event.currentTarget.parentElement!
                  );
                }}
                onPointerMove={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    resizeDetailsPanel(
                      event.clientX,
                      event.currentTarget.parentElement!
                    );
                  }
                }}
              />
              <div className={styles.rightPanel}>
                <SystemuserDetails
                  systemusers={selectedSystemusers}
                  sitemapData={sitemapData}
                  timezones={timezones}
                  languages={languages}
                  formats={formats}
                  dashboards={dashboards}
                  currencies={currencies}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
