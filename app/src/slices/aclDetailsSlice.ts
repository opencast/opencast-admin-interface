import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { prepareAccessPolicyRulesForPost } from '../utils/resourceUtils';
import { addNotification } from '../thunks/notificationThunks';

/**
 * This file contains redux reducer for actions affecting the state of details of an ACL
 */
type IncomingAcl = {
	ace: { allow: boolean, role: string, action: string }[]
}

type TransformedAcls = {
  actions: string[], role: string, read: boolean, write: boolean
}[]

type AclDetailsState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
  organizationId: string,
	id: number,
	name: string,
	acl: TransformedAcls,
}

// initial redux state
const initialState: AclDetailsState = {
	status: 'uninitialized',
	error: null,
	organizationId: "",
	id: 0,
	name: "",
	acl: [],
};

// fetch details about a certain acl from server
export const fetchAclDetails = createAsyncThunk('aclDetails/fetchAclDetails', async (aclId: any, {dispatch}) => {
	const res = await axios.get(`/admin-ng/acl/${aclId}`);

	let aclDetails = res.data;

	let acl: IncomingAcl = aclDetails.acl;
	let transformedAcls: TransformedAcls = [];

	// transform policies for further use
  // TODO: Investigate why we do this and write down the reason here
  // (or simplify the code if we don't actually need to transform)
	for (let i = 0; acl.ace.length > i; i++) {
		if (transformedAcls.find((rule) => rule.role === acl.ace[i].role)) {
			for (let j = 0; transformedAcls.length > j; j++) {
				// only update entry for policy if already added with other action
				if (transformedAcls[j].role === acl.ace[i].role) {
					if (acl.ace[i].action === "read") {
						transformedAcls[j] = {
							...transformedAcls[j],
							read: acl.ace[i].allow,
						};
						break;
					}
					if (acl.ace[i].action === "write") {
						transformedAcls[j] = {
							...transformedAcls[j],
							write: acl.ace[i].allow,
						};
						break;
					}
					if (
						acl.ace[i].action !== "read" &&
						acl.ace[i].action !== "write" &&
						acl.ace[i].allow === true
					) {
						transformedAcls[j] = {
							...transformedAcls[j],
							actions: transformedAcls[j].actions.concat(acl.ace[i].action),
						};
						break;
					}
				}
			}
		} else {
			// add policy if role not seen before
			if (acl.ace[i].action === "read") {
				transformedAcls = transformedAcls.concat({
					role: acl.ace[i].role,
					read: acl.ace[i].allow,
					write: false,
					actions: [],
				});
			}
			if (acl.ace[i].action === "write") {
				transformedAcls = transformedAcls.concat({
					role: acl.ace[i].role,
					read: false,
					write: acl.ace[i].allow,
					actions: [],
				});
			}
			if (
				acl.ace[i].action !== "read" &&
				acl.ace[i].action !== "write" &&
				acl.ace[i].allow === true
			) {
				transformedAcls = transformedAcls.concat({
					role: acl.ace[i].role,
					read: false,
					write: false,
					actions: [acl.ace[i].action],
				});
			}
		}
	}

	aclDetails = {
		...aclDetails,
		acl: transformedAcls,
	};

	return aclDetails;
});

// update details of a certain acl
export const updateAclDetails = createAsyncThunk('aclDetails/updateAclDetails', async (params: {values: any, aclId: any}, {dispatch}) => {
	const { values, aclId } = params
	// transform ACLs back to structure used by backend
	let acls = prepareAccessPolicyRulesForPost(values.acls);

	// set params for request body
	let data = new URLSearchParams();
	data.append("name", values.name);
	data.append("acl", JSON.stringify(acls));

	// PUT request
	axios
		.put(`/admin-ng/acl/${aclId}`, data)
		.then((response) => {
			console.info(response);
			dispatch(addNotification("success", "ACL_UPDATED"));
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification("error", "ACL_NOT_SAVED"));
		});
});

const aclDetailsSlice = createSlice({
	name: 'aclDetails',
	initialState,
	reducers: {},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchAclDetails.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchAclDetails.fulfilled, (state, action: PayloadAction<{
				organizationId: AclDetailsState["organizationId"],
				id: AclDetailsState["id"],
				name: AclDetailsState["name"],
				acl: AclDetailsState["acl"],
			}>) => {
				state.status = 'succeeded';
				const acls = action.payload;
				state.organizationId = acls.organizationId;
				state.id = acls.id;
				state.name = acls.name;
				state.acl = acls.acl;
			})
			.addCase(fetchAclDetails.rejected, (state, action) => {
				state.status = 'failed';
        state.organizationId = "";
        state.id = 0;
        state.name = "";
        state.acl = [];
				state.error = action.error;
			});
	}
});

// export const {} = aclDetailsSlice.actions;

// Export the slice reducer as the default export
export default aclDetailsSlice.reducer;
