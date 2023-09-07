import React, { useEffect, useState } from "react";
import { fetchRolesWithTarget } from "../../../../thunks/aclThunks";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/SelectContainer' wa... Remove this comment to see the full error message
import SelectContainer from "../../../shared/wizard/SelectContainer";

/**
 * This component renders the role selection tab of the new user wizard and the user details modal
 */
const UserRolesTab = ({
    formik
}: any) => {
	// roles that can be chosen by user
	const [roles, setRoles] = useState([]);
	// flag for API call
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchData() {
			// fetch information about roles
			setLoading(true);
			const responseRoles = await fetchRolesWithTarget("USER");
			setRoles(responseRoles);
			setLoading(false);
		}

		fetchData();
	}, []);

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="form-container">
					{/*Select container for roles*/}
					{!loading && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<SelectContainer
							resource={{
								searchable: true,
								label: "USERS.USERS.DETAILS.ROLES",
								items: roles,
							}}
							formikField="roles"
							manageable={formik.values.manageable}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserRolesTab;
