import React from "react";
import { useTranslation } from "react-i18next";
import GroupDetails from "./GroupDetails";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";
import { focusTrap } from "../../../../utils/modalUtils";

/**
 * This component renders the modal for displaying group details
 */
const GroupDetailsModal = ({
    close,
    groupName
}: any) => {
	const { t } = useTranslation();
	const closeButtonRef = React.useRef(null);
	
	const groupDetailsModalRef = React.useRef(null);

	const [focusEneabled, setFocusEneabled] = React.useState(false);
	React.useEffect(() => {
		focusTrap(groupDetailsModalRef, focusEneabled, setFocusEneabled);
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
		color: "#666666",
	};

	return (
		// todo: add hotkeys
		<>
			<div className="modal-animation modal-overlay" />
			<section
				id="group-modal"
				className="modal wizard modal-animation"
				style={modalStyle}
				ref={groupDetailsModalRef}
			>
				<header>
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
						ref={closeButtonRef}
					/>
					<h2>{t("USERS.GROUPS.DETAILS.EDITCAPTION", { name: groupName })}</h2>
				</header>

				{/* component that manages tabs of group details modal*/}
				<GroupDetails close={close} />
			</section>
		</>
	);
};

export default GroupDetailsModal;
