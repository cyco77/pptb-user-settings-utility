import React from "react";
import {
  DataGrid,
  DataGridBody,
  DataGridRow,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  makeStyles,
} from "@fluentui/react-components";
import { Systemuser } from "../types/systemuser";

const useStyles = makeStyles({
  grid: {
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexShrink: 0,
  },
  body: {
    flex: 1,
    overflowY: "auto",
    minHeight: 0,
  },
  cellStyles: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
});

interface ISystemuserGridProps {
  systemusers: Systemuser[];
  onSelectionChange: (systemusers: Systemuser[]) => void;
}

export const SystemuserGrid: React.FC<ISystemuserGridProps> = ({
  systemusers,
  onSelectionChange,
}) => {
  const styles = useStyles();
  const columns: TableColumnDefinition<Systemuser>[] = [
    createTableColumn<Systemuser>({
      columnId: "fullname",
      compare: (a, b) => {
        return a.fullname.localeCompare(b.fullname);
      },
      renderHeaderCell: () => {
        return "Full Name";
      },
      renderCell: (item) => {
        return (
          <span title={item.fullname || "-"} className={styles.cellStyles}>
            {item.fullname}
          </span>
        );
      },
    }),
    createTableColumn<Systemuser>({
      columnId: "email",
      compare: (a, b) => {
        return (a.internalemailaddress || "").localeCompare(
          b.internalemailaddress || ""
        );
      },
      renderHeaderCell: () => {
        return "Email";
      },
      renderCell: (item) => {
        return (
          <span
            title={item.internalemailaddress || "-"}
            className={styles.cellStyles}
          >
            {item.internalemailaddress || "-"}
          </span>
        );
      },
    }),
    createTableColumn<Systemuser>({
      columnId: "businessunit",
      compare: (a, b) => {
        return (a.businessunitname || "").localeCompare(
          b.businessunitname || ""
        );
      },
      renderHeaderCell: () => {
        return "Business Unit";
      },
      renderCell: (item) => {
        return (
          <span
            title={item.businessunitname || "-"}
            className={styles.cellStyles}
          >
            {item.businessunitname || "-"}
          </span>
        );
      },
    }),
    createTableColumn<Systemuser>({
      columnId: "systemuserid",
      compare: (a, b) => {
        return a.systemuserId.localeCompare(b.systemuserId);
      },
      renderHeaderCell: () => {
        return "System User ID";
      },
      renderCell: (item) => {
        return (
          <span title={item.systemuserId} className={styles.cellStyles}>
            {item.systemuserId}
          </span>
        );
      },
    }),
  ];

  return (
    <DataGrid
      items={systemusers}
      columns={columns}
      sortable
      selectionMode="multiselect"
      getRowId={(item) => item.systemuserId}
      defaultSortState={{
        sortColumn: "fullname",
        sortDirection: "ascending",
      }}
      onSelectionChange={(_e, data) => {
        const selectedUsers = systemusers.filter((user) =>
          data.selectedItems.has(user.systemuserId)
        );
        onSelectionChange(selectedUsers);
      }}
      className={styles.grid}
    >
      <DataGridHeader className={styles.header}>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Systemuser> className={styles.body}>
        {({ item, rowId }) => (
          <DataGridRow<Systemuser> key={rowId}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};
