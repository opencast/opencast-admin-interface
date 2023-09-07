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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section
				className="modal modal-animation"
				id="confirm-modal"
				style={{ fontSize: "14px" }}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>{t("CONFIRMATIONS.ACTIONS.CONFIRMATION")}</h2>
				</header>

				{deleteAllowed ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div>
						{showCautionMessage && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="modal-alert warning">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<p>{t(deleteWithCautionMessage)}</p>
							</div>
						)}

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<span>
									{t("CONFIRMATIONS.METADATA.NOTICE." + resourceType)}
								</span>
							</p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<p className="delete">{resourceName}</p>
						</div>
						{resourceType === "EVENT" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<p className="warning">
								{t("CONFIRMATIONS.WARNINGS.EVENT_WILL_BE_GONE")}
							</p>
						)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<p>{t("CONFIRMATIONS.CONTINUE_ACTION")}</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="btn-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<button
								className="cancel-btn close-modal"
								onClick={() => handleClose()}
							>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i>{t("CANCEL")}</i>
							</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<button
								className="danger-btn"
								onClick={() => handleConfirmation()}
							>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i>{t("CONFIRM")}</i>
							</button>
						</div>
					</div>
				) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-alert danger">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<p>{t(deleteNotAllowedMessage)}</p>
						</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="btn-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<button
								className="cancel-btn close-modal"
								onClick={() => handleClose()}
							>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
