import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import cn from "classnames";
import { EditUserSchema } from "../../../../utils/validate";
import UserRolesTab from "../wizard/UserRolesTab";
import { connect } from "react-redux";
import { getUserDetails } from "../../../../selectors/userDetailsSelectors";
import EditUserGeneralTab from "../wizard/EditUserGeneralTab";
import UserEffectiveRolesTab from "../wizard/UserEffectiveRolesTab";
import { updateUserDetails } from "../../../../thunks/userDetailsThunks";
import ModalNavigation from "../../../shared/modals/ModalNavigation";

/**
 * This component manages the pages of the user details
 */
const UserDetails = ({
    close,
    userDetails,
    updateUserDetails
}: any) => {
	const { t } = useTranslation();

	const [page, setPage] = useState(0);

	const initialValues = {
		...userDetails,
		password: "",
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

// @ts-expect-error TS(7006): Parameter 'tabNr' implicitly has an 'any' type.
	const openTab = (tabNr) => {
		setPage(tabNr);
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		updateUserDetails(values, userDetails.username);
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
							<footer>
								<button
									className={cn("submit", {
										active: formik.dirty && formik.isValid,
										inactive: !(formik.dirty && formik.isValid),
									})}
									disabled={!(formik.dirty && formik.isValid)}
									onClick={() => formik.handleSubmit()}
									type="submit"
								>
									{t("SUBMIT")}
								</button>
								<button className="cancel" onClick={() => close()}>
									{t("CANCEL")}
								</button>
							</footer>
						)}
					</>
				)}
			</Formik>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	userDetails: getUserDetails(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	updateUserDetails: (values, username) =>
		dispatch(updateUserDetails(values, username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
