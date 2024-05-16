import React from "react";
import { useTranslation } from "react-i18next";

const ConfirmModal = ({
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
	close,
// @ts-expect-error TS(7031): Binding element 'resourceType' implicitly has an '... Remove this comment to see the full error message
	resourceType,
// @ts-expect-error TS(7031): Binding element 'resourceName' implicitly has an '... Remove this comment to see the full error message
	resourceName,
// @ts-expect-error TS(7031): Binding element 'resourceId' implicitly has an 'an... Remove this comment to see the full error message
	resourceId,
// @ts-expect-error TS(7031): Binding element 'deleteMethod' implicitly has an '... Remove this comment to see the full error message
	deleteMethod,
	deleteAllowed = true,
	showCautionMessage = false,
	deleteNotAllowedMessage = "",
	deleteWithCautionMessage = "",
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
		<>
			<div className="modal-animation modal-overlay" />
			<section
				className="modal modal-animation"
				id="confirm-modal"
				style={{ fontSize: "14px" }}
			>
				<header>
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
					<h2>{t("CONFIRMATIONS.ACTIONS.CONFIRMATION")}</h2>
				</header>

				{deleteAllowed ? (
					<div>
						{showCautionMessage && (
							<div className="modal-alert warning">
								<p>{t(deleteWithCautionMessage)}</p>
							</div>
						)}

						<div>
							<p>
								<span>
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
			</section>
		</>
	);
};

export default ConfirmModal;
