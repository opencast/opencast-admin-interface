import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { aclsTableConfig } from "../configs/tableConfigs/aclsTableConfig";
import axios from 'axios';
import { getURLParams } from '../utils/resourceUtils';

/**
 * This file contains redux reducer for actions affecting the state of acls
 */
type ACLsState = {
  status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
  error: SerializedError | null,
	results: any[],     // TODO: proper typing
	columns: any,       // TODO: proper typing, derive from `initialColumns`
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
const initialState: ACLsState = {
	status: 'uninitialized',
  error: null,
	results: [],
	columns: initialColumns,
	total: 0,
	count: 0,
	offset: 0,
	limit: 0,
};

export const fetchACLs = createAsyncThunk('acls/fetchACLs', async (_, { getState }) => {
  const state = getState();
  let params = getURLParams(state);
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
    setACLColumns(state, action: PayloadAction<{
      updatedColumns: ACLsState["columns"],
    }>) {
      state.columns = action.payload.updatedColumns;
    },
  },
  // These are used for thunks
  extraReducers: builder => {
    builder
      .addCase(fetchACLs.pending, (state) => {
        state.status = 'loading';
      })
      // Pass the generated action creators to `.addCase()`
      .addCase(fetchACLs.fulfilled, (state, action: PayloadAction<{
        total: ACLsState["total"],
        count: ACLsState["count"],
        limit: ACLsState["limit"],
        offset: ACLsState["offset"],
        results: ACLsState["results"],
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
      .addCase(fetchACLs.rejected, (state, action) => {
        state.status = 'failed'
        state.results = []
        state.error = action.error
      })
  }
})

export const {
  setACLColumns,
} = aclsSlice.actions

// Export the slice reducer as the default export
export default aclsSlice.reducer;
