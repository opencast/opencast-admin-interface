import React from "react";

/**
 * This component renders the roles cells of users in the table view
 */
const UsersRolesCell = ({
    row
}: any) => {
	const getRoleString = () => {
		let roleString = "";

// @ts-expect-error TS(7006): Parameter 'role' implicitly has an 'any' type.
		row.roles.forEach((role) => {
			roleString = roleString.concat(role.name + ", ");
		});

		return roleString;
	};

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
	return <span>{getRoleString()}</span>;
};

export default UsersRolesCell;
