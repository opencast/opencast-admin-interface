import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalHandle } from "./modals/Modal";

const ConfirmModal = <T,>({
	close,
	resourceType,
	resourceName,
	resourceId,
	deleteMethod,
	deleteAllowed = true,
	showCautionMessage = false,
	deleteNotAllowedMessage = "",
	deleteWithCautionMessage = "",
	modalRef,
}: {
	close: () => void,
	resourceType: "EVENT" | "SERIES" | "LOCATION" | "USER" | "GROUP" | "ACL" | "THEME" | "TOBIRA_PATH",
	resourceName: string,
	resourceId: T,
	deleteMethod: (id: T) => void,
	deleteAllowed?: boolean,
	showCautionMessage?: boolean,
	deleteNotAllowedMessage?: string,
	deleteWithCautionMessage?: string,
	modalRef: React.RefObject<ModalHandle>
}) => {
	const { t } = useTranslation();

	const handleClose = () => {
		close();
	};

	const handleConfirmation = () => {
		deleteMethod(resourceId);
		close();
	};

	return (
		<Modal
			header={t("CONFIRMATIONS.ACTIONS.CONFIRMATION")}
			classId="confirm-modal"
			ref={modalRef}
		>
			{deleteAllowed ? (
				<div>
					{showCautionMessage && (
						<div className="modal-alert warning">
							<p>{t(deleteWithCautionMessage)}</p>
						</div>
					)}

					<div>
						<p>
							<span style={{ padding: "0px 4px"}}>
								{t("CONFIRMATIONS.METADATA.NOTICE." + resourceType)}
							</span>
						</p>
						<p className="delete">{resourceName}</p>
					</div>
					{resourceType === "EVENT" && (
						<p className="warning">
							{t("CONFIRMATIONS.WARNINGS.EVENT_WILL_BE_GONE")}
						</p>
					)}
					<p>{t("CONFIRMATIONS.CONTINUE_ACTION")}</p>

					<div className="btn-container">
						<button
							className="cancel-btn close-modal"
							onClick={() => handleClose()}
						>
							<i>{t("CANCEL")}</i>
						</button>
						<button
							className="danger-btn"
							onClick={() => handleConfirmation()}
						>
							<i>{t("CONFIRM")}</i>
						</button>
					</div>
				</div>
			) : (
				<div>
					<div className="modal-alert danger">
						<p>{t(deleteNotAllowedMessage)}</p>
					</div>
					<div className="btn-container">
						<button
							className="cancel-btn close-modal"
							onClick={() => handleClose()}
						>
							<i>{t("CANCEL")}</i>
						</button>
					</div>
				</div>
			)}
		</Modal>
	);
};

export default ConfirmModal;
