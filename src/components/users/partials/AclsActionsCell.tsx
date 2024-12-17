import React, { useState } from "react";
import { AclResult, deleteAcl } from "../../../slices/aclSlice";
import { useAppDispatch } from "../../../store";
import { fetchAclDetails } from "../../../slices/aclDetailsSlice";
import DetailsModal from "../../shared/modals/DetailsModal";
import AclDetails from "./modal/AclDetails";
import { ActionCellDelete } from "../../shared/ActionCellDelete";
import { IconButton } from "../../shared/IconButton";

/**
 * This component renders the action cells of acls in the table view
 */
const AclsActionsCell = ({
	row,
}: {
	row: AclResult
}) => {
	const dispatch = useAppDispatch();

	const [displayAclDetails, setAclDetails] = useState(false);

	const hideAclDetails = () => {
		setAclDetails(false);
	};

	const showAclDetails = async () => {
		await dispatch(fetchAclDetails(row.id));

		setAclDetails(true);
	};

	const deletingAcl = (id: number) => {
		dispatch(deleteAcl(id));
	};

	return (
		<>
			{/* edit/show ACL details */}
			<IconButton
				callback={showAclDetails}
				iconClassname={"more"}
				editAccessRole={"ROLE_UI_ACLS_EDIT"}
				tooltipText={"USERS.ACLS.TABLE.TOOLTIP.DETAILS"}
			/>
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
			<ActionCellDelete
				editAccessRole={"ROLE_UI_ACLS_DELETE"}
				tooltipText={"USERS.ACLS.TABLE.TOOLTIP.DETAILS"}
				resourceId={row.id}
				resourceName={row.name}
				resourceType={"ACL"}
				deleteMethod={deletingAcl}
			/>
		</>
	);
};

export default AclsActionsCell;
