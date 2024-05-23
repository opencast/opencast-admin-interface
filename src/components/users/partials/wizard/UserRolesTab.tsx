import React, { useEffect, useState } from "react";
import { Role, fetchRolesWithTarget } from "../../../../slices/aclSlice";
import SelectContainer from "../../../shared/wizard/SelectContainer";

/**
 * This component renders the role selection tab of the new user wizard and the user details modal
 */
const UserRolesTab = ({
    formik
}: any) => {
	// roles that can be chosen by user
	const [roles, setRoles] = useState<Role[]>([]);
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
		<div className="modal-content">
			<div className="modal-body">
				<div className="form-container">
					{/*Select container for roles*/}
					{!loading && (
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
