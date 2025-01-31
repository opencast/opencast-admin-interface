import React from "react";
import { useTranslation } from "react-i18next";
import GroupDetails from "./GroupDetails";
import { Modal, ModalHandle } from "../../../shared/modals/Modal";

/**
 * This component renders the modal for displaying group details
 */
const GroupDetailsModal = ({
	close,
	groupName,
	modalRef,
}: {
	close: () => void,
	groupName: string,
	modalRef: React.RefObject<ModalHandle>
}) => {
	const { t } = useTranslation();


	return (
		<Modal
			header={t("USERS.GROUPS.DETAILS.EDITCAPTION", { name: groupName })}
			classId="group-modal"
			ref={modalRef}
		>
			{/* component that manages tabs of group details modal*/}
			<GroupDetails close={close} />
		</Modal>
	);
};

export default GroupDetailsModal;
