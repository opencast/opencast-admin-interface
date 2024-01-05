import axios from "axios";
import {
	loadSeriesFailure,
	loadSeriesInProgress,
	loadSeriesMetadataInProgress,
	loadSeriesMetadataSuccess,
	loadSeriesSuccess,
	loadSeriesThemesFailure,
	loadSeriesThemesInProgress,
	loadSeriesThemesSuccess,
	setSeriesDeletionAllowed,
} from "../actions/seriesActions";
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
import { addNotification } from "../slices/notificationSlice";

// fetch series from server
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchSeries = () => async (dispatch, getState) => {
	try {
		dispatch(loadSeriesInProgress());

		const state = getState();
		let params = getURLParams(state);

		// /series.json?sortorganizer={sortorganizer}&sort={sort}&filter={filter}&offset=0&limit=100
		let data = await axios.get("/admin-ng/series/series.json", {
			params: params,
		});

		const series = await data.data;
		dispatch(loadSeriesSuccess(series));
	} catch (e) {
		dispatch(loadSeriesFailure());
		console.error(e);
	}
};

// fetch series metadata from server
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchSeriesMetadata = () => async (dispatch) => {
	try {
		dispatch(loadSeriesMetadataInProgress());

		let data = await axios.get("/admin-ng/series/new/metadata");
		const response = await data.data;

		const mainCatalog = "dublincore/series";
		let metadata = {};
		const extendedMetadata = [];

		for (const metadataCatalog of response) {
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

		dispatch(loadSeriesMetadataSuccess(metadata, extendedMetadata));
	} catch (e) {
		dispatch(loadSeriesFailure());
		console.error(e);
	}
};

// fetch series themes from server
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchSeriesThemes = () => async (dispatch) => {
	try {
		dispatch(loadSeriesThemesInProgress());

		let data = await axios.get("/admin-ng/series/new/themes");

		const response = await data.data;

		const themes = transformToObjectArray(response);

		dispatch(loadSeriesThemesSuccess(themes));
	} catch (e) {
		dispatch(loadSeriesThemesFailure());
		console.error(e);
	}
};

// post new series to backend
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const postNewSeries = (values, metadataInfo, extendedMetadata) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
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
};

// check for events of the series and if deleting the series if it has events is allowed
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const checkForEventsDeleteSeriesModal = (id) => async (dispatch) => {
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
		setSeriesDeletionAllowed(!hasEvents || deleteWithEventsAllowed, hasEvents)
	);
};

// delete series with provided id
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const deleteSeries = (id) => async (dispatch) => {
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
};

// delete series with provided ids
// @ts-expect-error TS(7006): Parameter 'series' implicitly has an 'any' type.
export const deleteMultipleSeries = (series) => async (dispatch) => {
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
};

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
// @ts-expect-error TS(7006): Parameter 'seriesId' implicitly has an 'any' type.
export const hasEvents = async (seriesId) => {
	let data = await axios.get(`/admin-ng/series/${seriesId}/hasEvents.json`);

	return (await data.data).hasEvents;
};

// Get series configuration and flag indicating if series with events is allowed to delete
export const getSeriesConfig = async () => {
	let data = await axios.get("/admin-ng/series/configuration.json");

	const response = await data.data;

	return !!response.deleteSeriesWithEventsAllowed;
};
