import { createSelector } from "reselect";

/**
 * This file contains selectors regarding the table view
 */

export const getTableRows = (state: any) => state.table.rows;
export const getTableColumns = (state: any) => state.table.columns;
export const getTablePagination = (state: any) => state.table.pagination;
export const getTablePages = (state: any) => state.table.pages;
export const getTotalItems = (state: any) => state.table.pagination.totalItems;
export const getPageLimit = (state: any) => state.table.pagination.limit;
export const getPageOffset = (state: any) => state.table.pagination.offset;
export const getNumberDirectAccessiblePages = (state: any) => state.table.pagination.directAccessibleNo;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getResourceType = (state) => state.table.resource;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getTableSorting = (state) => state.table.sortBy;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getTableDirection = (state) => state.table.reverse;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getTable = (state) => state.table;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getDeactivatedColumns = (state) =>
// @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type.
	state.table.columns.filter((column) => column.deactivated);
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getActivatedColumns = (state) =>
// @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type.
	state.table.columns.filter((column) => !column.deactivated);

export const getSelectedRows = createSelector(getTableRows, (rows) =>
// @ts-expect-error TS(7006): Parameter 'row' implicitly has an 'any' type.
	rows.filter((row) => row.selected)
);
