import { PayloadAction, SerializedError, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { buildGroupBody } from '../utils/resourceUtils';
import { addNotification } from './notificationSlice';
import { createAppAsyncThunk } from '../createAsyncThunkWithTypes';

/**
 * This file contains redux reducer for actions affecting the state of details of a group
 */
type GroupDetailsState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
  role: string,
	roles: string[],
	name: string,
	description: string,
	id: string,
	users: {id: string, name: string}[],
}

// initial redux state
const initialState: GroupDetailsState = {
	status: 'uninitialized',
	error: null,
	role: "",
	roles: [],
	name: "",
	description: "",
	id: "",
	users: [],
};

// fetch details about certain group from server
export const fetchGroupDetails = createAppAsyncThunk('groupDetails/fetchGroupDetails', async (groupName: string) => {
	const res = await axios.get(`/admin-ng/groups/${groupName}`);
	const response = await res.data;

	let users: GroupDetailsState["users"] = [];
	if (response.users.length > 0) {
// @ts-expect-error TS(7006): Parameter 'user' implicitly has an 'any' type.
		users = response.users.map((user) => {
			return {
				id: user.username,
				name: user.name,
			};
		});
	}

	const groupDetails = {
		role: response.role,
		roles: response.roles,
		name: response.name,
		description: response.description,
		id: response.id,
		users: users,
	};

	return groupDetails;
});

// update details of a certain group
export const updateGroupDetails = createAppAsyncThunk('groupDetails/updateGroupDetails', async (params: {
	values: GroupDetailsState,
	groupId: string
}, {dispatch}) => {
	const { values, groupId } = params

	// get URL params used for put request
	let data = buildGroupBody(values);

	// PUT request
	axios
		.put(`/admin-ng/groups/${groupId}`, data)
		.then((response) => {
			console.info(response);
			dispatch(addNotification({type: "success", key: "GROUP_UPDATED"}));
		})
		.catch((response) => {
			console.error(response);
			if (response.status === 409) {
				dispatch(addNotification({type: "error", key: "GROUP_CONFLICT"}));
			} else {
				dispatch(addNotification({type: "error", key: "GROUP_NOT_SAVED"}));
			}
		});
});

const groupDetailsSlice = createSlice({
	name: 'groupDetails',
	initialState,
	reducers: {},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchGroupDetails.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchGroupDetails.fulfilled, (state, action: PayloadAction<{
				role: GroupDetailsState["role"],
				roles: GroupDetailsState["roles"],
				name: GroupDetailsState["name"],
				description: GroupDetailsState["description"],
				id: GroupDetailsState["id"],
				users: GroupDetailsState["users"],
			}>) => {
				state.status = 'succeeded';
				const groupDetails = action.payload;
				state.role = groupDetails.role;
				state.roles = groupDetails.roles;
				state.name = groupDetails.name;
				state.description = groupDetails.description;
				state.id = groupDetails.id;
				state.users = groupDetails.users;
			})
			.addCase(fetchGroupDetails.rejected, (state, action) => {
				state.status = 'failed';
				state.role = "";
				state.roles = [];
				state.name = "";
				state.description = "";
				state.id = "";
				state.users = [];
				state.error = action.error;
			});
	}
});

// export const {} = groupDetailsSlice.actions;

// Export the slice reducer as the default export
export default groupDetailsSlice.reducer;
