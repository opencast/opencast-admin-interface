import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ConfirmModal from "../../shared/ConfirmModal";
import { deleteUser } from "../../../thunks/userThunks";
import UserDetailsModal from "./modal/UserDetailsModal";
import { fetchUserDetails } from "../../../thunks/userDetailsThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppSelector } from "../../../store";

/**
 * This component renders the action cells of users in the table view
 */
const UsersActionCell = ({
  row,
	deleteUser,
	fetchUserDetails,
}: any) => {
	const { t } = useTranslation();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayUserDetails, setUserDetails] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingUser = (id) => {
		deleteUser(id);
	};

	const showUserDetails = async () => {
		await fetchUserDetails(row.username);

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
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("USERS.USERS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{displayUserDetails && (
				<UserDetailsModal close={hideUserDetails} username={row.username} />
			)}

			{row.manageable && hasAccess("ROLE_UI_USERS_DELETE", user) && (
				<>
					<button
						onClick={() => setDeleteConfirmation(true)}
						className="button-like-anchor remove"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
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
			)}
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({

});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	deleteUser: (id) => dispatch(deleteUser(id)),
// @ts-expect-error TS(7006): Parameter 'username' implicitly has an 'any' type.
	fetchUserDetails: (username) => dispatch(fetchUserDetails(username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersActionCell);
