import type { JSXElement } from "@fluentui/react-components";
import {
  makeStyles,
  useId,
  SearchBox,
  SearchBoxChangeEvent,
  Combobox,
  Option,
  ComboboxProps,
} from "@fluentui/react-components";
import { Businessunit } from "../types/businessunit";
import { useMemo } from "react";

export interface IFilterProps {
  businessunits: Businessunit[];
  onTextFilterChanged: (searchText: string) => void;
  onBusinessunitFilterChanged: (businessunitId: string) => void;
}

export const Filter = (props: IFilterProps): JSXElement => {
  const searchInputId = useId("search-input");
  const businessunitDropdownId = useId("businessunit-dropdown");

  // Sort business units alphabetically
  const sortedBusinessunits = useMemo(() => {
    return [...props.businessunits].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [props.businessunits]);

  const onTextFilterChange = (
    _event: SearchBoxChangeEvent,
    data: { value: string }
  ) => {
    props.onTextFilterChanged(data.value);
  };

  const onBusinessunitFilterChange: ComboboxProps["onOptionSelect"] = (
    _event,
    data
  ) => {
    props.onBusinessunitFilterChanged(data.optionValue || "");
  };

  const useStyles = makeStyles({
    root: {
      display: "flex",
      gap: "20px",
      alignItems: "flex-end",
    },
    field: {
      display: "grid",
      justifyItems: "start",
      gap: "2px",
    },
    searchInput: {
      minWidth: "250px",
    },
    businessunitDropdown: {
      minWidth: "400px",
    },
  });

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        <label htmlFor={searchInputId}>Filter</label>
        <SearchBox
          id={searchInputId}
          placeholder="Search systemusers..."
          onChange={onTextFilterChange}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={businessunitDropdownId}>Business Unit</label>
        <Combobox
          id={businessunitDropdownId}
          placeholder="All business units"
          onOptionSelect={onBusinessunitFilterChange}
          className={styles.businessunitDropdown}
          freeform
        >
          <Option key="all" value="">
            All business units
          </Option>
          {sortedBusinessunits.map((bu) => (
            <Option key={bu.businessunitid} value={bu.businessunitid}>
              {bu.name}
            </Option>
          ))}
        </Combobox>
      </div>
    </div>
  );
};
