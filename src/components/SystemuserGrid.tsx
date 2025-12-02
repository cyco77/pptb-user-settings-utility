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
} from "@fluentui/react-components";
import { Systemuser } from "../types/systemuser";

interface ISystemuserGridProps {
  systemusers: Systemuser[];
  onSelectionChange: (systemusers: Systemuser[]) => void;
}

export const SystemuserGrid: React.FC<ISystemuserGridProps> = ({
  systemusers,
  onSelectionChange,
}) => {
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
        return <TableCellLayout>{item.fullname}</TableCellLayout>;
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
          <TableCellLayout>{item.internalemailaddress || "-"}</TableCellLayout>
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
          <TableCellLayout>{item.businessunitname || "-"}</TableCellLayout>
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
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Systemuser>>
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
