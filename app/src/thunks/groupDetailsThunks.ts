import {
	loadGroupDetailsFailure,
	loadGroupDetailsInProgress,
	loadGroupDetailsSuccess,
} from "../actions/groupDetailsActions";
import axios from "axios";
import { addNotification } from "../slices/notificationSlice";
import { buildGroupBody } from "../utils/resourceUtils";

// fetch details about certain group from server
// @ts-expect-error TS(7006): Parameter 'groupName' implicitly has an 'any' type... Remove this comment to see the full error message
export const fetchGroupDetails = (groupName) => async (dispatch) => {
	try {
		dispatch(loadGroupDetailsInProgress());

		let data = await axios.get(`/admin-ng/groups/${groupName}`);

		const response = await data.data;

		let users = [];
		if (response.users.length > 0) {
// @ts-expect-error TS(7006): Parameter 'user' implicitly has an 'any' type.
			users = response.users.map((user) => {
				return {
					id: user.username,
					name: user.name,
				};
			});
		}

		const groupDetails = {
			role: response.role,
			roles: response.roles,
			name: response.name,
			description: response.description,
			id: response.id,
			users: users,
		};

		dispatch(loadGroupDetailsSuccess(groupDetails));
	} catch (e) {
		dispatch(loadGroupDetailsFailure());
		console.error(e);
	}
};

// update details of a certain group
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const updateGroupDetails = (values, groupId) => async (dispatch) => {
	// get URL params used for put request
	let data = buildGroupBody(values);

	// PUT request
	axios
		.put(`/admin-ng/groups/${groupId}`, data)
		.then((response) => {
			console.info(response);
			dispatch(addNotification({type: "success", key: "GROUP_UPDATED"}));
		})
		.catch((response) => {
			console.error(response);
			if (response.status === 409) {
				dispatch(addNotification({type: "error", key: "GROUP_CONFLICT"}));
			} else {
				dispatch(addNotification({type: "error", key: "GROUP_NOT_SAVED"}));
			}
		});
};
