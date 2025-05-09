import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import GroupMetadataPage from "../wizard/GroupMetadataPage";
import GroupRolesPage from "../wizard/GroupRolesPage";
import GroupUsersPage from "../wizard/GroupUsersPage";
import { EditGroupSchema } from "../../../../utils/validate";
import { getGroupDetails } from "../../../../selectors/groupDetailsSelectors";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { UpdateGroupDetailsState, updateGroupDetails } from "../../../../slices/groupDetailsSlice";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { ParseKeys } from "i18next";

/**
 * This component manages the pages of the group details
 */
const GroupDetails: React.FC<{
	close: () => void
}> = ({
	close,
}) => {
	const dispatch = useAppDispatch();

	const groupDetails = useAppSelector(state => getGroupDetails(state));

	const [page, setPage] = useState(0);
		// transform roles for use in SelectContainer

	const [roleNames, setRoleNames] = useState<{ name: string }[]>([]);


	useEffect(() => {
		const roleNames = [];
		for (let i = 0; i < groupDetails.roles.length; i++) {
			if (!groupDetails.roles[i].startsWith("ROLE_GROUP")) {
				roleNames.push({
					name: groupDetails.roles[i],
				});
			}
		}
		setRoleNames(roleNames);
	}, [groupDetails.roles]);

	const initialValues = {
		...groupDetails,
		roles: roleNames,
	};

	// information about tabs
	const tabs: {
		tabTranslation: ParseKeys
		accessRole: string
		name: string
	}[] = [
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

	const openTab = (tabNr: number) => {
		setPage(tabNr);
	};

	const handleSubmit = (values: UpdateGroupDetailsState) => {
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
				enableReinitialize={true}
			>
				{(formik) => (
					<>
						{page === 0 && <GroupMetadataPage formik={formik} isEdit />}
						{page === 1 && <GroupRolesPage formik={formik} isEdit />}
						{page === 2 && <GroupUsersPage formik={formik} isEdit />}

						{/* Navigation buttons and validation */}
						<WizardNavigationButtons
							formik={formik}
							createTranslationString="SUBMIT"
							cancelTranslationString="CANCEL"
							isLast
						/>
					</>
				)}
			</Formik>
		</>
	);
};

export default GroupDetails;
