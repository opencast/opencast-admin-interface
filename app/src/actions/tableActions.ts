/**
 * This file contains all redux actions that can be executed on the table
 */

// Constants of of actions types concerning table and its management
export const LOAD_RESOURCE_INTO_TABLE = "LOAD_RESOURCE_INTO_TABLE";
export const SORT_TABLE = "SORT_TABLE";
export const SELECT_ROW = "SELECT_ROW";
export const SELECT_ALL = "SELECT_ALL";
export const DESELECT_ALL = "DESELECT_ALL";
export const RESET_SORT_TABLE = "RESET_SORT_TABLE";
export const REVERSE_TABLE = "REVERSE_TABLE";
export const SET_SORT_BY = "SET_SORT_BY";
export const LOAD_COLUMNS = "LOAD_COLUMNS";

// Constants of of actions types concerning pagination
export const CREATE_PAGE = "CREATE_PAGE";
export const UPDATE_PAGESIZE = "UPDATE_PAGESIZE";
export const SET_PAGES = "UPDATE_PAGES";
export const SET_TOTAL_ITEMS = "SET_TOTAL_ITEMS";
export const SET_OFFSET = "SET_OFFSET";
export const SET_DIRECT_ACCESSIBLE_PAGES = "SET_DIRECT_ACCESSIBLE_PAGES";
export const SET_PAGE_ACTIVE = "SET_PAGE_ACTIVE";

// Actions affecting table directly

export const loadResourceIntoTable = (tableData: any) => ({
    type: LOAD_RESOURCE_INTO_TABLE,
    payload: tableData
});

// @ts-expect-error TS(7006): Parameter 'columnData' implicitly has an 'any' typ... Remove this comment to see the full error message
export const loadColumns = (columnData) => ({
	type: LOAD_COLUMNS,
	payload: columnData,
});

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const selectRow = (id, selected) => ({
	type: SELECT_ROW,
	payload: { id, selected },
});

export const selectAll = () => ({
	type: SELECT_ALL,
});

export const deselectAll = () => ({
	type: DESELECT_ALL,
});

// @ts-expect-error TS(7006): Parameter 'order' implicitly has an 'any' type.
export const reverseTable = (order) => ({
	type: REVERSE_TABLE,
	payload: { order },
});

// @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type.
export const setSortBy = (column) => ({
	type: SET_SORT_BY,
	payload: { column },
});

// Actions affecting pagination of table

// @ts-expect-error TS(7006): Parameter 'page' implicitly has an 'any' type.
export const createPage = (page) => ({
	type: CREATE_PAGE,
	payload: page,
});

// @ts-expect-error TS(7006): Parameter 'limit' implicitly has an 'any' type.
export const updatePageSize = (limit) => ({
	type: UPDATE_PAGESIZE,
	payload: { limit },
});

// @ts-expect-error TS(7006): Parameter 'pages' implicitly has an 'any' type.
export const setPages = (pages) => ({
	type: SET_PAGES,
	payload: { pages },
});

// @ts-expect-error TS(7006): Parameter 'totalItems' implicitly has an 'any' typ... Remove this comment to see the full error message
export const setTotalItems = (totalItems) => ({
	type: SET_TOTAL_ITEMS,
	payload: { totalItems },
});

// @ts-expect-error TS(7006): Parameter 'offset' implicitly has an 'any' type.
export const setOffset = (offset) => ({
	type: SET_OFFSET,
	payload: { offset },
});

// @ts-expect-error TS(7006): Parameter 'directAccessible' implicitly has an 'an... Remove this comment to see the full error message
export const setDirectAccessiblePages = (directAccessible) => ({
	type: SET_DIRECT_ACCESSIBLE_PAGES,
	payload: { directAccessible },
});

// @ts-expect-error TS(7006): Parameter 'pageNumber' implicitly has an 'any' typ... Remove this comment to see the full error message
export const setPageActive = (pageNumber) => ({
	type: SET_PAGE_ACTIVE,
	payload: { pageNumber },
});
