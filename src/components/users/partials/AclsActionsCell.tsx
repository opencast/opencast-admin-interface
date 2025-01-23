import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import { AclResult, deleteAcl } from "../../../slices/aclSlice";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAclDetails } from "../../../slices/aclDetailsSlice";
import { Tooltip } from "../../shared/Tooltip";
import DetailsModal from "../../shared/modals/DetailsModal";
import AclDetails from "./modal/AclDetails";

/**
 * This component renders the action cells of acls in the table view
 */
const AclsActionsCell = ({
	row,
}: {
	row: AclResult
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayAclDetails, setAclDetails] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

	const deletingAcl = (id: number) => {
		dispatch(deleteAcl(id));
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
				<Tooltip title={t("USERS.ACLS.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => showAclDetails()}
						className="button-like-anchor more"
					/>
				</Tooltip>
			)}

			{displayAclDetails && (
				<DetailsModal
					handleClose={hideAclDetails}
					title={row.name}
					prefix={"USERS.ACLS.DETAILS.HEADER"}
				>
					<AclDetails close={hideAclDetails} />
				</DetailsModal>
			)}

			{/* delete ACL */}
			{hasAccess("ROLE_UI_ACLS_DELETE", user) && (
				<Tooltip title={t("USERS.ACLS.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => setDeleteConfirmation(true)}
						className="button-like-anchor remove"
					/>
				</Tooltip>
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

export default AclsActionsCell;
