import React, { useEffect, useState } from "react";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/SelectContainer' wa... Remove this comment to see the full error message
import SelectContainer from "../../../shared/wizard/SelectContainer";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { fetchUsersAndUsernames } from "../../../../thunks/userThunks";

/**
 * This component renders the user selection page of the new group wizard and group details wizard
 */
const GroupUsersPage = ({
    previousPage,
    nextPage,
    formik,
    isEdit
}: any) => {
	// users that can be chosen by user
	const [users, setUsers] = useState([]);
	// flag for API call
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchData() {
			// fetch information about users
			setLoading(true);
			const responseUsers = await fetchUsersAndUsernames();

			let userNames = [];
			for (let i = 0; i < responseUsers.length; i++) {
				userNames.push({
					id: responseUsers[i].id,
					name: responseUsers[i].value,
				});
			}

// @ts-expect-error TS(2345): Argument of type '{ id: string; name: any; }[]' is... Remove this comment to see the full error message
			setUsers(userNames);
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
									label: "USERS.GROUPS.DETAILS.USERS",
									items: users,
								}}
								formikField="users"
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

export default GroupUsersPage;
