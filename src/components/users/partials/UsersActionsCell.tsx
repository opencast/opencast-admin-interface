import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ConfirmModal from "../../shared/ConfirmModal";
import UserDetailsModal from "./modal/UserDetailsModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { deleteUser } from "../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchUserDetails } from "../../../slices/userDetailsSlice";

/**
 * This component renders the action cells of users in the table view
 */
const UsersActionCell = ({
    row,
}: any) => {
	const { t } = useTranslation();
  const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayUserDetails, setUserDetails] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingUser = (id) => {
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
				<button
					onClick={() => showUserDetails()}
					className="button-like-anchor more"
					title={t("USERS.USERS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{displayUserDetails && (
				<UserDetailsModal close={hideUserDetails} username={row.username} />
			)}

			{(row.manageable || (row.provider !== "opencast" && row.provider !== "system"))
				&& hasAccess("ROLE_UI_USERS_DELETE", user) && <>
					<button
						onClick={() => setDeleteConfirmation(true)}
						className="button-like-anchor remove"
						title={t("USERS.USERS.TABLE.TOOLTIP.DETAILS")}
					/>

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
