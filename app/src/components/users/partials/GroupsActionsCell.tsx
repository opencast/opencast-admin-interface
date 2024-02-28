import React, { useState } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import GroupDetailsModal from "./modal/GroupDetailsModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector  } from "../../../store";
import { deleteGroup } from "../../../slices/groupSlice";
import { fetchGroupDetails } from "../../../slices/groupDetailsSlice";

/**
 * This component renders the action cells of groups in the table view
 */
const GroupsActionsCell = ({
	row,
}: any) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayGroupDetails, setGroupDetails] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingGroup = (id) => {
		dispatch(deleteGroup(id));
	};

	const hideGroupDetails = () => {
		setGroupDetails(false);
	};

	const showGroupDetails = async () => {
		await dispatch(fetchGroupDetails(row.id));

		setGroupDetails(true);
	};

	return (
		<>
			{/*edit/show group */}
			{hasAccess("ROLE_UI_GROUPS_EDIT", user) && (
				<button
					onClick={() => showGroupDetails()}
					className="button-like-anchor more"
					title={t("USERS.GROUPS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{/*modal displaying details about group*/}
			{displayGroupDetails && (
				<GroupDetailsModal close={hideGroupDetails} groupName={row.name} />
			)}

			{/* delete group */}
			{hasAccess("ROLE_UI_GROUPS_DELETE", user) && (
				<button
					onClick={() => setDeleteConfirmation(true)}
					className="button-like-anchor remove"
					title={t("USERS.GROUPS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{/*Confirmation for deleting a group*/}
			{displayDeleteConfirmation && (
				<ConfirmModal
					close={hideDeleteConfirmation}
					resourceId={row.id}
					resourceName={row.name}
					deleteMethod={deletingGroup}
					resourceType="GROUP"
				/>
			)}
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({

});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsActionsCell);
