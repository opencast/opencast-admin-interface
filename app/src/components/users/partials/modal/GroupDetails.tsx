import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import cn from "classnames";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../wizard/GroupMetadataPage' was resolved ... Remove this comment to see the full error message
import GroupMetadataPage from "../wizard/GroupMetadataPage";
// @ts-expect-error TS(6142): Module '../wizard/GroupRolesPage' was resolved to ... Remove this comment to see the full error message
import GroupRolesPage from "../wizard/GroupRolesPage";
// @ts-expect-error TS(6142): Module '../wizard/GroupUsersPage' was resolved to ... Remove this comment to see the full error message
import GroupUsersPage from "../wizard/GroupUsersPage";
import { EditGroupSchema } from "../../../../utils/validate";
import { getGroupDetails } from "../../../../selectors/groupDetailsSelectors";
import { updateGroupDetails } from "../../../../thunks/groupDetailsThunks";
// @ts-expect-error TS(6142): Module '../../../shared/modals/ModalNavigation' wa... Remove this comment to see the full error message
import ModalNavigation from "../../../shared/modals/ModalNavigation";

/**
 * This component manages the pages of the group details
 */
const GroupDetails = ({
    close,
    groupDetails,
    updateGroupDetails
}: any) => {
	const { t } = useTranslation();

	const [page, setPage] = useState(0);

	// transform roles for use in SelectContainer
	let roleNames = [];
	for (let i = 0; i < groupDetails.roles.length; i++) {
		if (groupDetails.roles[i].type !== "GROUP") {
			roleNames.push({
				name: groupDetails.roles[i],
			});
		}
	}

	const initialValues = {
		...groupDetails,
		roles: roleNames,
	};

	// information about tabs
	const tabs = [
		{
			tabTranslation: "USERS.GROUPS.DETAILS.TABS.GROUP",
			accessRole: "ROLE_UI_GROUPS_EDIT",
			name: "group",
		},
		{
			tabTranslation: "USERS.GROUPS.DETAILS.TABS.ROLES",
			accessRole: "ROLE_UI_GROUPS_EDIT",
			name: "roles",
		},
		{
			tabTranslation: "USERS.GROUPS.DETAILS.TABS.USERS",
			accessRole: "ROLE_UI_GROUPS_EDIT",
			name: "users",
		},
	];

// @ts-expect-error TS(7006): Parameter 'tabNr' implicitly has an 'any' type.
	const openTab = (tabNr) => {
		setPage(tabNr);
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		updateGroupDetails(values, groupDetails.id);
		close();
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* Navigation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<ModalNavigation tabInformation={tabs} page={page} openTab={openTab} />

			{/* formik form used in entire modal */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Formik
				initialValues={initialValues}
				validationSchema={EditGroupSchema}
				onSubmit={(values) => handleSubmit(values)}
			>
				{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{page === 0 && <GroupMetadataPage formik={formik} isEdit />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{page === 1 && <GroupRolesPage formik={formik} isEdit />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{page === 2 && <GroupUsersPage formik={formik} isEdit />}

						{/* Navigation buttons and validation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<button className="cancel" onClick={() => close()}>
								{t("CANCEL")}
							</button>
						</footer>
					</>
				)}
			</Formik>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	groupDetails: getGroupDetails(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	updateGroupDetails: (values, groupName) =>
		dispatch(updateGroupDetails(values, groupName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails);
