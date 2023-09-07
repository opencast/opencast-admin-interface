import React, { useEffect, useState } from "react";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/SelectContainer' wa... Remove this comment to see the full error message
import SelectContainer from "../../../shared/wizard/SelectContainer";
import { fetchRolesWithTarget } from "../../../../thunks/aclThunks";

/**
 * This component renders the role selection page of the new group wizard and group details modal
 */
const GroupRolesPage = ({
    previousPage,
    nextPage,
    formik,
    isEdit
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
			let roleNames = [];
			for (let i = 0; i < responseRoles.length; i++) {
				if (responseRoles[i].type !== "GROUP") {
					roleNames.push({
						name: responseRoles[i].name,
					});
				}
			}
// @ts-expect-error TS(2345): Argument of type '{ name: any; }[]' is not assigna... Remove this comment to see the full error message
			setRoles(roleNames);
			setLoading(false);
		}

		fetchData();
	}, []);

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
