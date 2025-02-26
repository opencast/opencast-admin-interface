import { fetchAcls } from "../../../slices/aclSlice";
import { fetchGroups } from "../../../slices/groupSlice";
import { fetchUsers } from "../../../slices/userSlice";
import { AppDispatch } from "../../../store";
import { loadAclsIntoTable, loadGroupsIntoTable, loadUsersIntoTable } from "../../../thunks/tableThunks";

/**
 * Utility file for the navigation bar
 */

export const loadAcls = async (dispatch: AppDispatch) => {
	// Fetching acls from server
	await dispatch(fetchAcls());

	// Load acls into table
	dispatch(loadAclsIntoTable());
};

export const loadUsers = async (dispatch: AppDispatch) => {
	// Fetching users from server
	await dispatch(fetchUsers());

	// Load users into table
	dispatch(loadUsersIntoTable());
};

export const loadGroups = async (dispatch: AppDispatch) => {
	// Fetching groups from server
	await dispatch(fetchGroups());

	// Load groups into table
	dispatch(loadGroupsIntoTable());
};

export const usersLinks = [
	{
		path: "/users/users",
		accessRole: "ROLE_UI_USERS_VIEW",
		loadFn: loadUsers,
		text: "USERS.NAVIGATION.USERS"
	},
	{
		path: "/users/groups",
		accessRole: "ROLE_UI_GROUPS_VIEW",
		loadFn: loadGroups,
		text: "USERS.NAVIGATION.GROUPS"
	},
	{
		path: "/users/acls",
		accessRole: "ROLE_UI_ACLS_VIEW",
		loadFn: loadAcls,
		text: "USERS.NAVIGATION.PERMISSIONS"
	},
];
