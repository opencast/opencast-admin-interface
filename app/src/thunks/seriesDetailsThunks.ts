import axios from "axios";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from "lodash";
import {
	loadSeriesDetailsAclsSuccess,
	loadSeriesDetailsFailure,
	loadSeriesDetailsFeedsSuccess,
	loadSeriesDetailsInProgress,
	loadSeriesDetailsMetadataSuccess,
	loadSeriesDetailsThemeNamesFailure,
	loadSeriesDetailsThemeNamesInProgress,
	loadSeriesDetailsThemeNamesSuccess,
	loadSeriesDetailsThemeSuccess,
	setSeriesDetailsExtendedMetadata,
	setSeriesDetailsMetadata,
	setSeriesDetailsTheme,
	loadSeriesStatisticsInProgress,
	loadSeriesStatisticsSuccess,
	loadSeriesStatisticsFailure,
	updateSeriesStatisticsSuccess,
	updateSeriesStatisticsFailure,
} from "../actions/seriesDetailsActions";
import {
	getSeriesDetailsExtendedMetadata,
	getSeriesDetailsMetadata,
	getSeriesDetailsThemeNames,
	getStatistics,
} from "../selectors/seriesDetailsSelectors";
import { addNotification } from "../slices/notificationSlice";
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
} from "../slices/statisticsSlice";

// fetch metadata of certain series from server
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const fetchSeriesDetailsMetadata = (id) => async (dispatch) => {
	try {
		dispatch(loadSeriesDetailsInProgress());

		// fetch metadata
		let data = await axios.get(`/admin-ng/series/${id}/metadata.json`);

		const metadataResponse = await data.data;

		const mainCatalog = "dublincore/series";
		let seriesMetadata = {};
		let extendedMetadata = [];

		for (const catalog of metadataResponse) {
			if (catalog.flavor === mainCatalog) {
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
				seriesMetadata = transformMetadataCollection({ ...catalog });
			} else {
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
				extendedMetadata.push(transformMetadataCollection({ ...catalog }));
			}
		}

		dispatch(
			loadSeriesDetailsMetadataSuccess(seriesMetadata, extendedMetadata)
		);
	} catch (e) {
		dispatch(loadSeriesDetailsFailure());
	}
};

// fetch acls of certain series from server
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const fetchSeriesDetailsAcls = (id) => async (dispatch) => {
	try {
		dispatch(loadSeriesDetailsInProgress());

		// fetch acl
		let data = await axios.get(`/admin-ng/series/${id}/access.json`);

		const response = await data.data;

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

// @ts-expect-error TS(7034): Variable 'seriesAcls' implicitly has type 'any[]' ... Remove this comment to see the full error message
		let seriesAcls = [];
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

// @ts-expect-error TS(7005): Variable 'seriesAcls' implicitly has an 'any[]' ty... Remove this comment to see the full error message
		dispatch(loadSeriesDetailsAclsSuccess(seriesAcls));
	} catch (e) {
		dispatch(loadSeriesDetailsFailure());
		console.error(e);
	}
};

// fetch feeds of certain series from server
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const fetchSeriesDetailsFeeds = (id) => async (dispatch) => {
	try {
		dispatch(loadSeriesDetailsInProgress());

		// fetch feeds
		let data = await axios.get("/admin-ng/feeds/feeds");

		const feedsResponse = await data.data;

		console.info(feedsResponse);

// @ts-expect-error TS(7034): Variable 'seriesFeeds' implicitly has type 'any[]'... Remove this comment to see the full error message
		let seriesFeeds = [];
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

// @ts-expect-error TS(7005): Variable 'seriesFeeds' implicitly has an 'any[]' t... Remove this comment to see the full error message
		dispatch(loadSeriesDetailsFeedsSuccess(seriesFeeds));
	} catch (e) {
		console.error(e);
		dispatch(loadSeriesDetailsFailure());
	}
};

// fetch theme of certain series from server
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const fetchSeriesDetailsTheme = (id) => async (dispatch) => {
	try {
		dispatch(loadSeriesDetailsInProgress());

		let data = await axios.get(`/admin-ng/series/${id}/theme.json`);

		const themeResponse = await data.data;

		let seriesTheme = "";

		// check if series has a theme
		if (!_.isEmpty(themeResponse)) {
			// transform response for further use
			seriesTheme = transformToIdValueArray(themeResponse)[0].value;
		}

		dispatch(loadSeriesDetailsThemeSuccess(seriesTheme));
	} catch (e) {
		console.error(e);
		dispatch(loadSeriesDetailsFailure());
	}
};

// fetch names of possible themes from server
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchNamesOfPossibleThemes = () => async (dispatch) => {
	try {
		dispatch(loadSeriesDetailsThemeNamesInProgress());

		let data = await axios.get("/admin-ng/resources/THEMES.NAME.json");

		const response = await data.data;

		// transform response for further use
		let themeNames = transformToIdValueArray(response);

		dispatch(loadSeriesDetailsThemeNamesSuccess(themeNames));
	} catch (e) {
		dispatch(loadSeriesDetailsThemeNamesFailure());
	}
};

// update series with new metadata
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const updateSeriesMetadata = (id, values) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch,
// @ts-expect-error TS(7006): Parameter 'getState' implicitly has an 'any' type.
	getState
) => {
	try {
		let metadataInfos = getSeriesDetailsMetadata(getState());

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
	} catch (e) {
		console.error(e);
	}
};

// update series with new metadata
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const updateExtendedSeriesMetadata = (id, values, catalog) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch,
// @ts-expect-error TS(7006): Parameter 'getState' implicitly has an 'any' type.
	getState
) => {
	try {
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

		const oldExtendedMetadata = getSeriesDetailsExtendedMetadata(getState());
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
	} catch (e) {
		console.error(e);
	}
};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const updateSeriesAccess = (id, policies) => async (dispatch) => {
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
};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const updateSeriesTheme = (id, values) => async (dispatch, getState) => {
	let themeNames = getSeriesDetailsThemeNames(getState());

// @ts-expect-error TS(7006): Parameter 'theme' implicitly has an 'any' type.
	let themeId = themeNames.find((theme) => theme.value === values.theme).id;

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
					key: "SERIES_THEME_REPROCESS_EXISTING_EVENTS",
					duration: 10,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
		})
		.catch((response) => {
			console.error(response);
		});
};

// thunks for statistics

// TODO: BROKEN! FIX THIS WHEN MODERNIZING REDUX TOOLKIT FOR EVENTS
// @ts-expect-error TS(7006): Parameter 'seriesId' implicitly has an 'any' type.
export const fetchSeriesStatistics = (seriesId) => async (dispatch) => {
	// dispatch(
	// 	fetchStatistics(
	// 		seriesId,
	// 		"series",
	// 		getStatistics,
	// 		loadSeriesStatisticsInProgress,
	// 		loadSeriesStatisticsSuccess,
	// 		loadSeriesStatisticsFailure
	// 	)
	// );
};

// TODO: BROKEN! FIX THIS WHEN MODERNIZING REDUX TOOLKIT FOR EVENTS
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
	// dispatch(
	// 	fetchStatisticsValueUpdate(
	// 		seriesId,
	// 		"series",
	// 		providerId,
	// 		from,
	// 		to,
	// 		dataResolution,
	// 		timeMode,
	// 		getStatistics,
	// 		updateSeriesStatisticsSuccess,
	// 		updateSeriesStatisticsFailure
	// 	)
	// );
};
