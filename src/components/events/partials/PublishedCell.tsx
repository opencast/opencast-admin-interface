import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Event } from "../../../slices/eventSlice";
import { Tooltip } from "../../shared/Tooltip";
import ButtonLikeAnchor from "../../shared/ButtonLikeAnchor";

// References for detecting a click outside of the container of the popup listing publications of an event
const containerPublications = React.createRef<HTMLDivElement>();

/**
 * This component renders the published cells of events in the table view
 */
const PublishCell = ({
	row
}: {
	row: Event
}) => {
	const { t } = useTranslation();

	// State of popup listing publications of an event
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		// Function for handling clicks outside of popup
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerPublications.current &&
				!containerPublications.current.contains(e.target as Node)
			) {
				setShowPopup(false);
			}
		};

		// Event listener for handle a click outside of popup
		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const onlyEngage = row.publications.length === 1
		&& row.publications[0].enabled
		&& !row.publications[0].hiding
		&& row.publications[0].id === 'engage-player';

	return (
		<div className="popover-wrapper">
			{onlyEngage && (
				<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.PLAYER")}>
					<a href={row.publications[0].url} rel='noreferrer' target="_blank">
						<ButtonLikeAnchor>
							{t("YES")}
						</ButtonLikeAnchor>
					</a>
				</Tooltip>
			)}
			{!onlyEngage && row.publications.length > 0 && (
				<>
					<ButtonLikeAnchor extraClassName="popover-wrapper__trigger">
						<span onClick={() => setShowPopup(!showPopup)}>{t("YES")}</span>
					</ButtonLikeAnchor>
					{showPopup && (
						<div className="js-popover popover" ref={containerPublications}>
							<div className="popover__header" />
							<div className="popover__content">
								{/* Show a list item for each publication of an event that isn't hidden*/}
								{row.publications.map((publication, key) =>
									!publication.hiding ? (
										// Check if publications is enabled and choose icon according
										publication.enabled ? (
											<a
												href={publication.url}
												className="popover__list-item"
												target="_blank"
												rel='noreferrer'
												key={key}
											>
												<span>{t(publication.name)}</span>
											</a>
										) : (
											<ButtonLikeAnchor key={key} extraClassName="popover__list-item">
												<span>{t(publication.name)}</span>
											</ButtonLikeAnchor>
										)
									) : null
								)}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default PublishCell;
