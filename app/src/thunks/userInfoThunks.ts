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

type InfoMe = {
  org: {
    anonymousRole: string,
    name: string,
    adminRole: string,
    id: string,
    properties: {[key: string]: string}
  },
  roles: string[],
  userRole: string | undefined,
  user : {
    provider: string,
    name: string,
    email: string,
    username: string,
  }
}

export interface UserInfo extends InfoMe {
  isAdmin: boolean,
  isOrgAdmin: boolean,
}

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchUserInfo = () => async (dispatch) => {
	try {
		dispatch(loadUserInfoInProgress());

		let data = await axios.get<InfoMe>("/info/me.json");

		let response = data.data;

		// add direct information about user being an admin
		let userInfo: UserInfo = {
			isAdmin: response.roles.includes("ROLE_ADMIN"),
			isOrgAdmin: response.roles.includes(response.org.adminRole),
			...response,
		};

		dispatch(loadUserInfoSuccess(userInfo));
	} catch (e) {
		console.error(e);
		dispatch(loadUserInfoFailure());
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
		dispatch(addNotification("error", "PROBLEM_ON_START"));
	}
};

export type OcVersion = {
  "last-modified": number,
  consistent: boolean,
  version: string,
  buildNumber: string,
}

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchOcVersion = () => async (dispatch) => {
	try {
		dispatch(loadOcVersionInProgress());

		let data = await axios.get<OcVersion>("/sysinfo/bundles/version?prefix=opencast");

		let ocVersion = data.data;

		dispatch(loadOcVersionSuccess(ocVersion));
	} catch (e) {
		console.error(e);
		dispatch(loadOcVersionFailure());
	}
};
