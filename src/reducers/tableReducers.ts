import {
	CREATE_PAGE,
	DESELECT_ALL,
	LOAD_COLUMNS,
	LOAD_RESOURCE_INTO_TABLE,
	REVERSE_TABLE,
	SELECT_ALL,
	SELECT_ROW,
	SET_DIRECT_ACCESSIBLE_PAGES,
	SET_OFFSET,
	SET_PAGE_ACTIVE,
	SET_PAGES,
	SET_SORT_BY,
	SET_TOTAL_ITEMS,
	UPDATE_PAGESIZE,
} from "../actions/tableActions";

/*
Overview of the structure of the data in arrays in state
const pages = [{
  active: false,
  label: "",
  number: 1
}, ...]

const rows = [{
    id: 1,
    data: [{for each column a value}]
}, ...]

const columns = [{
    style: "",
    deactivated: true,
    name: "",
    sortable: false,
    label: "",
    translate: false,
    template: ""
}, ...]
 */

/**
 * This file contains redux reducer for actions affecting the state of table
 */

// Initial state of table in redux store
const initialState = {
	loading: false,
	multiSelect: false,
	resource: "",
	pages: [],
	columns: [],
	sortBy: "date",
	predicate: "",
	reverse: "ASC",
	rows: [],
	maxLabel: "",
	pagination: {
		limit: 10,
		offset: 0,
		totalItems: 0,
		directAccessibleNo: 3,
	},
};

// Reducer for table
// @ts-expect-error TS(7006): Parameter 'action' implicitly has an 'any' type.
const table = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case LOAD_RESOURCE_INTO_TABLE: {
			const {
				multiSelect,
				columns,
				resource,
				pages,
				rows,
				sortBy,
				reverse,
				totalItems,
			} = payload;
			return {
				...state,
				multiSelect: multiSelect,
				columns: columns,
				resource: resource,
				rows: rows,
				pages: pages,
				sortBy: sortBy,
				reverse: reverse,
				pagination: {
					...state.pagination,
					totalItems: totalItems,
				},
			};
		}
		case LOAD_COLUMNS: {
			const { columns } = payload;
			return {
				...state,
				columns: columns,
			};
		}
		case SELECT_ROW: {
			const { id } = payload;
			return {
				...state,
				rows: state.rows.map((row) => {
// @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
					if (row.id === id) {
						return {
// @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
							...row,
// @ts-expect-error TS(2339): Property 'selected' does not exist on type 'never'... Remove this comment to see the full error message
							selected: !row.selected,
						};
					}
					return row;
				}),
			};
		}
		case SELECT_ALL: {
			return {
				...state,
				rows: state.rows.map((row) => {
					return {
// @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
						...row,
						selected: true,
					};
				}),
			};
		}
		case DESELECT_ALL: {
			return {
				...state,
				rows: state.rows.map((row) => {
					return {
// @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
						...row,
						selected: false,
					};
				}),
			};
		}
		case REVERSE_TABLE: {
			const { order } = payload;
			return {
				...state,
				reverse: order,
			};
		}
		case SET_SORT_BY: {
			const { column } = payload;
			return {
				...state,
				sortBy: column,
			};
		}
		case CREATE_PAGE: {
			const { page } = payload;
			return {
				...state,
				pages: state.pages.concat(page),
			};
		}
		case UPDATE_PAGESIZE: {
			const { limit } = payload;
			return {
				...state,
				pagination: {
					...state.pagination,
					limit: limit,
				},
			};
		}
		case SET_PAGES: {
			const { pages } = payload;
			return {
				...state,
				pages: pages,
			};
		}
		case SET_TOTAL_ITEMS: {
			const { totalItems } = payload;
			return {
				...state,
				pagination: {
					...state.pagination,
					totalItems: totalItems,
				},
			};
		}
		case SET_OFFSET: {
			const { offset } = payload;
			return {
				...state,
				pagination: {
					...state.pagination,
					offset: offset,
				},
			};
		}
		case SET_DIRECT_ACCESSIBLE_PAGES: {
			const { directAccessible } = payload;
			return {
				...state,
				pagination: {
					...state.pagination,
					directAccessibleNo: directAccessible,
				},
			};
		}
		case SET_PAGE_ACTIVE: {
			const { pageNumber } = payload;
			return {
				...state,
				pages: state.pages.map((page) => {
// @ts-expect-error TS(2339): Property 'number' does not exist on type 'never'.
					if (page.number === pageNumber) {
						return {
// @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
							...page,
							active: true,
						};
					} else {
						return {
// @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
							...page,
							active: false,
						};
					}
				}),
			};
		}
		default:
			return state;
	}
};

export default table;
