import { PayloadAction, SerializedError, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { addNotification } from './notificationSlice';
import { buildUserBody } from "../utils/resourceUtils";
import { createAppAsyncThunk } from '../createAsyncThunkWithTypes';

/**
 * This file contains redux reducer for actions affecting the state of details of a user
 */
export type UserDetailsRole = {
	name: string,
	type: string,
}

export type UpdateUser = {
	email: string,
	name: string,
	password: string,
	roles: UserDetailsRole[],
	username: string,
}

export type UserDetailsState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	provider: string,
	roles: UserDetailsRole[],
	name: string,
	username: string,
	email: string,
	manageable: boolean,
};

// Initial state of userDetails in redux store
const initialState: UserDetailsState = {
	status: 'uninitialized',
	error: null,
	provider: "",
	roles: [],
	name: "",
	username: "",
	email: "",
	manageable: false,
};

// fetch details about certain user from server
export const fetchUserDetails = createAppAsyncThunk('userDetails/fetchUserDetails', async (username: string) => {
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	const res = await axios.get(`/admin-ng/users/${username}.json`);
	return res.data;
});

// update existing user with changed values
export const updateUserDetails = createAppAsyncThunk('userDetails/updateUserDetails', async (params: {
	values: UpdateUser,
	username: string
}, {dispatch}) => {
	const { username, values } = params

	// get URL params used for put request
	let data = buildUserBody(values);

	// PUT request
	axios
		.put(`/admin-ng/users/${username}.json`, data)
		.then((response) => {
			console.info(response);
			dispatch(addNotification({type: "success", key: "USER_UPDATED"}));
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification({type: "error", key: "USER_NOT_SAVED"}));
		});
});

const userDetailsSlice = createSlice({
	name: 'userDetails',
	initialState,
	reducers: {},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchUserDetails.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<{
				provider: UserDetailsState["provider"],
				roles: UserDetailsState["roles"],
				name: UserDetailsState["name"],
				username: UserDetailsState["username"],
				email: UserDetailsState["email"],
				manageable: UserDetailsState["manageable"],
			}>) => {
				state.status = 'succeeded';
				const userDetails = action.payload;
				state.provider = userDetails.provider;
				state.roles = userDetails.roles;
				state.name = userDetails.name;
				state.username = userDetails.username;
				state.email = !!userDetails.email ? userDetails.email : "";
				state.manageable = userDetails.manageable;
			})
			.addCase(fetchUserDetails.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
				state.provider = "";
				state.roles = [];
				state.name = "";
				state.username = "";
				state.email = "";
				state.manageable = false;
			});
	}
});

// export const {} = userDetailsSlice.actions;

// Export the slice reducer as the default export
export default userDetailsSlice.reducer;
