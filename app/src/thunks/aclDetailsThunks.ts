import {
	loadAclDetailsFailure,
	loadAclDetailsInProgress,
	loadAclDetailsSuccess,
} from "../actions/aclDetailsActions";
import axios from "axios";
import { addNotification } from "./notificationThunks";
import { prepareAccessPolicyRulesForPost } from "../utils/resourceUtils";

// fetch details about a certain acl from server
// @ts-expect-error TS(7006): Parameter 'aclId' implicitly has an 'any' type.
export const fetchAclDetails = (aclId) => async (dispatch) => {
	try {
		dispatch(loadAclDetailsInProgress());

		let data = await axios.get(`/admin-ng/acl/${aclId}`);

		let aclDetails = await data.data;

		let acl = aclDetails.acl;
// @ts-expect-error TS(7034): Variable 'transformedAcls' implicitly has type 'an... Remove this comment to see the full error message
		let transformedAcls = [];

		// transform policies for further use
		for (let i = 0; acl.ace.length > i; i++) {
// @ts-expect-error TS(7005): Variable 'transformedAcls' implicitly has an 'any[... Remove this comment to see the full error message
			if (transformedAcls.find((rule) => rule.role === acl.ace[i].role)) {
				for (let j = 0; transformedAcls.length > j; j++) {
					// only update entry for policy if already added with other action
					if (transformedAcls[j].role === acl.ace[i].role) {
						if (acl.ace[i].action === "read") {
							transformedAcls[j] = {
// @ts-expect-error TS(7005): Variable 'transformedAcls' implicitly has an 'any[... Remove this comment to see the full error message
								...transformedAcls[j],
								read: acl.ace[i].allow,
							};
							break;
						}
						if (acl.ace[i].action === "write") {
							transformedAcls[j] = {
// @ts-expect-error TS(7005): Variable 'transformedAcls' implicitly has an 'any[... Remove this comment to see the full error message
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
// @ts-expect-error TS(7005): Variable 'transformedAcls' implicitly has an 'any[... Remove this comment to see the full error message
								...transformedAcls[j],
// @ts-expect-error TS(7005): Variable 'transformedAcls' implicitly has an 'any[... Remove this comment to see the full error message
								actions: transformedAcls[j].actions.concat(acl.ace[i].action),
							};
							break;
						}
					}
				}
			} else {
				// add policy if role not seen before
				if (acl.ace[i].action === "read") {
// @ts-expect-error TS(7005): Variable 'transformedAcls' implicitly has an 'any[... Remove this comment to see the full error message
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

		dispatch(loadAclDetailsSuccess(aclDetails));
	} catch (e) {
		dispatch(loadAclDetailsFailure());
		console.error(e);
	}
};

// update details of a certain acl
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const updateAclDetails = (values, aclId) => async (dispatch) => {
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
};
