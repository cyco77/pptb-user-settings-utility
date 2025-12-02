import { makeStyles, tokens } from "@fluentui/react-components";

export const useUsersettingsStyles = makeStyles({
  section: {
    marginBottom: tokens.spacingVerticalXL,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
    color: tokens.colorBrandForeground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingBottom: tokens.spacingVerticalXS,
  },
  fieldGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalS,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
  },
  fieldLabel: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  fieldValue: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
    wordBreak: "break-word",
  },
  emptyValue: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground4,
    fontStyle: "italic",
  },
  loadingMessage: {
    textAlign: "center",
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
  fieldLabelWithInfo: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  infoIcon: {
    color: tokens.colorBrandForeground1,
    cursor: "pointer",
  },
  tooltipContent: {
    minWidth: "300px",
    maxWidth: "800px",
    padding: tokens.spacingVerticalS,
  },
  tooltipHeader: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalXS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: tokens.fontSizeBase300,
  },
  tooltipItem: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalXS,
    fontSize: tokens.fontSizeBase200,
  },
  tooltipUserName: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    whiteSpace: "nowrap",
  },
  tooltipValue: {
    color: tokens.colorNeutralForeground2,
    whiteSpace: "nowrap",
  },
});
