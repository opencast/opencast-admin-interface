import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module './UserDetails' was resolved to '/home/arne... Remove this comment to see the full error message
import UserDetails from "./UserDetails";

/**
 * This component renders the modal for displaying user details
 */
const UserDetailsModal = ({
    close,
    username
}: any) => {
	const { t } = useTranslation();

	const handleClose = () => {
		close();
	};

	const modalStyle = {
		fontSize: "14px",
	};

	return (
		// todo: add hotkeys
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section
				id="user-details-modal"
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
					<h2>
						{t("USERS.USERS.DETAILS.EDITCAPTION", { username: username })}
					</h2>
				</header>

				{/* component that manages tabs of user details modal*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<UserDetails close={close} />
			</section>
		</>
	);
};

export default UserDetailsModal;
