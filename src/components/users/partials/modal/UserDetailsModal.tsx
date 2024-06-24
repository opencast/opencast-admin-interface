import React from "react";
import { useTranslation } from "react-i18next";
import UserDetails from "./UserDetails";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";
import { focusTrap } from "../../../../utils/modalUtils";

/**
 * This component renders the modal for displaying user details
 */
const UserDetailsModal = ({
    close,
    username
}: any) => {
	const { t } = useTranslation();

	const userDetailsModalRef = React.useRef(null);
	const [focusEneabled, setFocusEneabled] = React.useState(false);
	React.useEffect(() => {
		focusTrap(userDetailsModalRef, focusEneabled, setFocusEneabled);
	});

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => close(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[close],
  	);
	

	const handleClose = () => {
		close();
	};

	const modalStyle = {
		fontSize: "14px",
	};

	return (
		// todo: add hotkeys
		<>
			<div className="modal-animation modal-overlay" />
			<section
				id="user-details-modal"
				className="modal wizard modal-animation"
				style={modalStyle}
				ref={userDetailsModalRef}
			>
				<header>
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
					<h2>
						{t("USERS.USERS.DETAILS.EDITCAPTION", { username: username })}
					</h2>
				</header>

				{/* component that manages tabs of user details modal*/}
				<UserDetails close={close} />
			</section>
		</>
	);
};

export default UserDetailsModal;
