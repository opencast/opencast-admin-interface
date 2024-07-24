import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Event } from "../../../slices/eventSlice";

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

	return (
		<div className="popover-wrapper">
			{row.publications.length ? (
				<>
					<button className="button-like-anchor popover-wrapper__trigger">
						<span onClick={() => setShowPopup(!showPopup)}>{t("YES")}</span>
					</button>
					{showPopup && (
						<div className="js-popover popover" ref={containerPublications}>
							<div className="popover__header" />
							<div className="popover__content">
								{/* Show a list item for each publication of an event that isn't hidden*/}
								{row.publications.map((publication, key) =>
									!publication.hide ? (
										// Check if publications is enabled and choose icon according
										publication.enabled ? (
											<a
												href={publication.url}
												className="popover__list-item"
												target="_blank"
                        rel='noreferrer'
												key={key}
											>
												<span>{publication.label ? t(publication.label) : t(publication.name)}</span>
											</a>
										) : (
											<button key={key} className="button-like-anchor popover__list-item">
												<span>{publication.label ? t(publication.label) : t(publication.name)}</span>
											</button>
										)
									) : null
								)}
							</div>
						</div>
					)}
				</>
			) : null}
		</div>
	);
};

export default PublishCell;
