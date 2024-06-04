import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import _ from "lodash";
import {
	getSeriesDetailsExtendedMetadata,
	getSeriesDetailsMetadata,
	getSeriesDetailsThemeNames,
	getStatistics,
} from "../selectors/seriesDetailsSelectors";
import { addNotification } from "./notificationSlice";
import {
	createPolicy,
	transformMetadataCollection,
	transformMetadataForUpdate,
} from "../utils/resourceUtils";
import { transformToIdValueArray } from "../utils/utils";
import { NOTIFICATION_CONTEXT } from "../configs/modalConfig";
import { RootState } from '../store';
import { Statistics, fetchStatistics, fetchStatisticsValueUpdate } from './statisticsSlice';
import { Ace, TransformedAcl, TransformedAcls } from './aclDetailsSlice';

/**
 * This file contains redux reducer for actions affecting the state of a series
 */
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

type Feed = {
	link: string,
	type: string,
	version: string
}

type Acl = {
	actions: string[],
	read: boolean,
	role: string,
	write: boolean,
}

type SeriesDetailsState = {
	statusMetadata: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorMetadata: SerializedError | null,
	statusAcl: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorAcl: SerializedError | null,
	statusFeeds: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorFeeds: SerializedError | null,
	statusTheme: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorTheme: SerializedError | null,
	statusThemeNames: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorThemeNames: SerializedError | null,
	statusStatistics: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorStatistics: SerializedError | null,
	statusStatisticsValue: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorStatisticsValue: SerializedError | null,
	statusTobiraData: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorTobiraData: SerializedError | null,
  metadata: MetadataCatalog,
	extendedMetadata: MetadataCatalog[],
	feeds: Feed[],
	acl: Acl[],
	theme: string,
	themeNames: { id: string, value: string }[],
	fetchingStatisticsInProgress: boolean,
	statistics: Statistics[],
	hasStatisticsError: boolean,
	tobiraData: {
		baseURL: string,
		hostPages: {
			title: string,
			path: string,
			ancestors: {
				title: string,
			}[],
		}[],
	},
}

// Initial state of series details in redux store
const initialState: SeriesDetailsState = {
	statusMetadata: 'uninitialized',
	errorMetadata: null,
	statusAcl: 'uninitialized',
	errorAcl: null,
	statusFeeds: 'uninitialized',
	errorFeeds: null,
	statusTheme: 'uninitialized',
	errorTheme: null,
	statusThemeNames: 'uninitialized',
	errorThemeNames: null,
	statusStatistics: 'uninitialized',
	errorStatistics: null,
	statusStatisticsValue: 'uninitialized',
	errorStatisticsValue: null,
	statusTobiraData: 'uninitialized',
	errorTobiraData: null,
	metadata: {
		title: "",
		flavor: "",
		fields: [],
	},
	extendedMetadata: [],
	feeds: [],
	acl: [],
	theme: "",
	themeNames: [],
	fetchingStatisticsInProgress: false,
	statistics: [],
	hasStatisticsError: false,
	tobiraData: {
		baseURL: "",
		hostPages: [],
	},
};

// fetch metadata of certain series from server
export const fetchSeriesDetailsMetadata = createAsyncThunk('seriesDetails/fetchSeriesDetailsMetadata', async (id: string) => {
	const res = await axios.get(`/admin-ng/series/${id}/metadata.json`);
	const metadataResponse = res.data;

	const mainCatalog = "dublincore/series";
	let seriesMetadata: any = {};
	let extendedMetadata: any[] = [];

	for (const catalog of metadataResponse) {
		if (catalog.flavor === mainCatalog) {
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
			seriesMetadata = transformMetadataCollection({ ...catalog });
		} else {
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
			extendedMetadata.push(transformMetadataCollection({ ...catalog }));
		}
	}

	return { seriesMetadata, extendedMetadata }
});

// fetch acls of certain series from server
export const fetchSeriesDetailsAcls = createAsyncThunk('seriesDetails/fetchSeriesDetailsAcls', async (id: string, {dispatch}) => {
	const res = await axios.get(`/admin-ng/series/${id}/access.json`);
	const response = res.data;

	if (!!response.series_access.locked) {
		dispatch(
			addNotification({
				type: "warning",
				key: "SERIES_ACL_LOCKED",
				duration: -1,
				parameter: null,
				context: NOTIFICATION_CONTEXT
			})
		);
	}

	let seriesAcls: TransformedAcls = [];
	if (!!response.series_access) {
		const json = JSON.parse(response.series_access.acl).acl.ace;
		let policies: { [key: string]: TransformedAcl } = {};
		let policyRoles: string[] = [];
		json.forEach((policy: Ace) => {
			if (!policies[policy.role]) {
				policies[policy.role] = createPolicy(policy.role);
				policyRoles.push(policy.role);
			}
			if (policy.action === "read" || policy.action === "write") {
				policies[policy.role][policy.action] = policy.allow;
			} else if (policy.allow === true) { //|| policy.allow === "true") {
				policies[policy.role].actions.push(policy.action);
			}
		});
		seriesAcls = policyRoles.map((role) => policies[role]);
	}

	return seriesAcls;
});

// fetch feeds of certain series from server
export const fetchSeriesDetailsFeeds = createAsyncThunk('seriesDetails/fetchSeriesDetailsFeeds', async (id: string) => {
	const res = await axios.get("/admin-ng/feeds/feeds");
	const feedsResponse = res.data;

	let seriesFeeds: any[] = [];
	for (let i = 0; i < feedsResponse.length; i++) {
		if (feedsResponse[i].name === "Series") {
			let pattern =
				feedsResponse[i].identifier.split("/series")[0] +
				feedsResponse[i].pattern;
			let uidLink = pattern.split("<series_id>")[0] + id;
			let typeLink = uidLink.split("<type>");
			let versionLink = typeLink[1].split("<version>");
			seriesFeeds = [
				{
					type: "atom",
					version: "0.3",
					link:
						typeLink[0] + "atom" + versionLink[0] + "0.3" + versionLink[1],
				},
				{
					type: "atom",
					version: "1.0",
					link:
						typeLink[0] + "atom" + versionLink[0] + "1.0" + versionLink[1],
				},
				{
					type: "rss",
					version: "2.0",
					link: typeLink[0] + "rss" + versionLink[0] + "2.0" + versionLink[1],
				},
			];
		}
	}

	return seriesFeeds;
});

// fetch theme of certain series from server
export const fetchSeriesDetailsTheme = createAsyncThunk('seriesDetails/fetchSeriesDetailsTheme', async (id: string) => {
	const res = await axios.get(`/admin-ng/series/${id}/theme.json`);
	const themeResponse = res.data;

	let seriesTheme = "";

	// check if series has a theme
	if (!_.isEmpty(themeResponse)) {
		// transform response for further use
		seriesTheme = transformToIdValueArray(themeResponse)[0].value;
	}

	return seriesTheme;
});

// fetch names of possible themes from server
export const fetchSeriesDetailsThemeNames = createAsyncThunk('seriesDetails/fetchSeriesDetailsThemeNames', async () => {
	const res = await axios.get("/admin-ng/resources/THEMES.NAME.json");
	const response = res.data;

	// transform response for further use
	let themeNames = transformToIdValueArray(response);

	return themeNames;
});

// update series with new metadata
export const updateSeriesMetadata = createAsyncThunk('seriesDetails/updateSeriesMetadata', async (params: {
	id: string,
	values: {
		contributor: string[],
		createdBy: string,
		creator: string[],
		description: String,
		identifier: string,
		language: string,
		license: string,
		publisher: string[],
		rightsHolder: string,
		subject: string,
		title: string,
	}
}, {dispatch, getState}) => {
	const { id, values } = params;
	let metadataInfos = getSeriesDetailsMetadata(getState() as RootState);

	const { fields, data, headers } = transformMetadataForUpdate(
		metadataInfos,
		values
	);

	await axios.put(`/admin-ng/series/${id}/metadata`, data, headers);

	// updated metadata in series details redux store
	let seriesMetadata = {
		flavor: metadataInfos.flavor,
		title: metadataInfos.title,
		fields: fields,
	};
	dispatch(setSeriesDetailsMetadata(seriesMetadata));
});

// update series with new metadata
export const updateExtendedSeriesMetadata = createAsyncThunk('seriesDetails/updateExtendedSeriesMetadata', async (params: {
	id: string,
	values: { [key: string]: any },
	catalog: {
		flavor: string,
		title: string,
		fields: { [key: string]: any }[]
	}
}, {dispatch, getState}) => {
	const { id, values, catalog } = params;

	const { fields, data, headers } = transformMetadataForUpdate(
		catalog,
		values
	);

	await axios.put(`/admin-ng/series/${id}/metadata`, data, headers);

	// updated metadata in series details redux store
	let seriesMetadata = {
		flavor: catalog.flavor,
		title: catalog.title,
		fields: fields,
	};

	const oldExtendedMetadata = getSeriesDetailsExtendedMetadata(getState() as RootState);
	let newExtendedMetadata = [];

	for (const catalog of oldExtendedMetadata) {
		if (
			catalog.flavor === seriesMetadata.flavor &&
			catalog.title === seriesMetadata.title
		) {
			newExtendedMetadata.push(seriesMetadata);
		} else {
			newExtendedMetadata.push(catalog);
		}
	}

	dispatch(setSeriesDetailsExtendedMetadata(newExtendedMetadata));
});

export const updateSeriesAccess = createAsyncThunk('seriesDetails/updateSeriesAccess', async (params: {
	id: string,
	policies: { [key: string]: TransformedAcl }
}, {dispatch}) => {
	const { id, policies } = params;

	let data = new URLSearchParams();

	data.append("acl", JSON.stringify(policies));
	data.append("override", String(true));

	return axios
		.post(`/admin-ng/series/${id}/access`, data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((res) => {
			console.info(res);
			dispatch(
				addNotification({
					type: "info",
					key: "SAVED_ACL_RULES",
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
			return true;
		})
		.catch((res) => {
			console.error(res);
			dispatch(
				addNotification({
					type: "error",
					key: "ACL_NOT_SAVED",
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
			return false;
		});
});

export const updateSeriesTheme = createAsyncThunk('seriesDetails/updateSeriesTheme', async (params: {
	id: string,
	values: { theme: string},
}, {dispatch, getState}) => {
	const { id, values } = params;

	let themeNames = getSeriesDetailsThemeNames(getState() as RootState);

	let themeId = themeNames.find((theme) => theme.value === values.theme)?.id;

	if (!themeId) {
		console.error("Can't update series theme. " + values.theme + " not found");
		dispatch(
			addNotification({
				type: "error",
				key: "SERIES_NOT_SAVED",
				duration: 10,
				parameter: null,
				context: NOTIFICATION_CONTEXT
			})
		);
		return;
	}

	let data = new URLSearchParams();
	data.append("themeId", themeId);

	axios
		.put(`/admin-ng/series/${id}/theme`, data)
		.then((response) => {
			let themeResponse = response.data;

			let seriesTheme = transformToIdValueArray(themeResponse)[0].value;

			dispatch(setSeriesDetailsTheme(seriesTheme));
			dispatch(
				addNotification({
					type: "warning",
					key:"SERIES_THEME_REPROCESS_EXISTING_EVENTS",
					duration: 10,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
		})
		.catch((response) => {
			console.error(response);
		});
});

// fetch metadata of certain series from server
export const fetchSeriesDetailsTobira = createAsyncThunk('seriesDetails/fetchSeriesDetailsTobira', async (id: string, {dispatch}) => {
	const res = await axios.get(`/admin-ng/series/${id}/tobira/pages`)
		.then((response) => {
			return response;
		})
		.catch((response) => {
			console.error(response);
			const data = response.response;

			if (data.status === 500) {
				dispatch(addNotification({
					type: "error",
					key: "TOBIRA_SERVER_ERROR",
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				}));

				throw Error(response);
			} else if (data.status === 404) {
				dispatch(addNotification({
					type: "warning",
					key: "TOBIRA_NOT_FOUND",
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				}));

				throw Error(response);
			}
			return undefined;
		});

	if (!res) {
		throw Error;
	}

	const data = res.data;
	return data;
});

// thunks for statistics
export const fetchSeriesStatistics = createAsyncThunk('seriesDetails/fetchSeriesStatistics', async (seriesId: string, {getState}) => {
	// get prior statistics
	const state = getState();
	const statistics = getStatistics(state as RootState);

	return await (
		fetchStatistics(
			seriesId,
			"series",
			statistics,
		)
	);
});

export const fetchSeriesStatisticsValueUpdate = createAsyncThunk('seriesDetails/fetchSeriesStatisticsValueUpdate', async (params: {
	seriesId: string,
	providerId: string,
	from: string,
	to: string,
	dataResolution: string[],
	timeMode: any
}, {getState}) => {
	const {seriesId, providerId, from, to, dataResolution, timeMode } = params;

	// get prior statistics
	const state = getState();
	const statistics = getStatistics(state as RootState);

	return await (
		fetchStatisticsValueUpdate(
			seriesId,
			"series",
			providerId,
			from,
			to,
			dataResolution,
			timeMode,
			statistics,
		)
	);
});

// Reducer for series details
const seriesDetailsSlice = createSlice({
	name: 'seriesDetails',
	initialState,
	reducers: {
		setSeriesDetailsTheme(state, action: PayloadAction<
			SeriesDetailsState["theme"]
		>) {
			state.theme = action.payload;
		},
		setSeriesDetailsMetadata(state, action: PayloadAction<
			SeriesDetailsState["metadata"]
		>) {
			state.metadata = action.payload;
		},
		setSeriesDetailsExtendedMetadata(state, action: PayloadAction<
			SeriesDetailsState["extendedMetadata"]
		>) {
			state.extendedMetadata = action.payload;
		},
		setSeriesStatisticsError(state, action: PayloadAction<
			SeriesDetailsState["hasStatisticsError"]
		>) {
			state.hasStatisticsError = action.payload;
		},
		setSeriesStatistics(state, action: PayloadAction<
			SeriesDetailsState["statistics"]
		>) {
			state.statistics = action.payload;
		},
		setDoNothing(state) {

		}
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchSeriesDetailsMetadata.pending, (state) => {
				state.statusMetadata = 'loading';
			})
			.addCase(fetchSeriesDetailsMetadata.fulfilled, (state, action: PayloadAction<{
				seriesMetadata: SeriesDetailsState["metadata"],
				extendedMetadata: SeriesDetailsState["extendedMetadata"],
			}>) => {
				state.statusMetadata = 'succeeded';
				const seriesDetails = action.payload;
				state.metadata = seriesDetails.seriesMetadata;
				state.extendedMetadata = seriesDetails.extendedMetadata;
			})
			.addCase(fetchSeriesDetailsMetadata.rejected, (state, action) => {
				state.statusMetadata = 'failed';
				state.errorMetadata = action.error;
			})
			.addCase(fetchSeriesDetailsAcls.pending, (state) => {
				state.statusAcl = 'loading';
			})
			.addCase(fetchSeriesDetailsAcls.fulfilled, (state, action: PayloadAction<
				SeriesDetailsState["acl"]
			>) => {
				state.statusAcl = 'succeeded';
				const seriesDetailsAcls = action.payload;
				state.acl = seriesDetailsAcls;
			})
			.addCase(fetchSeriesDetailsAcls.rejected, (state, action) => {
				state.statusAcl = 'failed';
				state.errorAcl = action.error;
			})
			.addCase(fetchSeriesDetailsFeeds.pending, (state) => {
				state.statusFeeds = 'loading';
			})
			.addCase(fetchSeriesDetailsFeeds.fulfilled, (state, action: PayloadAction<
				SeriesDetailsState["feeds"]
			>) => {
				state.statusFeeds = 'succeeded';
				const seriesDetailsFeeds = action.payload;
				state.feeds = seriesDetailsFeeds;
			})
			.addCase(fetchSeriesDetailsFeeds.rejected, (state, action) => {
				state.statusFeeds = 'failed';
				state.errorFeeds = action.error;
			})
			.addCase(fetchSeriesDetailsTheme.pending, (state) => {
				state.statusTheme = 'loading';
			})
			.addCase(fetchSeriesDetailsTheme.fulfilled, (state, action: PayloadAction<
				SeriesDetailsState["theme"]
			>) => {
				state.statusTheme = 'succeeded';
				const seriesDetailsTheme = action.payload;
				state.theme = seriesDetailsTheme;
			})
			.addCase(fetchSeriesDetailsTheme.rejected, (state, action) => {
				state.statusTheme = 'failed';
				state.errorTheme = action.error;
			})
			.addCase(fetchSeriesDetailsThemeNames.pending, (state) => {
				state.statusThemeNames = 'loading';
			})
			.addCase(fetchSeriesDetailsThemeNames.fulfilled, (state, action: PayloadAction<
				SeriesDetailsState["themeNames"]
			>) => {
				state.statusThemeNames = 'succeeded';
				const seriesDetailsThemeNames = action.payload;
				state.themeNames = seriesDetailsThemeNames;
			})
			.addCase(fetchSeriesDetailsThemeNames.rejected, (state, action) => {
				state.statusThemeNames = 'failed';
				state.errorThemeNames = action.error;
			})
			.addCase(fetchSeriesDetailsTobira.pending, (state) => {
				state.statusTobiraData = 'loading';
			})
			.addCase(fetchSeriesDetailsTobira.fulfilled, (state, action: PayloadAction<
				SeriesDetailsState["tobiraData"]
			>) => {
				state.statusTobiraData = 'succeeded';
				state.tobiraData = action.payload;
			})
			.addCase(fetchSeriesDetailsTobira.rejected, (state, action) => {
				state.statusTobiraData = 'failed';
				state.errorTobiraData = action.error;
			})
			.addCase(fetchSeriesStatistics.pending, (state) => {
				state.statusStatistics = 'loading';
			})
			.addCase(fetchSeriesStatistics.fulfilled, (state, action: PayloadAction<{
				statistics: SeriesDetailsState["statistics"],
				hasError: SeriesDetailsState["hasStatisticsError"]
			}>) => {
				state.statusStatistics = 'succeeded';
				const seriesDetailsStatistics = action.payload;
				state.statistics = seriesDetailsStatistics.statistics;
				state.hasStatisticsError = seriesDetailsStatistics.hasError;
			})
			.addCase(fetchSeriesStatistics.rejected, (state, action) => {
				state.statusStatistics = 'failed';
				state.errorStatistics = action.error;
			})
			.addCase(fetchSeriesStatisticsValueUpdate.pending, (state) => {
				state.statusStatisticsValue = 'loading';
			})
			.addCase(fetchSeriesStatisticsValueUpdate.fulfilled, (state, action: PayloadAction<
				any
			>) => {
				state.statusStatisticsValue = 'succeeded';
				state.statistics = action.payload;
			})
			.addCase(fetchSeriesStatisticsValueUpdate.rejected, (state, action) => {
				state.statusStatisticsValue = 'failed';
				state.errorStatisticsValue = action.error;
			})
	}
});

export const {
	setSeriesDetailsTheme,
	setSeriesDetailsMetadata,
	setSeriesDetailsExtendedMetadata,
	setSeriesStatisticsError,
	setSeriesStatistics,
	setDoNothing,
} = seriesDetailsSlice.actions;

// Export the slice reducer as the default export
export default seriesDetailsSlice.reducer;
