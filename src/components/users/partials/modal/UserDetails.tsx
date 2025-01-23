import React, { useState } from "react";
import { Formik } from "formik";
import { EditUserSchema } from "../../../../utils/validate";
import UserRolesTab from "../wizard/UserRolesTab";
import { getUserDetails } from "../../../../selectors/userDetailsSelectors";
import EditUserGeneralTab from "../wizard/EditUserGeneralTab";
import UserEffectiveRolesTab from "../wizard/UserEffectiveRolesTab";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { UpdateUser, updateUserDetails } from "../../../../slices/userDetailsSlice";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";

/**
 * This component manages the pages of the user details
 */
const UserDetails: React.FC<{
	close: () => void
}> = ({
	close,
}) => {
	const dispatch = useAppDispatch();

	const [page, setPage] = useState(0);

	const userDetails = useAppSelector(state => getUserDetails(state));

	const initialValues = {
		...userDetails,
		password: "",
		passwordConfirmation: "",
	};

	// information about tabs
	const tabs = [
		{
			tabTranslation: "USERS.USERS.DETAILS.TABS.USER",
			accessRole: "ROLE_UI_USERS_EDIT",
			name: "general",
		},
		{
			tabTranslation: "USERS.USERS.DETAILS.TABS.ROLES",
			accessRole: "ROLE_UI_USERS_EDIT",
			name: "roles",
		},
		{
			tabTranslation: "USERS.USERS.DETAILS.TABS.EFFECTIVEROLES",
			accessRole: "ROLE_UI_USERS_EDIT",
			name: "effectiveRoles",
		},
	];

	const openTab = (tabNr: number) => {
		setPage(tabNr);
	};

	const handleSubmit = (values: UpdateUser) => {
		dispatch(updateUserDetails({values: values, username: userDetails.username}));
		close();
	};

	return (
		<>
			{/* Navigation */}
			<ModalNavigation tabInformation={tabs} openTab={openTab} page={page} />

			{/* formik form used in entire modal */}
			<Formik
				initialValues={initialValues}
				validationSchema={EditUserSchema}
				onSubmit={(values) => handleSubmit(values)}
			>
				{(formik) => (
					<>
						{page === 0 && <EditUserGeneralTab formik={formik} />}
						{page === 1 && <UserRolesTab formik={formik} />}
						{page === 2 && <UserEffectiveRolesTab formik={formik} />}

						{/* Navigation buttons and validation */}
						{page !== 2 && (
							<WizardNavigationButtons
								formik={formik}
								createTranslationString="SUBMIT"
								cancelTranslationString="CANCEL"
								isLast
							/>
						)}
					</>
				)}
			</Formik>
		</>
	);
};

export default UserDetails;
