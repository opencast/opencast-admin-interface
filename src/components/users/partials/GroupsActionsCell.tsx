import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import GroupDetailsModal from "./modal/GroupDetailsModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector  } from "../../../store";
import { Group, deleteGroup } from "../../../slices/groupSlice";
import { fetchGroupDetails } from "../../../slices/groupDetailsSlice";
import { Tooltip } from "../../shared/Tooltip";
import { ModalHandle } from "../../shared/modals/Modal";

/**
 * This component renders the action cells of groups in the table view
 */
const GroupsActionsCell = ({
	row,
}: {
	row: Group
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const deleteConfirmationModalRef = useRef<ModalHandle>(null);
	const detailsModalRef = useRef<ModalHandle>(null);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		deleteConfirmationModalRef.current?.close?.();
	};

	const deletingGroup = (id: string) => {
		dispatch(deleteGroup(id));
	};

	const hideGroupDetails = () => {
		detailsModalRef.current?.close?.();
	};

	const showGroupDetails = async () => {
		await dispatch(fetchGroupDetails(row.id));

		detailsModalRef.current?.open();
	};

	return (
		<>
			{/*edit/show group */}
			{hasAccess("ROLE_UI_GROUPS_EDIT", user) && (
				<Tooltip title={t("USERS.GROUPS.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => showGroupDetails()}
						className="button-like-anchor more"
					/>
				</Tooltip>
			)}

			{/*modal displaying details about group*/}
			<GroupDetailsModal
				close={hideGroupDetails}
				groupName={row.name}
				modalRef={detailsModalRef}
			/>

			{/* delete group */}
			{hasAccess("ROLE_UI_GROUPS_DELETE", user) && (
				<Tooltip title={t("USERS.GROUPS.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => deleteConfirmationModalRef.current?.open()}
						className="button-like-anchor remove"
					/>
				</Tooltip>
			)}

			{/*Confirmation for deleting a group*/}
			<ConfirmModal
				close={hideDeleteConfirmation}
				resourceId={row.id}
				resourceName={row.name}
				deleteMethod={deletingGroup}
				resourceType="GROUP"
				modalRef={deleteConfirmationModalRef}
			/>
		</>
	);
};

export default GroupsActionsCell;
