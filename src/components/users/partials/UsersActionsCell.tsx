import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { UserResult, deleteUser } from "../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchUserDetails } from "../../../slices/userDetailsSlice";
import { Tooltip } from "../../shared/Tooltip";
import DetailsModal from "../../shared/modals/DetailsModal";
import UserDetails from "./modal/UserDetails";

/**
 * This component renders the action cells of users in the table view
 */
const UsersActionCell = ({
	row,
}: {
	row: UserResult
}) => {
	const { t } = useTranslation();
  const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayUserDetails, setUserDetails] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

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
			{hasAccess("ROLE_UI_USERS_EDIT", user) && (
				<Tooltip title={t("USERS.USERS.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => showUserDetails()}
						className="button-like-anchor more"
					/>
				</Tooltip>
			)}

			{displayUserDetails && (
				<DetailsModal
					handleClose={hideUserDetails}
					title={row.username}
					prefix={"USERS.USERS.DETAILS.EDITCAPTION"}
				>
					<UserDetails close={hideUserDetails} />
				</DetailsModal>
			)}

			{(row.manageable || (row.provider !== "opencast" && row.provider !== "system"))
				&& hasAccess("ROLE_UI_USERS_DELETE", user) && <>
					<Tooltip title={t("USERS.USERS.TABLE.TOOLTIP.DETAILS")}>
						<button
							onClick={() => setDeleteConfirmation(true)}
							className="button-like-anchor remove"
						/>
					</Tooltip>

					{/* Confirmation for deleting a user */}
					{displayDeleteConfirmation && (
						<ConfirmModal
							close={hideDeleteConfirmation}
							resourceName={row.name}
							resourceId={row.username}
							resourceType="USER"
							deleteMethod={deletingUser}
						/>
					)}
				</>
			}
		</>
	);
};

export default UsersActionCell;
