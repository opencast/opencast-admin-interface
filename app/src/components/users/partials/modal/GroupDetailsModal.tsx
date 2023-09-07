import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module './GroupDetails' was resolved to '/home/arn... Remove this comment to see the full error message
import GroupDetails from "./GroupDetails";

/**
 * This component renders the modal for displaying group details
 */
const GroupDetailsModal = ({
    close,
    groupName
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
				id="group-modal"
				className="modal wizard modal-animation"
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
					<h2>{t("USERS.GROUPS.DETAILS.EDITCAPTION", { name: groupName })}</h2>
				</header>

				{/* component that manages tabs of group details modal*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<GroupDetails close={close} />
			</section>
		</>
	);
};

export default GroupDetailsModal;
