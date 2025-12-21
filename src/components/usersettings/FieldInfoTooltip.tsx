import React from "react";
import { Tooltip } from "@fluentui/react-components";
import { Info16Regular } from "@fluentui/react-icons";
import { Usersettings } from "../../types/usersettings";
import { Systemuser } from "../../types/systemuser";
import { getFieldDifferences } from "./fieldStateUtils";
import { formatFieldValue, FormatValueContext } from "./formatFieldValue";
import { useUsersettingsStyles } from "./styles";

interface FieldInfoTooltipProps {
  fieldKey: keyof Usersettings;
  systemusers: Systemuser[];
  allUsersettings: Usersettings[];
  formatContext: FormatValueContext;
}

/**
 * Info icon with tooltip showing different values across users
 */
export const FieldInfoTooltip: React.FC<FieldInfoTooltipProps> = ({
  fieldKey,
  systemusers,
  allUsersettings,
  formatContext,
}) => {
  const styles = useUsersettingsStyles();

  try {
    const differences = getFieldDifferences(
      fieldKey,
      systemusers,
      allUsersettings
    );
    if (!differences) return null;

    // Sort users by fullname with safety check
    const sortedDifferences = [...differences].sort((a, b) => {
      const nameA = a?.user?.fullname || "";
      const nameB = b?.user?.fullname || "";
      return nameA.localeCompare(nameB);
    });

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    return (
      <Tooltip
        withArrow
        content={{
          children: (
            <div className={styles.tooltipContent}>
              <div className={styles.tooltipHeader}>
                Different values for {systemusers?.length || 0} users
              </div>
              {sortedDifferences.map((item, index) => (
                <div key={index} className={styles.tooltipItem}>
                  <span className={styles.tooltipUserName}>
                    {item?.user?.fullname || "Unknown"}:
                  </span>
                  <span className={styles.tooltipValue}>
                    {formatFieldValue(item.value, fieldKey, formatContext)}
                  </span>
                </div>
              ))}
            </div>
          ),
          style: { maxWidth: "none" },
        }}
        relationship="label"
      >
        <span onClick={handleClick} onMouseDown={handleClick}>
          <Info16Regular className={styles.infoIcon} />
        </span>
      </Tooltip>
    );
  } catch (error) {
    console.error("Error rendering info icon for", fieldKey, error);
    return null;
  }
};
