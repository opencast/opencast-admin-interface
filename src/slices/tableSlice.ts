import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { prepareAccessPolicyRulesForPost } from '../utils/resourceUtils';
import { addNotification } from './notificationSlice';
import { TableConfig } from '../configs/tableConfigs/aclsTableConfig';
import { Server } from './serverSlice';
import { Recording } from './recordingSlice';
import { Job } from './jobSlice';
import { Service } from './serviceSlice';
import { UserResult } from './userSlice';
import { Group } from './groupSlice';
import { AclResult } from './aclSlice';
import { Details } from './themeSlice';
import { Series } from './seriesSlice';
import { Event } from './eventSlice';

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
 * This file contains methods/thunks used to manage the table in the main view and its state changes
 */

type Page = {
	active: boolean,
	label: string,
	number: number,
};

export type Row = {
	// "selected" and "id" should only be available if "multiSelect" is true in TableState
	selected?: boolean,
	id?: number,
} & (Event | Series | Recording | Server | Job | Service | UserResult | Group | AclResult | Details);

type TableState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	multiSelect: boolean,
	resource: string,
	pages: Page[],
	columns: TableConfig["columns"],
	sortBy: string,
	predicate: string,
	reverse: string,
	rows: Row[],
	maxLabel: string,
	pagination: {
		limit: number,
		offset: number,
		totalItems: number,
		directAccessibleNo: number,
	},
}

// initial redux state
const initialState: TableState = {
	status: 'uninitialized',
	error: null,
	multiSelect: false,
	resource: "",
	pages: [],
	columns: [],
	sortBy: "",
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

const tableSlice = createSlice({
	name: 'table',
	initialState,
	reducers: {
		loadResourceIntoTable(state, action: PayloadAction<{
			multiSelect: TableState["multiSelect"],
			columns: TableConfig["columns"],
			resource: TableState["resource"],
			pages: TableState["pages"],
			rows: TableState["rows"],
			sortBy: TableState["sortBy"],
			totalItems: TableState["pagination"]["totalItems"],
		}>) {
			state.multiSelect = action.payload.multiSelect;
			state.columns = action.payload.columns;
			state.resource = action.payload.resource;
			state.pages = action.payload.pages;
			state.rows = action.payload.rows;
			state.sortBy = action.payload.sortBy;
			state.pagination = {
				...state.pagination,
				totalItems: action.payload.totalItems,
			};
		},
		loadColumns(state, action: PayloadAction<
			TableState["columns"]
		>) {
			state.columns = action.payload;
		},
		selectRow(state, action: PayloadAction<
			number
		>) {
			const id = action.payload;
			state.rows = state.rows.map((row) => {
				if (row.id === id) {
					return {
						...row,
						selected: !row.selected,
					};
				}
				return row;
			})
		},
		selectAll(state) {
			state.rows = state.rows.map((row) => {
				return {
					...row,
					selected: true,
				};
			})
		},
		deselectAll(state) {
			state.rows = state.rows.map((row) => {
				return {
					...row,
					selected: false,
				};
			})
		},
		reverseTable(state, action: PayloadAction<
			TableState["reverse"]
		>) {
			state.reverse = action.payload;
		},
		setSortBy(state, action: PayloadAction<
			TableState["sortBy"]
		>) {
			state.sortBy = action.payload;
		},
		createPage(state, action: PayloadAction<
			Page
		>) {
			state.pages = state.pages.concat(action.payload)
		},
		updatePageSize(state, action: PayloadAction<
			TableState["pagination"]["limit"]
		>) {
			state.pagination = {
				...state.pagination,
				limit: action.payload,
			}
		},
		setPages(state, action: PayloadAction<
			TableState["pages"]
		>) {
			state.pages = action.payload;
		},
		setTotalItems(state, action: PayloadAction<
			TableState["pagination"]["totalItems"]
		>) {
			state.pagination = {
				...state.pagination,
				totalItems: action.payload,
			}
		},
		setOffset(state, action: PayloadAction<
			TableState["pagination"]["offset"]
		>) {
			state.pagination = {
				...state.pagination,
				offset: action.payload,
			}
		},
		setDirectAccessiblePages(state, action: PayloadAction<
			TableState["pagination"]["directAccessibleNo"]
		>) {
			state.pagination = {
				...state.pagination,
				directAccessibleNo: action.payload,
			}
		},
		setPageActive(state, action: PayloadAction<
			number
		>) {
			const pageNumber = action.payload;
			state.pages = state.pages.map((page) => {
				if (page.number === pageNumber) {
					return {
						...page,
						active: true,
					};
				} else {
					return {
						...page,
						active: false,
					};
				}
			})
		},
	},
});

export const {
	loadResourceIntoTable,
	loadColumns,
	selectRow,
	selectAll,
	deselectAll,
	reverseTable,
	setSortBy,
	createPage,
	updatePageSize,
	setPages,
	setTotalItems,
	setOffset,
	setDirectAccessiblePages,
	setPageActive
} = tableSlice.actions;

// Export the slice reducer as the default export
export default tableSlice.reducer;
