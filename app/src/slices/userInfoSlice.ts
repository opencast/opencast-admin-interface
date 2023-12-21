import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { addNotification } from '../thunks/notificationThunks';

/**
 * This file contains redux reducer for actions affecting the state of information about current user
 */
type UserInfoState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	statusOcVersion: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorOcVersion: SerializedError | null,
	isAdmin: boolean,
	isOrgAdmin: boolean,
	org: any,//TODO: Type this
	roles: string[],
	userRole: string,
	user: any,//TODO: Type this
	ocVersion: any,//TODO: Type this
};

// Initial state of userInfo in redux store
const initialState: UserInfoState = {
	status: 'uninitialized',
	error: null,
	statusOcVersion: 'uninitialized',
	errorOcVersion: null,
	isAdmin: false,
	isOrgAdmin: false,
	org: {},
	roles: [],
	userRole: "",
	user: {},
	ocVersion: {},
};

export const fetchUserInfo = createAsyncThunk('UserInfo/fetchUserInfo', async (_, { dispatch }) => {
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	const res = await axios.get("/info/me.json")
		.then((response) => {
			return response.data;
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification("error", "USER_NOT_SAVED"));
		});

	return res;

	// let userInfo = await res.data;

	// // add direct information about user being an admin
	// userInfo = {
	// 	isAdmin: userInfo.roles.includes("ROLE_ADMIN"),
	// 	isOrgAdmin: userInfo.roles.includes(userInfo.org.adminRole),
	// 	...userInfo,
	// };

	// return userInfo;
});

export const fetchOcVersion = createAsyncThunk('UserInfo/fetchOcVersion', async () => {
	const res = await axios.get("/sysinfo/bundles/version?prefix=opencast");
	return res.data;
});


const userInfoSlice = createSlice({
	name: 'userInfo',
	initialState,
	reducers: {},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchUserInfo.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<{
				org: UserInfoState["org"],
				roles: UserInfoState["roles"],
				userRole: UserInfoState["userRole"],
				user: UserInfoState["user"],
			}>) => {
				state.status = 'succeeded';
				const userInfo = action.payload;
				state.isAdmin = userInfo.roles.includes("ROLE_ADMIN");
				state.isOrgAdmin = userInfo.roles.includes(userInfo.org.adminRole);
				state.org = userInfo.org;
				state.roles = userInfo.roles;
				state.userRole = userInfo.userRole;
				state.user = userInfo.user;
			})
			.addCase(fetchUserInfo.rejected, (state, action) => {
				state.status = 'failed';
				state.org = {};
				state.roles = [];
				state.userRole = "";
				state.user = {};
				state.error = action.error;
			})
			.addCase(fetchOcVersion.pending, (state) => {
				state.statusOcVersion = 'loading';
			})
			.addCase(fetchOcVersion.fulfilled, (state, action: PayloadAction<{
				ocVersion: UserInfoState["ocVersion"],
			}>) => {
				state.statusOcVersion = 'succeeded';
				const ocVersion = action.payload;
				state.ocVersion = ocVersion;
			})
			.addCase(fetchOcVersion.rejected, (state, action) => {
				state.statusOcVersion = 'failed';
				state.ocVersion = {};
				state.errorOcVersion = action.error;
			});
	}
});


// export const {} = userInfoSlice.actions;

// Export the slice reducer as the default export
export default userInfoSlice.reducer;
