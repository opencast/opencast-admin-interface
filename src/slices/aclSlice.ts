import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TableConfig, aclsTableConfig } from "../configs/tableConfigs/aclsTableConfig";
import axios from 'axios';
import { getURLParams, prepareAccessPolicyRulesForPost, transformAclTemplatesResponse } from '../utils/resourceUtils';
import { transformToIdValueArray } from '../utils/utils';
import { NOTIFICATION_CONTEXT_ACCESS } from '../configs/modalConfig';
import { addNotification, removeNotificationWizardAccess } from './notificationSlice';
import { AppDispatch } from '../store';
import { RootState } from '../store';

/**
 * This file contains redux reducer for actions affecting the state of acls
 */
export type Ace = {
	action: string,
	allow: boolean,
	role: string,
}

export type Acl = {
	ace: Ace[]
}

export type Role = {
	description: string | undefined,
	name: string,
	organization: string,
	type: string,
}

type AclResult = {
	acl: Acl,
	id: number,
	name: string,
	organizationId: string,
}

type AclsState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	results: AclResult[],
	columns: TableConfig["columns"],
	total: number,
	count: number,
	offset: number,
	limit: number,
};

// Fill columns initially with columns defined in aclsTableConfig
const initialColumns = aclsTableConfig.columns.map((column) => ({
	...column,
	deactivated: false,
}));

// Initial state of acls in redux store
const initialState: AclsState = {
	status: 'uninitialized',
	error: null,
	results: [],
	columns: initialColumns,
	total: 0,
	count: 0,
	offset: 0,
	limit: 0,
};

export const fetchAcls = createAsyncThunk('acls/fetchAcls', async (_, { getState }) => {
	const state = getState();
	let params = getURLParams(state as RootState);
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	const res = await axios.get("/admin-ng/acl/acls.json", { params: params });
	return res.data;
});

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

// fetch defaults for the access policy tab in the details views
export const fetchAclDefaults = async () => {
	let data = await axios.get("/admin-ng/resources/ACL.DEFAULTS.json");

	const response = await data.data;

	return response;
};

// fetch all policies of an certain acl template
export const fetchAclTemplateById = async (id: string) => {
	let response = await axios.get(`/acl-manager/acl/${id}`);

	let acl = response.data.acl;

	return transformAclTemplatesResponse(acl);
};

// fetch roles for select dialogs and access policy pages
export const fetchRolesWithTarget = async (target: string) => {
	let params = {
		limit: -1,
		target: target,
	};

	let response = await axios.get("/admin-ng/acl/roles.json", { params: params });
	let data : Role[] = response.data

	return await data;
};

// post new acl to backend
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const postNewAcl = (values) => async (dispatch: AppDispatch) => {
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
			dispatch(addNotification({type: "success", key: "ACL_ADDED"}));
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification({type: "error", key: "ACL_NOT_SAVED"}));
		});
};
// delete acl with provided id
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const deleteAcl = (id) => async (dispatch: AppDispatch) => {
	axios
		.delete(`/admin-ng/acl/${id}`)
		.then((res) => {
			console.info(res);
			//add success notification
			dispatch(addNotification({type: "success", key: "ACL_DELETED"}));
		})
		.catch((res) => {
			console.error(res);
			// add error notification
			dispatch(addNotification({type: "error", key: "ACL_NOT_DELETED"}));
		});
};

// @ts-expect-error TS(7006):
export const checkAcls = (acls) => async (dispatch: AppDispatch) => {
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
			addNotification({
				type: "warning",
				key: "INVALID_ACL_RULES",
				duration: -1,
				parameter: null,
				context: NOTIFICATION_CONTEXT_ACCESS
			})
		);
	}

	if (!bothRights) {
		dispatch(
			addNotification({
				type: "warning",
				key: "MISSING_ACL_RULES",
				duration: -1,
				parameter: null,
				context: NOTIFICATION_CONTEXT_ACCESS
			})
		);
		check = false;
	}

	return check;
};

const aclsSlice = createSlice({
	name: 'acls',
	initialState,
	reducers: {
		setAclColumns(state, action: PayloadAction<{
			updatedColumns: AclsState["columns"],
		}>) {
			state.columns = action.payload.updatedColumns;
		},
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchAcls.pending, (state) => {
				state.status = 'loading';
			})
			// Pass the generated action creators to `.addCase()`
			.addCase(fetchAcls.fulfilled, (state, action: PayloadAction<{
				total: AclsState["total"],
				count: AclsState["count"],
				limit: AclsState["limit"],
				offset: AclsState["offset"],
				results: AclsState["results"],
			}>) => {
				// Same "mutating" update syntax thanks to Immer
				state.status = 'succeeded';
				const acls = action.payload;
				state.total = acls.total;
				state.count = acls.count;
				state.limit = acls.limit;
				state.offset = acls.offset;
				state.results = acls.results;
			})
			.addCase(fetchAcls.rejected, (state, action) => {
				state.status = 'failed';
				state.results = [];
				state.error = action.error;
			});
	}
});

export const { setAclColumns } = aclsSlice.actions;

// Export the slice reducer as the default export
export default aclsSlice.reducer;
