import { PayloadAction, SerializedError, createSlice } from '@reduxjs/toolkit'
import { themesTableConfig } from "../configs/tableConfigs/themesTableConfig";
import axios from 'axios';
import { buildThemeBody, getURLParams } from '../utils/resourceUtils';
import { addNotification } from './notificationSlice';
import { TableConfig } from '../configs/tableConfigs/aclsTableConfig';
import { createAppAsyncThunk } from '../createAsyncThunkWithTypes';

/**
 * This file contains redux reducer for actions affecting the state of themes
 */
export type Details = {
	bumperActive: boolean,
	bumperFile: string,
	creationDate: any,
	creator: string,
	default: boolean,
	description: string,
	id: number,
	licenseSlideActive: boolean,
	licenseSlideBackground: string,
	licenseSlideDescription: string,
	name: string,
	titleSlideActive: boolean,
	titleSlideBackground: string,
	titleSlideMetadata: string,
	trailerActive: boolean,
	trailerFile: string,
	watermarkActive: boolean,
	watermarkFile: string,
	watermarkPosition: string,
}

type ThemeState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	results: Details[],
	columns: TableConfig["columns"],
	total: number,
	count: number,
	offset: number,
	limit: number,
};

// Fill columns initially with columns defined in themesTableConfig
const initialColumns = themesTableConfig.columns.map((column) => ({
	...column,
	deactivated: false,
}));

// Initial state of themes in redux store
const initialState: ThemeState = {
	status: 'uninitialized',
	error: null,
	results: [],
	columns: initialColumns,
	total: 0,
	count: 0,
	offset: 0,
	limit: 0,
};

// fetch themes from server
export const fetchThemes = createAppAsyncThunk('theme/fetchThemes', async (_, { getState }) => {
	const state = getState();
	let params = getURLParams(state);
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
  // /themes.json?limit=0&offset=0&filter={filter}&sort={sort}
	const res = await axios.get("/admin-ng/themes/themes.json", { params: params });
	return res.data;
});

// post new theme to backend
export const postNewTheme = createAppAsyncThunk('theme/postNewTheme', async (values: Details, {dispatch}) => {
	// get URL params used for post request
	let data = buildThemeBody(values);

	axios
		.post("/admin-ng/themes", data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		// Usually we would extraReducers for responses, but reducers are not allowed to dispatch
		// (they need to be free of side effects)
		// Since we want to dispatch, we have to handle responses in our thunk
		.then((response) => {
			console.info(response);
			dispatch(addNotification({type: "success", key: "THEME_CREATED"}));
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification({type: "error", key: "THEME_NOT_CREATED"}));
		});
});

// delete theme with provided id
export const deleteTheme = createAppAsyncThunk('theme/deleteTheme', async (id: number, {dispatch}) => {
	axios
		.delete(`/admin-ng/themes/${id}`)
		.then((res) => {
			console.info(res);
			// add success notification
			dispatch(addNotification({type: "success", key: "THEME_DELETED"}));
		})
		.catch((res) => {
			console.error(res);
			// add error notification
			dispatch(addNotification({type: "error", key: "THEME_NOT_DELETED"}));
		});
});

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setThemeColumns(state, action: PayloadAction<
			ThemeState["columns"]
		>) {
			state.columns = action.payload;
		},
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchThemes.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchThemes.fulfilled, (state, action: PayloadAction<{
				total: ThemeState["total"],
				count: ThemeState["count"],
				limit: ThemeState["limit"],
				offset: ThemeState["offset"],
				results: ThemeState["results"],
			}>) => {
				state.status = 'succeeded';
				const acls = action.payload;
				state.total = acls.total;
				state.count = acls.count;
				state.limit = acls.limit;
				state.offset = acls.offset;
				state.results = acls.results;
			})
			.addCase(fetchThemes.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			});
	}
});

export const { setThemeColumns } = themeSlice.actions;

// Export the slice reducer as the default export
export default themeSlice.reducer;
