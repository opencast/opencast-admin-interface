import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import { AclResult, deleteAcl } from "../../../slices/aclSlice";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAclDetails } from "../../../slices/aclDetailsSlice";
import { Tooltip } from "../../shared/Tooltip";
import { Modal, ModalHandle } from "../../shared/modals/Modal";
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

	const deleteConfirmationModalRef = useRef<ModalHandle>(null);
	const modalRef = useRef<ModalHandle>(null);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		deleteConfirmationModalRef.current?.close?.();
	};

	const deletingAcl = (id: number) => {
		dispatch(deleteAcl(id));
	};

	const hideAclDetails = () => {
		modalRef.current?.close?.()
	};

	const showAclDetails = async () => {
		await dispatch(fetchAclDetails(row.id));

		modalRef.current?.open()
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

			{/* ACL details modal */}
			<Modal
				header={t("USERS.ACLS.DETAILS.HEADER", { name: row.name })}
				classId="acl-details-modal"
				ref={modalRef}
			>
				{/* component that manages tabs of acl details modal*/}
				<AclDetails close={hideAclDetails} />
			</Modal>

			{/* delete ACL */}
			{hasAccess("ROLE_UI_ACLS_DELETE", user) && (
				<Tooltip title={t("USERS.ACLS.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => deleteConfirmationModalRef.current?.open()}
						className="button-like-anchor remove"
					/>
				</Tooltip>
			)}

			{/* Confirmation for deleting an ACL */}
			<ConfirmModal
				close={hideDeleteConfirmation}
				resourceName={row.name}
				resourceId={row.id}
				resourceType="ACL"
				deleteMethod={deletingAcl}
				modalRef={deleteConfirmationModalRef}
			/>
		</>
	);
};

export default AclsActionsCell;
