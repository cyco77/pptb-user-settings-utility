import React, { useCallback, useEffect, useState } from "react";
import {
  FluentProvider,
  Title3,
  Text,
  makeStyles,
  tokens,
  teamsDarkTheme,
  teamsLightTheme,
  Theme,
} from "@fluentui/react-components";
import {
  useConnection,
  useEventLog,
  useToolboxEvents,
} from "./hooks/useToolboxAPI";

import iconImage from "../icon/usersettings-utility_small.png";
import { Overview } from "./components/Overview";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    padding: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
  headerIcon: {
    height: "50px",
    objectFit: "contain",
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: tokens.spacingVerticalL,
    display: "flex",
    flexDirection: "column",
  },
});

function App() {
  const { connection, isLoading, refreshConnection } = useConnection();
  const { logs, addLog, clearLogs } = useEventLog();
  const [theme, setTheme] = useState<Theme>(teamsDarkTheme);
  const styles = useStyles();

  // Handle platform events
  const handleEvent = useCallback(
    (event: string, _data: any) => {
      switch (event) {
        case "connection:updated":
        case "connection:created":
          refreshConnection();
          break;

        case "connection:deleted":
          refreshConnection();
          break;

        case "terminal:output":
        case "terminal:command:completed":
        case "terminal:error":
          // Terminal events handled by dedicated components
          break;
        case "settings:updated":
          // Settings updated, could refresh settings if needed
          updateThemeBasedOnSettings();
          break;
      }
    },
    [refreshConnection]
  );

  async function updateThemeBasedOnSettings() {
    const theme = await window.toolboxAPI.utils.getCurrentTheme();
    if (theme === "dark") {
      setTheme(teamsDarkTheme);
    } else {
      setTheme(teamsLightTheme);
    }
  }

  useToolboxEvents(handleEvent);

  // Add initial log (run only once on mount)
  useEffect(() => {
    addLog("React Sample Tool initialized", "success");
  }, [addLog]);

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
        addLog(`Notification shown: ${title} - ${body}`, type);
      } catch (error) {
        addLog(
          `Error showing notification: ${(error as Error).message}`,
          "error"
        );
      }
    },
    [addLog]
  );

  return (
    <FluentProvider theme={theme} className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <img
            src={iconImage}
            alt="User Settings Utility"
            className={styles.headerIcon}
          />
          <Title3>User Settings Utility</Title3>
          <Text className={styles.subtitle}>
            Your tool to update user settings in Dataverse
          </Text>
        </div>
      </div>
      <div className={styles.content}>
        <Overview connection={connection} />
      </div>
    </FluentProvider>
  );
}

export default App;
