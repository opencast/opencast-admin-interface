import axios from "axios";
import {
	prepareAccessPolicyRulesForPost,
	transformAclTemplatesResponse,
} from "../utils/resourceUtils";
import { transformToIdValueArray } from "../utils/utils";
import { addNotification } from "./notificationThunks";
import { NOTIFICATION_CONTEXT_ACCESS } from "../configs/modalConfig";
import { removeNotificationWizardAccess } from "../actions/notificationActions";

// todo: unite following in one fetch method (maybe also move to own file containing all fetches regarding resources endpoint)
// get acl templates
export const fetchAclTemplates = async () => {
	let data = await axios.get("/admin-ng/resources/ACL.json");

	const response = await data.data;

	return transformToIdValueArray(response);
};

// fetch additional actions that a policy allows user to perform on an event
export const fetchAclActions = async () => {
	let data = await axios.get("/admin-ng/resources/ACL.ACTIONS.json");

	const response = await data.data;

	const actions = transformToIdValueArray(response);

	return actions;
};

// fetch all policies of an certain acl template
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const fetchAclTemplateById = async (id) => {
	let response = await axios.get(`/acl-manager/acl/${id}`);

	let acl = response.data.acl;

	return transformAclTemplatesResponse(acl);
};

// fetch roles for select dialogs and access policy pages
// @ts-expect-error TS(7006): Parameter 'target' implicitly has an 'any' type.
export const fetchRolesWithTarget = async (target) => {
	let params = {
		limit: -1,
		target: target,
	};

	let data = await axios.get("/admin-ng/acl/roles.json", { params: params });

	return await data.data;
};

// post new acl to backend
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const postNewAcl = (values) => async (dispatch) => {
	let acls = prepareAccessPolicyRulesForPost(values.acls);

	let data = new URLSearchParams();
	data.append("name", values.name);
	data.append("acl", JSON.stringify(acls));

	axios
		.post("/admin-ng/acl", data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			console.info(response);
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
			dispatch(addNotification("success", "ACL_ADDED"));
		})
		.catch((response) => {
			console.error(response);
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
			dispatch(addNotification("error", "ACL_NOT_SAVED"));
		});
};
// delete acl with provided id
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const deleteAcl = (id) => async (dispatch) => {
	axios
		.delete(`/admin-ng/acl/${id}`)
		.then((res) => {
			console.info(res);
			//add success notification
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
			dispatch(addNotification("success", "ACL_DELETED"));
		})
		.catch((res) => {
			console.error(res);
			// add error notification
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
			dispatch(addNotification("error", "ACL_NOT_DELETED"));
		});
};

// @ts-expect-error TS(7006): Parameter 'acls' implicitly has an 'any' type.
export const checkAcls = (acls) => async (dispatch) => {
	// Remove old notifications of context event-access
	// Helps to prevent multiple notifications for same problem
	dispatch(removeNotificationWizardAccess());

	let check = true;
	let bothRights = false;

	for (let i = 0; acls.length > i; i++) {
		// check if a role is chosen
		if (acls[i].role === "") {
			check = false;
		}

		// check if there is at least one policy with read and write rights
		if (acls[i].read && acls[i].write) {
			bothRights = true;
		}

		// check if each policy has read or write right (at least one checkbox should be checked)
		if (!acls[i].read && !acls[i].write) {
			check = false;
		}
	}

	if (!check) {
		dispatch(
			addNotification(
				"warning",
				"INVALID_ACL_RULES",
				-1,
				null,
				NOTIFICATION_CONTEXT_ACCESS
			)
		);
	}

	if (!bothRights) {
		dispatch(
			addNotification(
				"warning",
				"MISSING_ACL_RULES",
				-1,
				null,
				NOTIFICATION_CONTEXT_ACCESS
			)
		);
		check = false;
	}

	return check;
};
