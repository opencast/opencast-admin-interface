import { createSlice } from '@reduxjs/toolkit'
import { aclsTableConfig } from "../configs/tableConfigs/aclsTableConfig";

/**
 * This file contains redux reducer for actions affecting the state of acls
 */

// Fill columns initially with columns defined in aclsTableConfig
const initialColumns = aclsTableConfig.columns.map((column) => ({
	...column,
	deactivated: false,
}));

// Initial state of acls in redux store
const initialState = {
	isLoading: false,
	results: [],
	columns: initialColumns,
	total: 0,
	count: 0,
	offset: 0,
	limit: 0,
};

const aclsSlice = createSlice({
  name: 'acls',
  initialState,
  reducers: {
    loadedACLsInProgress(state) {
      state.isLoading = true;
    },
    loadedACLsSuccess(state, action) {
      const { acls } = action.payload;
      state.isLoading = false;
      state.total = acls.total;
      state.count = acls.count;
      state.limit = acls.limit;
      state.offset = acls.offset;
      state.results = acls.results;
    },
    loadedACLsFailure(state) {
      state.isLoading = false;
    },
    setACLColumns(state, action) {
      const { updatedColumns } = action.payload;
      state.columns = updatedColumns;
    },
  }
})

export const {
  loadedACLsInProgress,
  loadedACLsSuccess,
  loadedACLsFailure,
  setACLColumns,
} = aclsSlice.actions

// Export the slice reducer as the default export
export default aclsSlice.reducer
