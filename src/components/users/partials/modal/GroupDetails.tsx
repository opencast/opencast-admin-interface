import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import cn from "classnames";
import GroupMetadataPage from "../wizard/GroupMetadataPage";
import GroupRolesPage from "../wizard/GroupRolesPage";
import GroupUsersPage from "../wizard/GroupUsersPage";
import { EditGroupSchema } from "../../../../utils/validate";
import { getGroupDetails } from "../../../../selectors/groupDetailsSelectors";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { updateGroupDetails } from "../../../../slices/groupDetailsSlice";

/**
 * This component manages the pages of the group details
 */
const GroupDetails: React.FC<{
	close: () => void
}> = ({
	close,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [page, setPage] = useState(0);

	const groupDetails = useAppSelector(state => getGroupDetails(state));

	// transform roles for use in SelectContainer
	let roleNames = [];
	for (const role of groupDetails.roles) {
		if (!role.startsWith("ROLE_GROUP")) {
			roleNames.push({
				name: role,
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
		dispatch(updateGroupDetails({values: values, groupId: groupDetails.id}));
		close();
	};

	return (
		<>
			{/* Navigation */}
			<ModalNavigation tabInformation={tabs} page={page} openTab={openTab} />

			{/* formik form used in entire modal */}
			<Formik
				initialValues={initialValues}
				validationSchema={EditGroupSchema}
				onSubmit={(values) => handleSubmit(values)}
			>
				{(formik) => (
					<>
						{page === 0 && <GroupMetadataPage formik={formik} isEdit />}
						{page === 1 && <GroupRolesPage formik={formik} isEdit />}
						{page === 2 && <GroupUsersPage formik={formik} isEdit />}

						{/* Navigation buttons and validation */}
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
					</>
				)}
			</Formik>
		</>
	);
};

export default GroupDetails;
