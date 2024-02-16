import {
	loadThemesFailure,
	loadThemesInProgress,
	loadThemesSuccess,
} from "../actions/themeActions";
import { buildThemeBody, getURLParams } from "../utils/resourceUtils";
import axios from "axios";
import { addNotification } from "./notificationThunks";

// fetch themes from server
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchThemes = () => async (dispatch, getState) => {
	try {
		dispatch(loadThemesInProgress());

		const state = getState();
		let params = getURLParams(state);

		// /themes.json?limit=0&offset=0&filter={filter}&sort={sort}
		let data = await axios.get("/admin-ng/themes/themes.json", {
			params: params,
		});

		const themes = await data.data;
		dispatch(loadThemesSuccess(themes));
	} catch (e) {
		dispatch(loadThemesFailure());
	}
};

// post new theme to backend
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const postNewTheme = (values) => async (dispatch) => {
	let data = buildThemeBody(values);

	// POST request
	axios
		.post("/admin-ng/themes", data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			console.info(response);
			dispatch(addNotification("success", "THEME_CREATED"));
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification("error", "THEME_NOT_CREATED"));
		});
};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const deleteTheme = (id) => async (dispatch) => {
	axios
		.delete(`/admin-ng/themes/${id}`)
		.then((res) => {
			console.info(res);
			// add success notification
			dispatch(addNotification("success", "THEME_DELETED"));
		})
		.catch((res) => {
			console.error(res);
			// add error notification
			dispatch(addNotification("error", "THEME_NOT_DELETED"));
		});
};
