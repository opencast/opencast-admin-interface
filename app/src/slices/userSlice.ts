import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { usersTableConfig } from "../configs/tableConfigs/usersTableConfig";
import axios from 'axios';
import { getURLParams } from "../utils/resourceUtils";

/**
 * This file contains redux reducer for actions affecting the state of users
 */
type UsersState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	results: any[],		 // TODO: proper typing
	columns: any,			 // TODO: proper typing, derive from `initialColumns`
	total: number,
	count: number,
	offset: number,
	limit: number,
};

// Fill columns initially with columns defined in usersTableConfig
const initialColumns = usersTableConfig.columns.map((column) => ({
	...column,
	deactivated: false,
}));

// Initial state of users in redux store
const initialState: UsersState = {
	status: 'uninitialized',
  error: null,
	results: [],
	columns: initialColumns,
	total: 0,
	count: 0,
	offset: 0,
	limit: 0,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { getState }) => {
	const state = getState();
	let params = getURLParams(state);
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	const res = await axios.get("/admin-ng/users/users.json", { params: params });
	return res.data;
});

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUserColumns(state, action: PayloadAction<{
			updatedColumns: UsersState["columns"],
		}>) {
			state.columns = action.payload.updatedColumns;
		},
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<{
				total: UsersState["total"],
				count: UsersState["count"],
				limit: UsersState["limit"],
				offset: UsersState["offset"],
				results: UsersState["results"],
			}>) => {
				state.status = 'succeeded';
				const users = action.payload;
				state.total = users.total;
				state.count = users.count;
				state.limit = users.limit;
				state.offset = users.offset;
				state.results = users.results;
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.status = 'failed';
				state.results = [];
				state.error = action.error;
			});
	}
});

export const { setUserColumns } = usersSlice.actions;

// Export the slice reducer as the default export
export default usersSlice.reducer;
