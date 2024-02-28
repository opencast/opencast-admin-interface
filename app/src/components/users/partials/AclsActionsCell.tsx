import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ConfirmModal from "../../shared/ConfirmModal";
import { deleteAcl } from "../../../thunks/aclThunks";
import AclDetailsModal from "./modal/AclDetailsModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAclDetails } from "../../../slices/aclDetailsSlice";

/**
 * This component renders the action cells of acls in the table view
 */
const AclsActionsCell = ({
	row,
	deleteAcl,
}: any) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayAclDetails, setAclDetails] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingAcl = (id) => {
		deleteAcl(id);
	};

	const hideAclDetails = () => {
		setAclDetails(false);
	};

	const showAclDetails = async () => {
		await dispatch(fetchAclDetails(row.id));

		setAclDetails(true);
	};

	return (
		<>
			{/* edit/show ACL details */}
			{hasAccess("ROLE_UI_ACLS_EDIT", user) && (
				<button
					onClick={() => showAclDetails()}
					className="button-like-anchor more"
					title={t("USERS.ACLS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{displayAclDetails && (
				<AclDetailsModal close={hideAclDetails} aclName={row.name} />
			)}

			{/* delete ACL */}
			{hasAccess("ROLE_UI_ACLS_DELETE", user) && (
				<button
					onClick={() => setDeleteConfirmation(true)}
					className="button-like-anchor remove"
					title={t("USERS.ACLS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{/* Confirmation for deleting an ACL */}
			{displayDeleteConfirmation && (
				<ConfirmModal
					close={hideDeleteConfirmation}
					resourceName={row.name}
					resourceId={row.id}
					resourceType="ACL"
					deleteMethod={deletingAcl}
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
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	deleteAcl: (id) => dispatch(deleteAcl(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AclsActionsCell);
