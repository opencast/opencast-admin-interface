import axios from "axios";
import {
	loadGroupsFailure,
	loadGroupsInProgress,
	loadGroupsSuccess,
} from "../actions/groupActions";
import { buildGroupBody, getURLParams } from "../utils/resourceUtils";
import { addNotification } from "../slices/notificationSlice";

// fetch groups from server
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchGroups = () => async (dispatch, getState) => {
	try {
		dispatch(loadGroupsInProgress());

		const state = getState();
		let params = getURLParams(state);

		// /groups.json?limit=0&offset=0&filter={filter}&sort={sort}
		let data = await axios.get("/admin-ng/groups/groups.json", {
			params: params,
		});

		const groups = await data.data;
		dispatch(loadGroupsSuccess(groups));
	} catch (e) {
		dispatch(loadGroupsFailure());
	}
};

// post new group to backend
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const postNewGroup = (values) => async (dispatch) => {
	// get URL params used for post request
	let data = buildGroupBody(values);

	// POST request
	axios
		.post("/admin-ng/groups", data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			console.info(response);
			dispatch(addNotification({type: "success", key: "GROUP_ADDED"}));
		})
		.catch((response) => {
			console.error(response);
			if (response.status === 409) {
				dispatch(addNotification({type:"error", key: "GROUP_CONFLICT"}));
			} else {
				dispatch(addNotification({type: "error", key: "GROUP_NOT_SAVED"}));
			}
		});
};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const deleteGroup = (id) => async (dispatch) => {
	// API call for deleting a group
	axios
		.delete(`/admin-ng/groups/${id}`)
		.then((res) => {
			console.info(res);
			// add success notification
			dispatch(addNotification({type: "success", key: "GROUP_DELETED"}));
		})
		.catch((res) => {
			console.error(res);
			// add error notification
			dispatch(addNotification({type: "error", key: "GROUP_NOT_DELETED"}));
		});
};
