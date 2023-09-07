import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../../shared/ConfirmModal' was resolved to... Remove this comment to see the full error message
import ConfirmModal from "../../shared/ConfirmModal";
import { deleteAcl } from "../../../thunks/aclThunks";
// @ts-expect-error TS(6142): Module './modal/AclDetailsModal' was resolved to '... Remove this comment to see the full error message
import AclDetailsModal from "./modal/AclDetailsModal";
import { fetchAclDetails } from "../../../thunks/aclDetailsThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";

/**
 * This component renders the action cells of acls in the table view
 */
const AclsActionsCell = ({
    row,
    deleteAcl,
    fetchAclDetails,
    user
}: any) => {
	const { t } = useTranslation();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayAclDetails, setAclDetails] = useState(false);

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
		await fetchAclDetails(row.id);

		setAclDetails(true);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* edit/show ACL details */}
			{hasAccess("ROLE_UI_ACLS_EDIT", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					onClick={() => showAclDetails()}
					className="button-like-anchor more"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("USERS.ACLS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{displayAclDetails && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<AclDetailsModal close={hideAclDetails} aclName={row.name} />
			)}

			{/* delete ACL */}
			{hasAccess("ROLE_UI_ACLS_DELETE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					onClick={() => setDeleteConfirmation(true)}
					className="button-like-anchor remove"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("USERS.ACLS.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{/* Confirmation for deleting an ACL */}
			{displayDeleteConfirmation && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
	user: getUserInformation(state),
});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	deleteAcl: (id) => dispatch(deleteAcl(id)),
// @ts-expect-error TS(7006): Parameter 'aclId' implicitly has an 'any' type.
	fetchAclDetails: (aclId) => dispatch(fetchAclDetails(aclId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AclsActionsCell);
