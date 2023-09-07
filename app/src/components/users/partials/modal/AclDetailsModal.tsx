import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module './AclDetails' was resolved to '/home/arnew... Remove this comment to see the full error message
import AclDetails from "./AclDetails";

/**
 * This component renders the modal for displaying acl details
 */
const AclDetailsModal = ({
    close,
    aclName
}: any) => {
	const { t } = useTranslation();

	const handleClose = () => {
		close();
	};

	const modalStyle = {
		fontSize: "14px",
		color: "#666666",
	};

	return (
		// todo: add hotkeys
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section
				className="modal wizard modal-animation"
				id="acl-details-modal"
				style={modalStyle}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>{t("USERS.ACLS.DETAILS.HEADER", { name: aclName })}</h2>
				</header>

				{/* component that manages tabs of acl details modal*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<AclDetails close={close} />
			</section>
		</>
	);
};

export default AclDetailsModal;
