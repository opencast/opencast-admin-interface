import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { buildThemeBody } from '../utils/resourceUtils';
import { addNotification } from '../slices/notificationSlice';

/**
 * This file contains redux reducer for actions affecting the state of a theme
 */
type Details = {
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

type Usage = {
	series: {id: string, title: string}[]
}

type ThemeDetailsState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	statusUsage: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorUsage: SerializedError | null,
	details: Details,
	usage: Usage,
};

// Initial state of theme details in redux store
const initialState: ThemeDetailsState = {
	status: 'uninitialized',
	error: null,
	statusUsage: 'uninitialized',
	errorUsage: null,
	details: {
		bumperActive: false,
		bumperFile: "",
		creationDate: undefined,
		creator: "",
		default: false,
		description: "",
		id: 0,
		licenseSlideActive: false,
		licenseSlideBackground: "",
		licenseSlideDescription: "",
		name: "",
		titleSlideActive: false,
		titleSlideBackground: "",
		titleSlideMetadata: "",
		trailerActive: false,
		trailerFile: "",
		watermarkActive: false,
		watermarkFile: "",
		watermarkPosition: "",
	},
	usage: { series: [] },
};

// fetch details of certain theme from server
export const fetchThemeDetails = createAsyncThunk('themeDetails/fetchThemeDetails', async (id: number) => {
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	const res = await axios.get(`/admin-ng/themes/${id}.json`);
	return res.data;
});

// fetch usage of a certain theme
export const fetchUsage = createAsyncThunk('themeDetails/fetchUsage', async (id: number) => {
	const res = await axios.get(`/admin-ng/themes/${id}/usage.json`);
	return res.data;
});

// update a certain theme
export const updateThemeDetails = createAsyncThunk('themeDetails/updateThemeDetails', async (params: {
	id: number,
	values: Details
}, {dispatch}) => {
	const { values, id } = params
	let data = buildThemeBody(values);

	// request for updating
	axios
		.put(`/admin-ng/themes/${id}`, data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			console.info(response);
			dispatch(addNotification({type: "success", key: "THEME_CREATED"}));
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification({type: "error", key: "THEME_NOT_CREATED"}));
		});
});

const themeDetailsSlice = createSlice({
	name: 'themeDetails',
	initialState,
	reducers: {},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchThemeDetails.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchThemeDetails.fulfilled, (state, action: PayloadAction<
				ThemeDetailsState["details"]
			>) => {
				state.status = 'succeeded';
				const themeDetails = action.payload;
				state.details = themeDetails;
			})
			.addCase(fetchThemeDetails.rejected, (state, action) => {
				state.status = 'failed';
				state.details = {
					bumperActive: false,
					bumperFile: "",
					creationDate: undefined,
					creator: "",
					default: false,
					description: "",
					id: 0,
					licenseSlideActive: false,
					licenseSlideBackground: "",
					licenseSlideDescription: "",
					name: "",
					titleSlideActive: false,
					titleSlideBackground: "",
					titleSlideMetadata: "",
					trailerActive: false,
					trailerFile: "",
					watermarkActive: false,
					watermarkFile: "",
					watermarkPosition: "",
				};
				state.error = action.error;
			})
			.addCase(fetchUsage.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchUsage.fulfilled, (state, action: PayloadAction<
				ThemeDetailsState["usage"]
			>) => {
				state.status = 'succeeded';
				const usage = action.payload;
				state.usage = usage;
			})
			.addCase(fetchUsage.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			});
	}
});

// export const {} = aclsSlice.actions;

// Export the slice reducer as the default export
export default themeDetailsSlice.reducer;
