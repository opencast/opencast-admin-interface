import { PayloadAction, SerializedError, createSlice } from '@reduxjs/toolkit'
import { seriesTableConfig } from '../configs/tableConfigs/seriesTableConfig';
import axios from 'axios';
import {
	getURLParams,
	prepareAccessPolicyRulesForPost,
	prepareSeriesExtendedMetadataFieldsForPost,
	prepareSeriesMetadataFieldsForPost,
	transformMetadataCollection,
} from "../utils/resourceUtils";
import {
	transformToIdValueArray,
	transformToObjectArray,
} from "../utils/utils";
import { addNotification } from './notificationSlice';
import { TableConfig } from '../configs/tableConfigs/aclsTableConfig';
import { NOTIFICATION_CONTEXT } from '../configs/modalConfig';
import { TransformedAcl } from './aclDetailsSlice';
import { createAppAsyncThunk } from '../createAsyncThunkWithTypes';
import { MetadataCatalog } from './eventSlice';

/**
 * This file contains redux reducer for actions affecting the state of series
 */
export type Series = {
	contributors: string[],
	createdBy?: string,
	creation_date?: string,
	id: string,
	language?: string,
	license?: string,
	managedAcl?: string,
	organizers: string[],
	rightsHolder?: string,
	title: string,
}

type Theme = {
	description: string,
	id: string,
	name: string,
}

export interface TobiraPageChild {
	title: string | undefined,
	path: string,
	segment: string,
	blocks: {
		id: string,
	}[],
	subpages?: string,  // not returned by endpoint
	new?: boolean,      // not returned by endpoint
	children?: TobiraPageChild[],
}

export interface TobiraPage {
	title: string | undefined,
	path: string,
	segment: string,
	children: TobiraPage[],

	subpages?: string,  // not returned by endpoint
	new?: boolean,      // not returned by endpoint
	blocks?: {
		id: string,
	}[],    // not returned by endpoint, only in children. has "id"
}

type SeriesState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	statusMetadata: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorMetadata: SerializedError | null,
	statusThemes: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorThemes: SerializedError | null,
	statusTobiraPage: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorTobiraPage: SerializedError | null,
	results: Series[],
	columns: TableConfig["columns"],
  showActions: boolean,
	total: number,
	count: number,
	offset: number,
	limit: number,
  metadata: MetadataCatalog,
	extendedMetadata: MetadataCatalog[],
	themes: Theme[],
	deletionAllowed: boolean,
	hasEvents: boolean,
	tobiraPage: TobiraPage,
}

// Fill columns initially with columns defined in seriesTableConfig
const initialColumns = seriesTableConfig.columns.map((column) => ({
	...column,
	deactivated: false,
}));

// Initial state of series in redux store
const initialState: SeriesState = {
	status: 'uninitialized',
	error: null,
	statusMetadata: 'uninitialized',
	errorMetadata: null,
	statusThemes: 'uninitialized',
	errorThemes: null,
	statusTobiraPage: 'uninitialized',
	errorTobiraPage: null,
	results: [],
	columns: initialColumns,
	showActions: false,
	total: 0,
	count: 0,
	offset: 0,
	limit: 0,
	metadata: {
		title: "",
		flavor: "",
		fields: [],
	},
	extendedMetadata: [],
	themes: [],
	deletionAllowed: true,
	hasEvents: false,
	tobiraPage: {
		title: undefined,
		path: "/",
		segment: "",
		children: [],
	},
};

// fetch series from server
export const fetchSeries = createAppAsyncThunk('series/fetchSeries', async (_, { getState }) => {
	const state = getState();
	let params = getURLParams(state);
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	// /series.json?sortorganizer={sortorganizer}&sort={sort}&filter={filter}&offset=0&limit=100
	const res = await axios.get("/admin-ng/series/series.json", { params: params });
	return res.data;
});

// fetch series metadata from server
export const fetchSeriesMetadata = createAppAsyncThunk('series/fetchSeriesMetadata', async (_, { rejectWithValue }) => {
	const res = await axios.get("/admin-ng/series/new/metadata");
	const data = await res.data;

	const mainCatalog = "dublincore/series";
	let metadata: SeriesState["metadata"] | undefined = undefined;
	const extendedMetadata = [];

	for (const metadataCatalog of data) {
		if (metadataCatalog.flavor === mainCatalog) {
			metadata = transformMetadataCollection({ ...metadataCatalog });
		} else {
			extendedMetadata.push(
				transformMetadataCollection({ ...metadataCatalog })
			);
		}
	}

	if (!metadata) {
		console.error("Main metadata catalog is missing");
		return rejectWithValue("Main metadata catalog is missing")
	}

	return { metadata, extendedMetadata }
});

// fetch series themes from server
export const fetchSeriesThemes = createAppAsyncThunk('series/fetchSeriesThemes', async () => {
	let res = await axios.get("/admin-ng/series/new/themes");
	const data = await res.data;
	const themes = transformToObjectArray(data);
	return themes;
});

// post new series to backend
export const postNewSeries = createAppAsyncThunk('series/postNewSeries', async (params: {
	values: {
		[key: string]: any;
		acls: TransformedAcl[],
		// contributor: string[],
		// creator: string[],
		// description: string,
		// language: string,
		// license: string,
		// publisher: string[],
		// rightsHolder: string,
		// subject: string,
		theme: string,
		// title: string,
		selectedPage?: TobiraPage,
		breadcrumbs?: TobiraPage[],
	},
	metadataInfo: MetadataCatalog,
	extendedMetadata: MetadataCatalog[]
}, {dispatch}) => {
	const { values, metadataInfo, extendedMetadata } = params

	// prepare metadata provided by user
	let metadataFields = prepareSeriesMetadataFieldsForPost(
		metadataInfo.fields,
		values
	);
	let extendedMetadataFields = prepareSeriesExtendedMetadataFieldsForPost(
		extendedMetadata,
		values
	);

	// metadata for post request
	let metadata = [
		{
			flavor: metadataInfo.flavor,
			title: metadataInfo.title,
			fields: metadataFields,
		},
	];

	for (const entry of extendedMetadataFields) {
		metadata.push(entry);
	}

	let access = prepareAccessPolicyRulesForPost(values.acls);

	// Tobira
	let tobira: any = {};
	if (values.selectedPage && values.breadcrumbs) {
		let existingPages: any[] = [];
		let newPages: any[] = [];
		values.breadcrumbs.concat(values.selectedPage).forEach( function (page: TobiraPage) {
			if (page.new) {
				newPages.push({
					name: page.title,
					pathSegment: page.segment,
				});
			} else {
				existingPages.push(page);
			}
		});

		tobira["parentPagePath"] = existingPages.pop().path;
		tobira["newPages"] = newPages;
	}


	let jsonData: {
		metadata: typeof metadata,
		options: {},
		access: typeof access,
		theme?: number,
		tobira?: any
	} = {
		metadata: metadata,
		options: {},
		access: access,
		tobira: tobira,
	};

	if (values.theme !== "") {
		jsonData = {
			...jsonData,
			theme: parseInt(values.theme),
		};
	}

	let data = new URLSearchParams();
	data.append("metadata", JSON.stringify(jsonData));

	// Todo: process bar notification
	axios
		.post("/admin-ng/series/new", data.toString(), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			console.info(response);
			dispatch(addNotification({type: "success", key: "SERIES_ADDED"}));
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification({type: "error", key: "SERIES_NOT_SAVED"}));
		});
});

// check for events of the series and if deleting the series if it has events is allowed
export const checkForEventsDeleteSeriesModal = createAppAsyncThunk('series/checkForEventsDeleteSeriesModal', async (id: string, {dispatch}) => {
	const hasEventsRequest = await axios.get(
		`/admin-ng/series/${id}/hasEvents.json`
	);
	const hasEventsResponse = await hasEventsRequest.data;
	const hasEvents = hasEventsResponse.hasEvents;

	const deleteWithEventsAllowedRequest = await axios.get(
		"/admin-ng/series/configuration.json"
	);
	const deleteWithEventsAllowedResponse = await deleteWithEventsAllowedRequest.data;
	const deleteWithEventsAllowed =
		deleteWithEventsAllowedResponse.deleteSeriesWithEventsAllowed;

	dispatch(
		setSeriesDeletionAllowed({ deletionAllowed: !hasEvents || deleteWithEventsAllowed, hasEvents: hasEvents })
	);
});

// delete series with provided id
export const deleteSeries = createAppAsyncThunk('series/deleteSeries', async (id: string, {dispatch}) => {
	// API call for deleting a series
	axios
		.delete(`/admin-ng/series/${id}`)
		.then((res) => {
			console.info(res);
			// add success notification
			dispatch(addNotification({type: "success", key: "SERIES_DELETED"}));
		})
		.catch((res) => {
			console.error(res);
			// add error notification
			dispatch(addNotification({type: "error", key: "SERIES_NOT_DELETED"}));
		});
});

// delete series with provided ids
export const deleteMultipleSeries = createAppAsyncThunk('series/deleteMultipleSeries', async (
	series: {
		contributors: string[],
		createdBy: string,
		creation_date: string,
		hasEvents: false,
		id: string,
		organizers: string[],
		selected: boolean,
		title: string,
	}[],
{dispatch}) => {
	let data = [];

	for (let i = 0; i < series.length; i++) {
		if (series[i].selected) {
			data.push(series[i].id);
		}
	}

	axios
		.post("/admin-ng/series/deleteSeries", data)
		.then((res) => {
			console.info(res);
			//add success notification
			dispatch(addNotification({type: "success", key: "SERIES_DELETED"}));
		})
		.catch((res) => {
			console.error(res);
			//add error notification
			dispatch(addNotification({type: "error", key: "SERIES_NOT_DELETED"}));
		});
});

// fetch metadata of certain series from server
export const fetchSeriesDetailsTobiraNew = createAppAsyncThunk('seriesDetails/fetchSeriesDetailsTobiraNew', async (path: TobiraPage["path"], {dispatch}) => {
	const res = await axios.get(`/admin-ng/series/new/tobira/page?path=` + path)
		.then((response) => {
			return response;
		})
		.catch((response) => {
			console.error(response);
			const data = response.response;

			if (data.status === 404) {
				dispatch(addNotification({
					type: "warning",
					key: "TOBIRA_PAGE_NOT_FOUND",
					duration: -1,
					parameter: undefined,
					context: NOTIFICATION_CONTEXT
				}));

				throw Error(response);
			} else {
				// Add notification back once we can properly specify which tab of the modal it should be shown on
				console.info("Could not fetch tobira page information.")
				console.info(response)
				// dispatch(addNotification({
				//  type: "error",
				//  key: "TOBIRA_SERVER_ERROR",
				//  duration: -1,
				//  parameter: null,
				//  context: NOTIFICATION_CONTEXT
				// }));

				throw Error(response);
			}
		});

	if (!res) {
		throw Error;
	}

	const data = res.data;
	return data;
});

// Get names and ids of selectable series
export const fetchSeriesOptions = async () => {
	let data = await axios.get("/admin-ng/resources/SERIES.json");

	const response = await data.data;

	const seriesCollection = [];
	for (const series of transformToIdValueArray(response)) {
		seriesCollection.push({ value: series.id, name: series.value });
	}

	return seriesCollection;
};

// Check if a series has events
export const hasEvents = async (seriesId: string) => {
	let data = await axios.get(`/admin-ng/series/${seriesId}/hasEvents.json`);

	return (await data.data).hasEvents;
};

// Get series configuration and flag indicating if series with events is allowed to delete
export const getSeriesConfig = async () => {
	let data = await axios.get("/admin-ng/series/configuration.json");

	const response = await data.data;

	return !!response.deleteSeriesWithEventsAllowed;
};

const seriesSlice = createSlice({
	name: 'series',
	initialState,
	reducers: {
		setSeriesColumns(state, action: PayloadAction<
			SeriesState["columns"]
		>) {
			state.columns = action.payload;
		},
		showActionsSeries(state, action: PayloadAction<
			SeriesState["showActions"]
		>) {
			state.showActions = action.payload;
		},
		setSeriesDeletionAllowed(state, action: PayloadAction<{
			deletionAllowed: SeriesState["deletionAllowed"],
			hasEvents: SeriesState["hasEvents"],
		}>) {
			state.deletionAllowed = action.payload.deletionAllowed;
			state.hasEvents = action.payload.hasEvents;
		},
		setTobiraPage(state, action: PayloadAction<
			SeriesState["tobiraPage"]
		>) {
			state.tobiraPage = action.payload;
		},
		setErrorTobiraPage(state, action: PayloadAction<
			SeriesState["errorTobiraPage"]
		>) {
			state.errorTobiraPage = action.payload;
		}
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchSeries.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchSeries.fulfilled, (state, action: PayloadAction<{
				total: SeriesState["total"],
				count: SeriesState["count"],
				limit: SeriesState["limit"],
				offset: SeriesState["offset"],
				results: SeriesState["results"],
			}>) => {
				state.status = 'succeeded';
				const series = action.payload;
				state.total = series.total;
				state.count = series.count;
				state.limit = series.limit;
				state.offset = series.offset;
				state.results = series.results;
			})
			.addCase(fetchSeries.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			})
			.addCase(fetchSeriesMetadata.pending, (state) => {
				state.statusMetadata = 'loading';
			})
			.addCase(fetchSeriesMetadata.fulfilled, (state, action: PayloadAction<{
				metadata: SeriesState["metadata"],
				extendedMetadata: SeriesState["extendedMetadata"],
			}>) => {
				state.statusMetadata = 'succeeded';
				const seriesMetadata = action.payload;
				state.metadata = seriesMetadata.metadata;
				state.extendedMetadata = seriesMetadata.extendedMetadata;
			})
			.addCase(fetchSeriesMetadata.rejected, (state, action) => {
				state.statusMetadata = 'failed';
				state.extendedMetadata = [];
				state.errorMetadata = action.error;
			})
			.addCase(fetchSeriesThemes.pending, (state) => {
				state.statusThemes = 'loading';
			})
			.addCase(fetchSeriesThemes.fulfilled, (state, action: PayloadAction<
				SeriesState["themes"]
			>) => {
				state.statusThemes = 'succeeded';
				const seriesThemes = action.payload;
				state.themes = seriesThemes;
			})
			.addCase(fetchSeriesThemes.rejected, (state, action) => {
				state.statusThemes = 'failed';
				state.errorThemes = action.error;
			})
			.addCase(fetchSeriesDetailsTobiraNew.pending, (state) => {
				state.statusTobiraPage = 'loading';
			})
			.addCase(fetchSeriesDetailsTobiraNew.fulfilled, (state, action: PayloadAction<
				SeriesState["tobiraPage"]
			>) => {
				state.statusTobiraPage = 'succeeded';
				state.tobiraPage = action.payload;
			})
			.addCase(fetchSeriesDetailsTobiraNew.rejected, (state, action) => {
				state.statusTobiraPage = 'failed';
				state.errorTobiraPage = action.error;
			});
	}
});

export const {
	setSeriesColumns,
	showActionsSeries,
	setSeriesDeletionAllowed,
	setTobiraPage,
	setErrorTobiraPage,
} = seriesSlice.actions;

// Export the slice reducer as the default export
export default seriesSlice.reducer;
