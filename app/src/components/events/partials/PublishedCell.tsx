import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// References for detecting a click outside of the container of the popup listing publications of an event
const containerPublications = React.createRef<HTMLDivElement>();

/**
 * This component renders the published cells of events in the table view
 */
const PublishCell = ({
    row
}: any) => {
	const { t } = useTranslation();

	// State of popup listing publications of an event
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		// Function for handling clicks outside of popup
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
		const handleClickOutside = (e) => {
			if (
				containerPublications.current &&
				!containerPublications.current.contains(e.target)
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
		<div className="popover-wrapper" ref={containerPublications}>
			{row.publications.length ? (
				<>
					<button className="button-like-anchor popover-wrapper__trigger">
						<span onClick={() => setShowPopup(!showPopup)}>{t("YES")}</span>
					</button>
					{showPopup && (
						<div className="js-popover popover">
							<div className="popover__header" />
							<div className="popover__content">
								{/* Show a list item for each publication of an event that isn't hidden*/}
{/* @ts-expect-error TS(7006): Parameter 'publication' implicitly has an 'any' ty... Remove this comment to see the full error message */}
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
// @ts-expect-error TS(2322): Type '{ children: Element; href: any; className: s... Remove this comment to see the full error message
												enabled
											>
												<span>{t(publication.name)}</span>
											</a>
										) : (
											<button key={key} className="button-like-anchor popover__list-item">
												<span>{t(publication.name)}</span>
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
