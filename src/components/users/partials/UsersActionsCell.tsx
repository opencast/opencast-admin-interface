import React, { useState } from "react";
import { UserResult, deleteUser } from "../../../slices/userSlice";
import { useAppDispatch } from "../../../store";
import { fetchUserDetails } from "../../../slices/userDetailsSlice";
import DetailsModal from "../../shared/modals/DetailsModal";
import UserDetails from "./modal/UserDetails";
import { ActionCellDelete } from "../../shared/ActionCellDelete";
import { IconButton } from "../../shared/IconButton";

/**
 * This component renders the action cells of users in the table view
 */
const UsersActionCell = ({
	row,
}: {
	row: UserResult
}) => {
  const dispatch = useAppDispatch();

	const [displayUserDetails, setUserDetails] = useState(false);

	const deletingUser = (id: string) => {
		dispatch(deleteUser(id));
	};

	const showUserDetails = async () => {
		await dispatch(fetchUserDetails(row.username));

		setUserDetails(true);
	};

	const hideUserDetails = () => {
		setUserDetails(false);
	};

	return (
		<>
			{/* edit/show user details */}
			<IconButton
				callback={() => showUserDetails()}
				iconClassname={"more"}
				editAccessRole={"ROLE_UI_USERS_EDIT"}
				tooltipText={"USERS.USERS.TABLE.TOOLTIP.DETAILS"}
			/>
			{displayUserDetails && (
				<DetailsModal
					handleClose={hideUserDetails}
					title={row.username}
					prefix={"USERS.USERS.DETAILS.EDITCAPTION"}
				>
					<UserDetails close={hideUserDetails} />
				</DetailsModal>
			)}

			{(row.manageable || (row.provider !== "opencast" && row.provider !== "system")) &&
				<ActionCellDelete
					editAccessRole={"ROLE_UI_USERS_DELETE"}
					tooltipText={"USERS.USERS.TABLE.TOOLTIP.DETAILS"}
					resourceId={row.username}
					resourceName={row.name}
					resourceType={"USER"}
					deleteMethod={deletingUser}
				/>
			}
		</>
	);
};

export default UsersActionCell;
