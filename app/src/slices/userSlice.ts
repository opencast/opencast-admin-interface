import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { usersTableConfig } from "../configs/tableConfigs/usersTableConfig";
import axios from 'axios';
import { transformToIdValueArray } from "../utils/utils";
import { buildUserBody, getURLParams } from "../utils/resourceUtils";
import { addNotification } from '../thunks/notificationThunks';

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

// fetch users from server
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { getState }) => {
	const state = getState();
	let params = getURLParams(state);
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	const res = await axios.get("/admin-ng/users/users.json", { params: params });
	return res.data;
});

// new user to backend
export const postNewUser = createAsyncThunk('users/postNewUser', async (values: any, {dispatch}) => {
	// get URL params used for post request
	let data = buildUserBody(values);

	axios
		.post("/admin-ng/users", data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		// Usually we would extraReducers for responses, but reducers are not allowed to dispatch
		// (they need to be free of side effects)
		// Since we want to dispatch, we have to handle responses in our thunk
		.then((response) => {
			console.info(response);
			dispatch(addNotification("success", "USER_ADDED"));
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification("error", "USER_NOT_SAVED"));
		});
});

// delete user with provided id
export const deleteUser = createAsyncThunk('users/postNewUser', async (id: any, {dispatch}) => {
	// API call for deleting an user
	axios
		.delete(`/admin-ng/users/${id}.json`)
		.then((res) => {
			console.info(res);
			// add success notification
			dispatch(addNotification("success", "USER_DELETED"));
		})
		.catch((res) => {
			console.error(res);
			// add error notification
			dispatch(addNotification("error", "USER_NOT_DELETED"));
		});
});

// get users and their user names
export const fetchUsersAndUsernames = async () => {
	let data = await axios.get(
		"/admin-ng/resources/USERS.NAME.AND.USERNAME.json"
	);

	const response = await data.data;

	return transformToIdValueArray(response);
};

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
			// fetchUsers
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
