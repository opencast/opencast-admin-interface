import ConfirmModal, { ResourceType } from "./ConfirmModal";
import { useRef } from "react";
import { IconButton } from "./IconButton";
import { ModalHandle } from "./modals/Modal";

export const ActionCellDelete = <T, >({
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
	const deleteConfirmationModalRef = useRef<ModalHandle>(null);

	return (
		<>
			{/* delete button */}
			<IconButton
				callback={() => deleteConfirmationModalRef.current?.open()}
				iconClassname={"remove"}
				editAccessRole={editAccessRole}
				tooltipText={tooltipText}
			/>

			{/* Confirmation modal for deleting */}
			<ConfirmModal
				close={() => deleteConfirmationModalRef.current?.close?.()}
				resourceName={resourceName}
				resourceId={resourceId}
				resourceType={resourceType}
				deleteMethod={deleteMethod}
				deleteAllowed={deleteAllowed}
				showCautionMessage={showCautionMessage}
				deleteNotAllowedMessage={deleteNotAllowedMessage}
				deleteWithCautionMessage={deleteWithCautionMessage}
				modalRef={deleteConfirmationModalRef}
			/>
		</>
	)
};