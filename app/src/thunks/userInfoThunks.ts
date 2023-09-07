import {
	loadOcVersionFailure,
	loadOcVersionInProgress,
	loadOcVersionSuccess,
	loadUserInfoFailure,
	loadUserInfoInProgress,
	loadUserInfoSuccess,
} from "../actions/userInfoActions";
import axios from "axios";
import { addNotification } from "./notificationThunks";

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchUserInfo = () => async (dispatch) => {
	try {
		dispatch(loadUserInfoInProgress());

		let data = await axios.get("/info/me.json");

		let userInfo = await data.data;

		// add direct information about user being an admin
		userInfo = {
			isAdmin: userInfo.roles.includes("ROLE_ADMIN"),
			isOrgAdmin: userInfo.roles.includes(userInfo.org.adminRole),
			...userInfo,
		};

		dispatch(loadUserInfoSuccess(userInfo));
	} catch (e) {
		console.error(e);
		dispatch(loadUserInfoFailure());
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
		dispatch(addNotification("error", "PROBLEM_ON_START"));
	}
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchOcVersion = () => async (dispatch) => {
	try {
		dispatch(loadOcVersionInProgress());

		let data = await axios.get("/sysinfo/bundles/version?prefix=opencast");

		let ocVersion = await data.data;

		dispatch(loadOcVersionSuccess(ocVersion));
	} catch (e) {
		console.error(e);
		dispatch(loadOcVersionFailure());
	}
};
