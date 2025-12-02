import React from "react";
import { useUsersettingsStyles } from "./styles";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Section wrapper for grouping related settings
 */
export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  const styles = useUsersettingsStyles();

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      <div className={styles.fieldGroup}>{children}</div>
    </div>
  );
};
