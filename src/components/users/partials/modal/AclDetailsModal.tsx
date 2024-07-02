import React from "react";
import { useTranslation } from "react-i18next";
import AclDetails from "./AclDetails";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";

/**
 * This component renders the modal for displaying acl details
 */
const AclDetailsModal = ({
	close,
	aclName
}: {
	close: () => void,
	aclName: string,
}) => {
	const { t } = useTranslation();

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
				className="modal wizard modal-animation"
				id="acl-details-modal"
				style={modalStyle}
			>
				<header>
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
					<h2>{t("USERS.ACLS.DETAILS.HEADER", { name: aclName })}</h2>
				</header>

				{/* component that manages tabs of acl details modal*/}
				<AclDetails close={close} />
			</section>
		</>
	);
};

export default AclDetailsModal;
