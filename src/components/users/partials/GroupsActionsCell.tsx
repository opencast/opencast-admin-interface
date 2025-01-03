import React, { useState } from "react";
import GroupDetailsModal from "./modal/GroupDetailsModal";
import { useAppDispatch  } from "../../../store";
import { Group, deleteGroup } from "../../../slices/groupSlice";
import { fetchGroupDetails } from "../../../slices/groupDetailsSlice";
import { ActionCellDelete } from "../../shared/ActionCellDelete";
import { IconButton } from "../../shared/IconButton";

/**
 * This component renders the action cells of groups in the table view
 */
const GroupsActionsCell = ({
	row,
}: {
	row: Group
}) => {
	const dispatch = useAppDispatch();

	const [displayGroupDetails, setGroupDetails] = useState(false);

	const deletingGroup = (id: string) => {
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
			<IconButton
				callback={() => showGroupDetails()}
				iconClassname={"more"}
				editAccessRole={"ROLE_UI_GROUPS_EDIT"}
				tooltipText={"USERS.GROUPS.TABLE.TOOLTIP.DETAILS"}
			/>
			{/*modal displaying details about group*/}
			{displayGroupDetails && (
				<GroupDetailsModal close={hideGroupDetails} groupName={row.name} />
			)}

			{/* delete group */}
			<ActionCellDelete
				editAccessRole={"ROLE_UI_GROUPS_DELETE"}
				tooltipText={"USERS.GROUPS.TABLE.TOOLTIP.DETAILS"}
				resourceId={row.id}
				resourceName={row.name}
				resourceType={"GROUP"}
				deleteMethod={deletingGroup}
			/>
		</>
	);
};

export default GroupsActionsCell;
