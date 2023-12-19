import axios from "axios";
import { transformToIdValueArray } from "../utils/utils";

// get users and their user names
export const fetchUsersAndUsernames = async () => {
	let data = await axios.get(
		"/admin-ng/resources/USERS.NAME.AND.USERNAME.json"
	);

	const response = await data.data;

	return transformToIdValueArray(response);
};
