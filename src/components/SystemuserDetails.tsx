import React, { useState, useEffect } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { Systemuser } from "../types/systemuser";
import { Usersettings } from "../types/usersettings";
import { SitemapData } from "../types/sitemap";
import { Timezone } from "../types/timezone";
import { Language } from "../types/language";
import { Format } from "../types/format";
import { Dashboard } from "../types/dashboard";
import { Currency } from "../types/currency";
import { loadUsersettingsBySystemuserId } from "../services/dataverseService";
import { UsersettingsTab } from "./UsersettingsTab";

interface ISystemuserDetailsProps {
  systemusers: Systemuser[];
  sitemapData: SitemapData;
  timezones: Timezone[];
  languages: Language[];
  formats: Format[];
  dashboards: Dashboard[];
  currencies: Currency[];
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
  },
  header: {
    paddingBottom: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  body: {
    flex: 1,
    minHeight: 0,
    overflow: "auto",
    paddingRight: tokens.spacingHorizontalS,
  },
  emptyState: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
  },
});

export const SystemuserDetails: React.FC<ISystemuserDetailsProps> = ({
  systemusers,
  sitemapData,
  timezones,
  languages,
  formats,
  dashboards,
  currencies,
}) => {
  const styles = useStyles();
  const [usersettings, setUsersettings] = useState<Usersettings | null>(null);
  const [allUsersettings, setAllUsersettings] = useState<Usersettings[]>([]);
  const [validSystemusers, setValidSystemusers] = useState<Systemuser[]>([]);
  const [isLoadingUsersettings, setIsLoadingUsersettings] = useState(false);

  useEffect(() => {
    if (systemusers.length > 0) {
      loadUsersettingsData(systemusers);
    } else {
      setUsersettings(null);
      setAllUsersettings([]);
      setValidSystemusers([]);
    }
  }, [systemusers]);

  const loadUsersettingsData = async (users: Systemuser[]) => {
    setIsLoadingUsersettings(true);
    try {
      console.log("Loading settings for users:", users);

      // Load settings for all selected users
      const settingsPromises = users.map((user) =>
        loadUsersettingsBySystemuserId(user.systemuserId).catch((error) => {
          console.error(
            "Error loading settings for user",
            user.fullname,
            error
          );
          return null;
        })
      );

      const settingsArray = await Promise.all(settingsPromises);
      console.log("Loaded settings array:", settingsArray);

      // Create arrays of valid user-settings pairs
      const validPairs: Array<{ user: Systemuser; settings: Usersettings }> =
        [];
      settingsArray.forEach((settings, index) => {
        if (settings !== null) {
          validPairs.push({ user: users[index], settings });
        }
      });

      console.log("Valid pairs:", validPairs);

      if (validPairs.length === 0) {
        // No valid settings found
        setUsersettings(null);
        setAllUsersettings([]);
        setValidSystemusers([]);
        return;
      }

      // Extract separate arrays maintaining index correspondence
      const validUsers = validPairs.map((p) => p.user);
      const validSettings = validPairs.map((p) => p.settings);

      console.log("Valid users:", validUsers);
      console.log("Valid settings:", validSettings);

      // Store for tooltip display
      setValidSystemusers(validUsers);
      setAllUsersettings(validSettings);

      // Merge settings: if all users have same value, use it; otherwise undefined ("No change")
      const mergedSettings = mergeUserSettings(validSettings);
      console.log("Merged settings:", mergedSettings);
      setUsersettings(mergedSettings);
    } catch (error) {
      console.error("Error loading usersettings:", error);
    } finally {
      setIsLoadingUsersettings(false);
    }
  };

  const mergeUserSettings = (settingsArray: Usersettings[]): Usersettings => {
    if (settingsArray.length === 0) {
      return {} as Usersettings;
    }

    if (settingsArray.length === 1) {
      // Single user selected: return their settings as-is
      return settingsArray[0];
    }

    // Multiple users: merge settings
    const merged: any = {
      systemuserid: settingsArray[0].systemuserid, // Use first user's id as reference
    };

    // Get all keys from first settings object
    const keys = Object.keys(settingsArray[0]) as (keyof Usersettings)[];

    for (const key of keys) {
      if (key === "systemuserid") continue; // Skip systemuserid

      // Check if all users have the same value for this field
      const firstValue = settingsArray[0][key];
      const allSame = settingsArray.every((settings) => {
        const currentValue = settings[key];
        // Handle null/undefined comparison
        if (currentValue === firstValue) return true;
        if (currentValue == null && firstValue == null) return true;
        return false;
      });

      // If all same, use the value; otherwise undefined ("No change")
      merged[key] = allSame ? firstValue : undefined;
    }

    return merged as Usersettings;
  };

  return (
    <div className={styles.container}>
      {systemusers.length === 0 ? (
        <div className={styles.emptyState}>
          Select one or more users to view their settings
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.title}>
              {systemusers.length === 1
                ? systemusers[0].fullname
                : `${systemusers.length} users selected`}
            </div>
          </div>
          <div className={styles.body}>
            <UsersettingsTab
              usersettings={usersettings}
              isLoading={isLoadingUsersettings}
              sitemapData={sitemapData}
              timezones={timezones}
              languages={languages}
              formats={formats}
              systemusers={validSystemusers}
              allUsersettings={allUsersettings}
              dashboards={dashboards}
              currencies={currencies}
            />
          </div>
        </>
      )}
    </div>
  );
};
