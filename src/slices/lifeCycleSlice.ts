import { PayloadAction, SerializedError, createSlice } from '@reduxjs/toolkit'
import { TableConfig } from "../configs/tableConfigs/aclsTableConfig";
import { lifeCyclePolicyTableConfig } from "../configs/tableConfigs/lifeCyclePoliciesTableConfig";
import axios from 'axios';
import { getURLParams } from '../utils/resourceUtils';
import { createAppAsyncThunk } from '../createAsyncThunkWithTypes';
import { TransformedAcl } from './aclDetailsSlice';

type LifeCyclePolicyTiming = "SPECIFIC_DATE" | "REPEATING" | "ALWAYS";
type LifeCyclePolicyAction = "START_WORKFLOW"
type LifeCyclePolicyTargetType = "EVENT"

export type LifeCyclePolicy = {
	actionParameters: { [key: string]: unknown }, // JSON. Variable, depends on action
	timing: LifeCyclePolicyTiming,
	action: LifeCyclePolicyAction,
	targetType: LifeCyclePolicyTargetType,
	id: string,
	title: string,
	isActive: boolean,
	isCreatedFromConfig: boolean,
	actionDate: string, // Date
	cronTrigger: string,
	targetFilters: { [key: string]: {
		value: string,
		type: "SEARCH" | "WILDCARD" | "GREATER_THAN" | "LESS_THAN",
		must: boolean
	}},
	accessControlEntries: TransformedAcl[]
}

type LifeCycleState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	results: LifeCyclePolicy[],
	columns: TableConfig["columns"],
	total: number,
	count: number,
	offset: number,
	limit: number,
};

// Fill columns initially with columns defined in aclsTableConfig
const initialColumns = lifeCyclePolicyTableConfig.columns.map((column) => ({
	...column,
	deactivated: false,
}));

// Initial state of acls in redux store
const initialState: LifeCycleState = {
	status: 'uninitialized',
	error: null,
	results: [],
	columns: initialColumns,
	total: 0,
	count: 0,
	offset: 0,
	limit: 0,
};

export const fetchLifeCyclePolicies = createAppAsyncThunk('lifeCycle/fetchLifeCyclePolicies', async (_, { getState }) => {
	const state = getState();
	let params = getURLParams(state);
	const res = await axios.get("/api/lifecyclemanagement/policies", { params: params });
	return res.data;
});

const lifeCycleSlice = createSlice({
	name: 'lifeCycle',
	initialState,
	reducers: {
		setLifeCycleColumns(state, action: PayloadAction<
			LifeCycleState["columns"]
		>) {
			state.columns = action.payload;
		},
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchLifeCyclePolicies.pending, (state) => {
				state.status = 'loading';
			})
			// Pass the generated action creators to `.addCase()`
			.addCase(fetchLifeCyclePolicies.fulfilled, (state, action: PayloadAction<{
				total: LifeCycleState["total"],
				count: LifeCycleState["count"],
				limit: LifeCycleState["limit"],
				offset: LifeCycleState["offset"],
				results: LifeCycleState["results"],
			}>) => {
				// Same "mutating" update syntax thanks to Immer
				state.status = 'succeeded';
				const policies = action.payload;
				state.total = policies.total;
				state.count = policies.count;
				state.limit = policies.limit;
				state.offset = policies.offset;
				state.results = policies.results;
			})
			.addCase(fetchLifeCyclePolicies.rejected, (state, action) => {
				state.status = 'failed';
				state.results = [];
				state.error = action.error;
			});
	}
});

export const { setLifeCycleColumns } = lifeCycleSlice.actions;

// Export the slice reducer as the default export
export default lifeCycleSlice.reducer;
