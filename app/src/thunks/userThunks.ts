import axios from "axios";
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

// delete user with provided id
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const deleteUser = (id) => async (dispatch) => {
	// API call for deleting an user
	axios
		.delete(`/admin-ng/users/${id}.json`)
		.then((res) => {
			console.info(res);
			// add success notification
			dispatch(addNotification("success", "USER_DELETED"));
		})
		.catch((res) => {
			console.error(res);
			// add error notification
			dispatch(addNotification("error", "USER_NOT_DELETED"));
		});
};
