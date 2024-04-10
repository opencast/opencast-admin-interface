import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TableConfig, aclsTableConfig } from "../configs/tableConfigs/aclsTableConfig";
import axios from 'axios';
import { getURLParams } from '../utils/resourceUtils';
import { RootState } from '../store';

/**
 * This file contains redux reducer for actions affecting the state of acls
 */
type AclResult = {
	acl: {
		ace: {
			action: string,
			allow: boolean,
			role: string,
		}[]
	}
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
