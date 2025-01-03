import { PayloadAction, SerializedError, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { createAppAsyncThunk } from '../createAsyncThunkWithTypes';
import { LifeCyclePolicy } from './lifeCycleSlice';
import { TransformedAcl } from './aclDetailsSlice';
import { createPolicy } from '../utils/resourceUtils';
import { Ace } from './aclSlice';

/**
 * This file contains redux reducer for actions affecting the state of a lifeCyclePolicy/capture agent
 */
interface LifeCyclePolicyDetailsState extends LifeCyclePolicy {
	statusLifeCyclePolicyDetails: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorLifeCyclePolicyDetails: SerializedError | null,
}

// Initial state of lifeCyclePolicy details in redux store
const initialState: LifeCyclePolicyDetailsState = {
	statusLifeCyclePolicyDetails: 'uninitialized',
	errorLifeCyclePolicyDetails: null,
  actionParameters: {},
	timing: "SPECIFIC_DATE",
	action: "START_WORKFLOW",
	targetType: "EVENT",
	id: "",
	title: "",
	isActive: false,
	isCreatedFromConfig: false,
	actionDate: "",
	cronTrigger: "",
	targetFilters: {},
	accessControlEntries: []
};

// fetch details of certain lifeCyclePolicy from server
export const fetchLifeCyclePolicyDetails = createAppAsyncThunk('lifeCyclePolicyDetails/fetchLifeCyclePolicyDetails', async (id: string) => {
	const res = await axios.get(`/api/lifecyclemanagement/policies/${id}`);
	const data = res.data;

	data.actionParameters = JSON.parse(data.actionParameters)
	data.targetFilters = JSON.parse(data.targetFilters)

	let accessPolicies : {
		id: number,
		allow: boolean,
		role: string,
		action: string,
	}[] = data.accessControlEntries;
	let acls: TransformedAcl[] = [];

		const json = accessPolicies;
		let newPolicies: { [key: string]: TransformedAcl } = {};
		let policyRoles: string[] = [];
		for (let i = 0; i < json.length; i++) {
			const policy: Ace = json[i];
			if (!newPolicies[policy.role]) {
				newPolicies[policy.role] = createPolicy(policy.role);
				policyRoles.push(policy.role);
			}
			if (policy.action === "read" || policy.action === "write") {
				newPolicies[policy.role][policy.action] = policy.allow;
			} else if (policy.allow === true) { //|| policy.allow === "true") {
				newPolicies[policy.role].actions.push(policy.action);
			}
		}
		acls = policyRoles.map((role) => newPolicies[role]);

	data.accessControlEntries = acls;

	return data;
});

// Dummy function for compatability
export const fetchLifeCyclePolicyDetailsAcls = createAppAsyncThunk('lifeCyclePolicyDetails/fetchLifeCyclePolicyDetailsAcls', async (id: string, {getState}) => {
	const state = getState();
	return state.lifeCyclePolicyDetails.accessControlEntries;
});

// Dummy function for compatability
export const updateLifeCyclePolicyAccess = createAppAsyncThunk('lifeCyclePolicyDetails/fetchLifeCyclePolicyDetailsAcls', async (params: {
	id: string,
	policies: { acl: { ace: Ace[] } }
}, {dispatch}) => {
	return false;
});

const lifeCyclePolicyDetailsSlice = createSlice({
	name: 'lifeCyclePolicyDetails',
	initialState,
	reducers: {},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchLifeCyclePolicyDetails.pending, (state) => {
				state.statusLifeCyclePolicyDetails = 'loading';
			})
			.addCase(fetchLifeCyclePolicyDetails.fulfilled, (state, action: PayloadAction<{
				actionParameters: LifeCyclePolicyDetailsState["actionParameters"],
				timing: LifeCyclePolicyDetailsState["timing"],
				action: LifeCyclePolicyDetailsState["action"],
				targetType: LifeCyclePolicyDetailsState["targetType"],
				id: LifeCyclePolicyDetailsState["id"],
				title: LifeCyclePolicyDetailsState["title"],
				isActive: LifeCyclePolicyDetailsState["isActive"],
				isCreatedFromConfig: LifeCyclePolicyDetailsState["isCreatedFromConfig"],
				actionDate: LifeCyclePolicyDetailsState["actionDate"],
				cronTrigger: LifeCyclePolicyDetailsState["cronTrigger"],
				targetFilters: LifeCyclePolicyDetailsState["targetFilters"],
				accessControlEntries: LifeCyclePolicyDetailsState["accessControlEntries"],
			}>) => {
				state.statusLifeCyclePolicyDetails = 'succeeded';
				const lifeCyclePolicyDetails = action.payload;
				state.actionParameters = lifeCyclePolicyDetails.actionParameters;
				state.timing = lifeCyclePolicyDetails.timing;
				state.action = lifeCyclePolicyDetails.action;
				state.targetType = lifeCyclePolicyDetails.targetType;
				state.id = lifeCyclePolicyDetails.id;
				state.title = lifeCyclePolicyDetails.title;
				state.isActive = lifeCyclePolicyDetails.isActive;
				state.isCreatedFromConfig = lifeCyclePolicyDetails.isCreatedFromConfig;
				state.actionDate = lifeCyclePolicyDetails.actionDate;
				state.cronTrigger = lifeCyclePolicyDetails.cronTrigger;
				state.targetFilters = lifeCyclePolicyDetails.targetFilters;
				state.accessControlEntries = lifeCyclePolicyDetails.accessControlEntries;
			})
			.addCase(fetchLifeCyclePolicyDetails.rejected, (state, action) => {
				state.statusLifeCyclePolicyDetails = 'failed';
				state.errorLifeCyclePolicyDetails = action.error;
			});
	}
});

// export const {} = lifeCyclePolicyDetailsSlice.actions;

// Export the slice reducer as the default export
export default lifeCyclePolicyDetailsSlice.reducer;
