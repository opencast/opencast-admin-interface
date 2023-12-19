import axios from "axios";
import { buildUserBody } from "../utils/resourceUtils";
import { transformToIdValueArray } from "../utils/utils";
import { addNotification } from "./notificationThunks";

// get users and their user names
export const fetchUsersAndUsernames = async () => {
	let data = await axios.get(
		"/admin-ng/resources/USERS.NAME.AND.USERNAME.json"
	);

	const response = await data.data;

	return transformToIdValueArray(response);
};

// new user to backend
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const postNewUser = (values) => async (dispatch) => {
	// get URL params used for post request
	let data = buildUserBody(values);

	// POST request
	axios
		.post("/admin-ng/users", data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			console.info(response);
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
			dispatch(addNotification("success", "USER_ADDED"));
		})
		.catch((response) => {
			console.error(response);
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
			dispatch(addNotification("error", "USER_NOT_SAVED"));
		});
};

// delete user with provided id
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const deleteUser = (id) => async (dispatch) => {
	// API call for deleting an user
	axios
		.delete(`/admin-ng/users/${id}.json`)
		.then((res) => {
			console.info(res);
			// add success notification
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
			dispatch(addNotification("success", "USER_DELETED"));
		})
		.catch((res) => {
			console.error(res);
			// add error notification
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
			dispatch(addNotification("error", "USER_NOT_DELETED"));
		});
};
