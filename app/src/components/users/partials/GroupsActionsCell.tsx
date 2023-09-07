import React, { useState } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../../shared/ConfirmModal' was resolved to... Remove this comment to see the full error message
import ConfirmModal from "../../shared/ConfirmModal";
import { deleteGroup } from "../../../thunks/groupThunks";
// @ts-expect-error TS(6142): Module './modal/GroupDetailsModal' was resolved to... Remove this comment to see the full error message
import GroupDetailsModal from "./modal/GroupDetailsModal";
import { fetchGroupDetails } from "../../../thunks/groupDetailsThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";

/**
 * This component renders the action cells of groups in the table view
 */
const GroupsActionsCell = ({
    row,
    deleteGroup,
    fetchGroupDetails,
    user
}: any) => {
	const { t } = useTranslation();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayGroupDetails, setGroupDetails] = useState(false);

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingGroup = (id) => {
		deleteGroup(id);
	};

	const hideGroupDetails = () => {
		setGroupDetails(false);
	};

	const showGroupDetails = async () => {
		await fetchGroupDetails(row.id);

		setGroupDetails(true);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/*edit/show group */}
			{hasAccess("ROLE_UI_GROUPS_EDIT", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					onClick={() => showGroupDetails()}
					className="button-like-anchor more"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("USERS.GROUPS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{/*modal displaying details about group*/}
			{displayGroupDetails && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<GroupDetailsModal close={hideGroupDetails} groupName={row.name} />
			)}

			{/* delete group */}
			{hasAccess("ROLE_UI_GROUPS_DELETE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					onClick={() => setDeleteConfirmation(true)}
					className="button-like-anchor remove"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("USERS.GROUPS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{/*Confirmation for deleting a group*/}
			{displayDeleteConfirmation && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
	user: getUserInformation(state),
});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	deleteGroup: (id) => dispatch(deleteGroup(id)),
// @ts-expect-error TS(7006): Parameter 'groupName' implicitly has an 'any' type... Remove this comment to see the full error message
	fetchGroupDetails: (groupName) => dispatch(fetchGroupDetails(groupName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsActionsCell);
