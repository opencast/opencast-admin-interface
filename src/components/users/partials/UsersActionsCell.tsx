import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { UserResult, deleteUser } from "../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchUserDetails } from "../../../slices/userDetailsSlice";
import { Tooltip } from "../../shared/Tooltip";
import { Modal, ModalHandle } from "../../shared/modals/Modal";
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

	const deleteConfirmationModalRef = useRef<ModalHandle>(null);
	const modalRef = useRef<ModalHandle>(null);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		deleteConfirmationModalRef.current?.close?.();
	};

	const deletingUser = (id: string) => {
		dispatch(deleteUser(id));
	};

	const showUserDetails = async () => {
		await dispatch(fetchUserDetails(row.username));

		modalRef.current?.open()
	};

	const hideUserDetails = () => {
		modalRef.current?.close?.()
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

			{/* user details modal */}
			<Modal
				header={t("USERS.USERS.DETAILS.EDITCAPTION", { username: row.username })}
				classId="user-details-modal"
				ref={modalRef}
			>
				{/* component that manages tabs of user details modal*/}
				<UserDetails close={hideUserDetails} />
			</Modal>

			{(row.manageable || (row.provider !== "opencast" && row.provider !== "system"))
				&& hasAccess("ROLE_UI_USERS_DELETE", user) && <>
					<Tooltip title={t("USERS.USERS.TABLE.TOOLTIP.DETAILS")}>
						<button
							onClick={() => deleteConfirmationModalRef.current?.open()}
							className="button-like-anchor remove"
						/>
					</Tooltip>

					{/* Confirmation for deleting a user */}
					<ConfirmModal
						close={hideDeleteConfirmation}
						resourceName={row.name}
						resourceId={row.username}
						resourceType="USER"
						deleteMethod={deletingUser}
						modalRef={deleteConfirmationModalRef}
					/>
				</>
			}
		</>
	);
};

export default UsersActionCell;
