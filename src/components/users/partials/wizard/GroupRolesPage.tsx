import React, { useEffect, useState } from "react";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import SelectContainer from "../../../shared/wizard/SelectContainer";
import { fetchRolesWithTarget } from "../../../../slices/aclSlice";
import { FormikProps } from "formik";

/**
 * This component renders the role selection page of the new group wizard and group details modal
 */
const GroupRolesPage = <T,>({
	formik,
	nextPage,
	previousPage,
	isEdit
}: {
	formik: FormikProps<T>,
	nextPage?: (values: T) => void,
	previousPage?: (values: T) => void,
	isEdit?: boolean,
}) => {
	// roles that can be chosen by user
	const [roles, setRoles] = useState<{ name: string }[]>([]);
	// flag for API call
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchData() {
			// fetch information about roles
			setLoading(true);
			const responseRoles = await fetchRolesWithTarget("USER");
			let roleNames = [];
			for (let i = 0; i < responseRoles.length; i++) {
				if (responseRoles[i].type !== "GROUP") {
					roleNames.push({
						name: responseRoles[i].name,
					});
				}
			}
			setRoles(roleNames);
			setLoading(false);
		}

		fetchData();
	}, []);

	return (
		<>
			<div className="modal-content">
				<div className="modal-body">
					<div className="form-container">
						{/*Select container for roles*/}
						{!loading && (
							<SelectContainer
								resource={{
									searchable: true,
									label: "USERS.GROUPS.DETAILS.ROLES",
									items: roles,
								}}
								formikField="roles"
							/>
						)}
					</div>
				</div>
			</div>

			{/* Button for navigation to next page */}
			{!isEdit && (
				<WizardNavigationButtons
					previousPage={previousPage}
					formik={formik}
					nextPage={nextPage}
				/>
			)}
		</>
	);
};

export default GroupRolesPage;
