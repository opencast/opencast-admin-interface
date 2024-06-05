import React from "react";

/**
 * This component renders the roles cells of users in the table view
 */
const UsersRolesCell = ({
    row
}: any) => {
	const getRoleString = () => {
		let displayRoles = [];
		let roleCountUI = 0;
		let roleCountAPI = 0;
		let roleCountCaptureAgent = 0;

		for (const role of row.roles) {
			if (role.name.startsWith('ROLE_UI')) {
				roleCountUI++;
			} else if (role.name.startsWith('ROLE_API')) {
				roleCountAPI++;
			} else if (role.name.startsWith('ROLE_CAPTURE_AGENT')) {
				roleCountCaptureAgent++;
			} else {
				displayRoles.push(role.name);
			}
		}

		if (roleCountUI > 0) {
			displayRoles.push(`${roleCountUI} UI roles`);
		}
		if (roleCountAPI > 0) {
			displayRoles.push(`${roleCountAPI} API roles`);
		}
		if (roleCountCaptureAgent > 0) {
			displayRoles.push(`${roleCountUI} capture agent roles`);
		}

		return displayRoles.join(', ');
	};

	return <span>{getRoleString()}</span>;
};

export default UsersRolesCell;
