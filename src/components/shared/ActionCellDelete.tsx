import ConfirmModal, { ResourceType } from "./ConfirmModal";
import { useState } from "react";
import { IconButton } from "./IconButton";

export const ActionCellDelete = <T,>({
	editAccessRole,
	tooltipText,
	resourceId,
	resourceName,
	resourceType,
	deleteMethod,
	deleteAllowed,
	showCautionMessage,
	deleteNotAllowedMessage,
	deleteWithCautionMessage,
}: {
	editAccessRole: string
	tooltipText: string
	resourceId: T
	resourceName: string
	resourceType: ResourceType
	deleteMethod: (id: T) => void
	deleteAllowed?: boolean,
	showCautionMessage?: boolean,
	deleteNotAllowedMessage?: string,
	deleteWithCautionMessage?: string,
}) => {
	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);

	return (
		<>
			{/* delete button */}
			<IconButton
				callback={() => setDeleteConfirmation(true)}
				iconClassname={"remove"}
				editAccessRole={editAccessRole}
				tooltipText={tooltipText}
			/>

			{/* Confirmation modal for deleting */}
			{displayDeleteConfirmation && (
				<ConfirmModal
					close={() => setDeleteConfirmation(false)}
					resourceName={resourceName}
					resourceId={resourceId}
					resourceType={resourceType}
					deleteMethod={deleteMethod}
					deleteAllowed={deleteAllowed}
					showCautionMessage={showCautionMessage}
					deleteNotAllowedMessage={deleteNotAllowedMessage}
					deleteWithCautionMessage={deleteWithCautionMessage}
				/>
			)}
		</>
	)
};