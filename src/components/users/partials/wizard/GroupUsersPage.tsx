import React, { useEffect, useState } from "react";
import SelectContainer from "../../../shared/wizard/SelectContainer";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { fetchUsersAndUsernames } from "../../../../slices/userSlice";
import { FormikProps } from "formik";

/**
 * This component renders the user selection page of the new group wizard and group details wizard
 */
const GroupUsersPage = <T,>({
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
			for (const responseUser of responseUsers) {
				userNames.push({
					id: responseUser.id,
					name: responseUser.value,
				});
			}

// @ts-expect-error TS(2345): Argument of type '{ id: string; name: any; }[]' is... Remove this comment to see the full error message
			setUsers(userNames);
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
