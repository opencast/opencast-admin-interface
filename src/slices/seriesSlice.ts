import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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
import { TransformedAcls } from './aclDetailsSlice';
import { RootState } from '../store';

/**
 * This file contains redux reducer for actions affecting the state of series
 */
type Series = {
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

type MetadataCatalog = {
	title: string,
	flavor: string,
	fields: {
		collection?: {}[],	// different for e.g. languages and presenters
		id: string,
		label: string,
		readOnly: boolean,
		required: boolean,
		translatable?: boolean,
		type: string,
		value: string | string[],
	}[]
}

type Theme = {
	description: string,
	id: string,
	name: string,
}

type SeriesState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	statusMetadata: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorMetadata: SerializedError | null,
	statusThemes: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorThemes: SerializedError | null,
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
};

// fetch series from server
export const fetchSeries = createAsyncThunk('series/fetchSeries', async (_, { getState }) => {
	const state = getState();
	let params = getURLParams(state as RootState);
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	// /series.json?sortorganizer={sortorganizer}&sort={sort}&filter={filter}&offset=0&limit=100
	const res = await axios.get("/admin-ng/series/series.json", { params: params });
	return res.data;
});

// fetch series metadata from server
export const fetchSeriesMetadata = createAsyncThunk('series/fetchSeriesMetadata', async () => {
	const res = await axios.get("/admin-ng/series/new/metadata");
	const data = await res.data;

	const mainCatalog = "dublincore/series";
	let metadata: any = {};
	const extendedMetadata = [];

	for (const metadataCatalog of data) {
		if (metadataCatalog.flavor === mainCatalog) {
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
			metadata = transformMetadataCollection({ ...metadataCatalog });
		} else {
			extendedMetadata.push(
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
				transformMetadataCollection({ ...metadataCatalog })
			);
		}
	}

	return { metadata, extendedMetadata }
});

// fetch series themes from server
export const fetchSeriesThemes = createAsyncThunk('series/fetchSeriesThemes', async () => {
	let res = await axios.get("/admin-ng/series/new/themes");
	const data = await res.data;
	const themes = transformToObjectArray(data);
	return themes;
});

// post new series to backend
export const postNewSeries = createAsyncThunk('series/postNewSeries', async (params: {
	values: {
		[key: string]: any;
		acls: TransformedAcls,
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
	},
	metadataInfo: MetadataCatalog,
	extendedMetadata: MetadataCatalog[]
}, {dispatch}) => {
	const { values, metadataInfo, extendedMetadata } = params

	let metadataFields, extendedMetadataFields, metadata, access;

	// prepare metadata provided by user
	metadataFields = prepareSeriesMetadataFieldsForPost(
		metadataInfo.fields,
		values
	);
	extendedMetadataFields = prepareSeriesExtendedMetadataFieldsForPost(
		extendedMetadata,
		values
	);

	// metadata for post request
	metadata = [
		{
			flavor: metadataInfo.flavor,
			title: metadataInfo.title,
			fields: metadataFields,
		},
	];

	for (const entry of extendedMetadataFields) {
		metadata.push(entry);
	}

	access = prepareAccessPolicyRulesForPost(values.acls);

	let jsonData = {
		metadata: metadata,
		options: {},
		access: access,
	};

	if (values.theme !== "") {
		jsonData = {
			...jsonData,
// @ts-expect-error TS(2322): Type '{ theme: number; metadata: { flavor: any; ti... Remove this comment to see the full error message
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
export const checkForEventsDeleteSeriesModal = createAsyncThunk('series/checkForEventsDeleteSeriesModal', async (id: string, {dispatch}) => {
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
export const deleteSeries = createAsyncThunk('series/deleteSeries', async (id: string, {dispatch}) => {
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
export const deleteMultipleSeries = createAsyncThunk('series/deleteMultipleSeries', async (
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
			});
	}
});

export const {
	setSeriesColumns,
	showActionsSeries,
	setSeriesDeletionAllowed,
} = seriesSlice.actions;

// Export the slice reducer as the default export
export default seriesSlice.reducer;
