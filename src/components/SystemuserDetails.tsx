import React, { useState, useEffect, useCallback } from "react";
import {
  makeStyles,
  tokens,
  Button,
  Spinner,
} from "@fluentui/react-components";
import { SaveRegular } from "@fluentui/react-icons";
import { Systemuser } from "../types/systemuser";
import { Usersettings } from "../types/usersettings";
import { SitemapData } from "../types/sitemap";
import { Timezone } from "../types/timezone";
import { Language } from "../types/language";
import { Format } from "../types/format";
import { Dashboard } from "../types/dashboard";
import { Currency } from "../types/currency";
import { PendingChangesMap } from "../types/pendingChanges";
import {
  loadUsersettingsBySystemuserId,
  updateMultipleUsersettings,
} from "../services/dataverseService";
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  changesCount: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
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
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChangesMap>(
    new Map()
  );

  // Count total pending changes across all users
  const totalChangesCount = Array.from(pendingChanges.values()).reduce(
    (sum, userChanges) => sum + userChanges.changes.size,
    0
  );

  // Reset pending changes when selection changes
  useEffect(() => {
    setPendingChanges(new Map());
    if (systemusers.length > 0) {
      loadUsersettingsData(systemusers);
    } else {
      setUsersettings(null);
      setAllUsersettings([]);
      setValidSystemusers([]);
    }
  }, [systemusers]);

  // Handle field change - track changes for all selected users
  const handleFieldChange = useCallback(
    (fieldName: keyof Usersettings, newValue: any) => {
      setPendingChanges((prev) => {
        const updated = new Map(prev);

        // Apply change to all valid selected users
        validSystemusers.forEach((user) => {
          let userChanges = updated.get(user.systemuserId);

          if (!userChanges) {
            userChanges = {
              systemuserid: user.systemuserId,
              userFullname: user.fullname,
              changes: new Map(),
            };
            updated.set(user.systemuserId, userChanges);
          }

          // Set the change (or remove if undefined which means "no change")
          if (newValue === undefined) {
            userChanges.changes.delete(fieldName);
            // Remove user entry if no changes left
            if (userChanges.changes.size === 0) {
              updated.delete(user.systemuserId);
            }
          } else {
            userChanges.changes.set(fieldName, newValue);
          }
        });

        return updated;
      });
    },
    [validSystemusers]
  );

  // Save all pending changes
  const handleSave = async () => {
    if (pendingChanges.size === 0) return;

    setIsSaving(true);
    try {
      const changesArray = Array.from(pendingChanges.values());

      const result = await updateMultipleUsersettings(changesArray);

      if (result.failed.length === 0) {
        await window.toolboxAPI.utils.showNotification({
          title: "Success",
          body: `Updated settings for ${result.successful.length} user(s)`,
          type: "success",
          duration: 3000,
        });
        // Clear pending changes after successful save
        setPendingChanges(new Map());
        // Reload user settings to reflect changes
        await loadUsersettingsData(systemusers);
      } else {
        const failedNames = result.failed.map((f) => f.userName).join(", ");
        await window.toolboxAPI.utils.showNotification({
          title: "Partial Success",
          body: `Updated ${result.successful.length} user(s). Failed: ${failedNames}`,
          type: "warning",
          duration: 5000,
        });
      }
    } catch (error) {
      await window.toolboxAPI.utils.showNotification({
        title: "Error",
        body: `Failed to save changes: ${(error as Error).message}`,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

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
            <div className={styles.headerLeft}>
              <div className={styles.title}>
                {systemusers.length === 1
                  ? systemusers[0].fullname
                  : `${systemusers.length} users selected`}
              </div>
              {totalChangesCount > 0 && (
                <div className={styles.changesCount}>
                  {totalChangesCount} pending change
                  {totalChangesCount !== 1 ? "s" : ""}
                </div>
              )}
            </div>
            <Button
              appearance="primary"
              icon={isSaving ? <Spinner size="tiny" /> : <SaveRegular />}
              disabled={totalChangesCount === 0 || isSaving}
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
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
              onFieldChange={handleFieldChange}
            />
          </div>
        </>
      )}
    </div>
  );
};
