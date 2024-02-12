import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from "lodash";
import {
	getSeriesDetailsExtendedMetadata,
	getSeriesDetailsMetadata,
	getSeriesDetailsThemeNames,
	getStatistics,
} from "../selectors/seriesDetailsSelectors";
import { addNotification } from "../thunks/notificationThunks";
import {
	createPolicy,
	transformMetadataCollection,
	transformMetadataForUpdate,
} from "../utils/resourceUtils";
import { transformToIdValueArray } from "../utils/utils";
import { NOTIFICATION_CONTEXT } from "../configs/modalConfig";
import {
	fetchStatistics,
	fetchStatisticsValueUpdate,
} from "../thunks/statisticsThunks";
import { RootState } from '../store';

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
  metadata: MetadataCatalog,
	extendedMetadata: MetadataCatalog[],
	feeds: Feed[],
	acl: Acl[],
	theme: string,
	themeNames: { id: string, value: string }[],
	fetchingStatisticsInProgress: boolean,
	statistics: any[],
	hasStatisticsError: boolean,
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
};

// fetch metadata of certain series from server
export const fetchSeriesDetailsMetadata = createAsyncThunk('seriesDetails/fetchSeriesDetailsMetadata', async (id: any) => {
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
export const fetchSeriesDetailsAcls = createAsyncThunk('seriesDetails/fetchSeriesDetailsAcls', async (id: any, {dispatch}) => {
	const res = await axios.get(`/admin-ng/series/${id}/access.json`);
	const response = res.data;

	if (!!response.series_access.locked) {
		dispatch(
			addNotification(
				"warning",
				"SERIES_ACL_LOCKED",
				-1,
				null,
				NOTIFICATION_CONTEXT
			)
		);
	}

	let seriesAcls: any[] = [];
	if (!!response.series_access) {
		const json = JSON.parse(response.series_access.acl).acl.ace;
		let policies = {};
// @ts-expect-error TS(7034): Variable 'policyRoles' implicitly has type 'any[]'... Remove this comment to see the full error message
		let policyRoles = [];
// @ts-expect-error TS(7006): Parameter 'policy' implicitly has an 'any' type.
		json.forEach((policy) => {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			if (!policies[policy.role]) {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				policies[policy.role] = createPolicy(policy.role);
				policyRoles.push(policy.role);
			}
			if (policy.action === "read" || policy.action === "write") {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				policies[policy.role][policy.action] = policy.allow;
			} else if (policy.allow === true || policy.allow === "true") {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				policies[policy.role].actions.push(policy.action);
			}
		});
// @ts-expect-error TS(7005): Variable 'policyRoles' implicitly has an 'any[]' t... Remove this comment to see the full error message
		seriesAcls = policyRoles.map((role) => policies[role]);
	}

	return seriesAcls;
});

// fetch feeds of certain series from server
export const fetchSeriesDetailsFeeds = createAsyncThunk('seriesDetails/fetchSeriesDetailsFeeds', async (id: any) => {
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
export const fetchSeriesDetailsTheme = createAsyncThunk('seriesDetails/fetchSeriesDetailsTheme', async (id: any) => {
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
export const updateSeriesMetadata = createAsyncThunk('seriesDetails/updateSeriesMetadata', async (params: {id: any, values: any}, {dispatch, getState}) => {
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
export const updateExtendedSeriesMetadata = createAsyncThunk('seriesDetails/updateExtendedSeriesMetadata', async (params: {id: any, values: any, catalog: any}, {dispatch, getState}) => {
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

export const updateSeriesAccess = createAsyncThunk('seriesDetails/updateSeriesAccess', async (params: {id: any, policies: any}, {dispatch}) => {
	const { id, policies } = params;

	let data = new URLSearchParams();

	data.append("acl", JSON.stringify(policies));
// @ts-expect-error TS(2345): Argument of type 'boolean' is not assignable to pa... Remove this comment to see the full error message
	data.append("override", true);

	return axios
		.post(`/admin-ng/series/${id}/access`, data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((res) => {
			console.info(res);
			dispatch(
				addNotification(
					"info",
					"SAVED_ACL_RULES",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
			return true;
		})
		.catch((res) => {
			console.error(res);
			dispatch(
				addNotification(
					"error",
					"ACL_NOT_SAVED",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
			return false;
		});
});

export const updateSeriesTheme = createAsyncThunk('seriesDetails/updateSeriesTheme', async (params: {id: any, values: any}, {dispatch, getState}) => {
	const { id, values } = params;

	let themeNames = getSeriesDetailsThemeNames(getState() as RootState);

	let themeId = themeNames.find((theme) => theme.value === values.theme)?.id;

	if (!themeId) {
		console.error("Can't update series theme. " + values.theme + " not found");
		dispatch(
			addNotification(
				"error",
				"SERIES_NOT_SAVED",
				10,
				null,
				NOTIFICATION_CONTEXT
			)
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
				addNotification(
					"warning",
					"SERIES_THEME_REPROCESS_EXISTING_EVENTS",
					10,
					null,
					NOTIFICATION_CONTEXT
				)
			);
		})
		.catch((response) => {
			console.error(response);
		});
});

// thunks for statistics
// This is probably not the optimal way to update these thunks to reduxToolkit, but
// it works for now

// @ts-expect-error TS(7006): Parameter 'seriesId' implicitly has an 'any' type.
export const fetchSeriesStatistics = (seriesId) => async (dispatch) => {
	dispatch(
		fetchStatistics(
			seriesId,
			"series",
			getStatistics,
			setDoNothing,
			setSeriesStatistics,	// setSeriesStatisticsAndStatisticsError
			setSeriesStatisticsError
		)
	);
};

export const fetchSeriesStatisticsValueUpdate = (
// @ts-expect-error TS(7006): Parameter 'seriesId' implicitly has an 'any' type.
	seriesId,
// @ts-expect-error TS(7006): Parameter 'providerId' implicitly has an 'any' typ... Remove this comment to see the full error message
	providerId,
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
	from,
// @ts-expect-error TS(7006): Parameter 'to' implicitly has an 'any' type.
	to,
// @ts-expect-error TS(7006): Parameter 'dataResolution' implicitly has an 'any'... Remove this comment to see the full error message
	dataResolution,
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
	timeMode
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch) => {
	dispatch(
		fetchStatisticsValueUpdate(
			seriesId,
			"series",
			providerId,
			from,
			to,
			dataResolution,
			timeMode,
			getStatistics,
			setSeriesStatistics,
			setDoNothing,
		)
	);
};

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
		// This was intended for use in statisticsThunks.ts, but since it has
		// different parameters we can't use it there yet.
		// TODO: Employ this after Modernizing redux is complete.
		// setSeriesStatisticsAndStatisticsError(state, action: PayloadAction<{
		// 	statistics: SeriesDetailsState["statistics"],
		// 	hasStatisticsError: SeriesDetailsState["hasStatisticsError"],
		// }>) {
		// 	state.statistics = action.payload.statistics ?? [];
		// 	state.hasStatisticsError = action.payload.hasStatisticsError;
		// },
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
	}
});

export const {
	setSeriesDetailsTheme,
	setSeriesDetailsMetadata,
	setSeriesDetailsExtendedMetadata,
	// setSeriesStatisticsAndStatisticsError,
	setSeriesStatisticsError,
	setSeriesStatistics,
	setDoNothing,
} = seriesDetailsSlice.actions;

// Export the slice reducer as the default export
export default seriesDetailsSlice.reducer;
