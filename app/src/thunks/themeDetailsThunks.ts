import axios from "axios";
import {
	loadThemeDetailsFailure,
	loadThemeDetailsInProgress,
	loadThemeDetailsSuccess,
	loadThemeUsageSuccess,
} from "../actions/themeDetailsActions";
import { buildThemeBody } from "../utils/resourceUtils";
import { addNotification } from "../slices/notificationSlice";

// fetch details of certain theme from server
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const fetchThemeDetails = (id) => async (dispatch) => {
	try {
		dispatch(loadThemeDetailsInProgress());

		//fetch theme details
		let data = await axios.get(`/admin-ng/themes/${id}.json`);

		let themeDetails = await data.data;

		dispatch(loadThemeDetailsSuccess(themeDetails));
	} catch (e) {
		dispatch(loadThemeDetailsFailure());
	}
};

// fetch usage of a certain theme
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const fetchUsage = (id) => async (dispatch) => {
	try {
		dispatch(loadThemeDetailsInProgress());

		let data = await axios.get(`/admin-ng/themes/${id}/usage.json`);

		const themeUsage = await data.data;

		dispatch(loadThemeUsageSuccess(themeUsage));
	} catch (e) {
		console.log(e);
		dispatch(loadThemeDetailsFailure());
	}
};

// update a certain theme
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const updateThemeDetails = (id, values) => async (dispatch) => {
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
};
