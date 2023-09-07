import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// References for detecting a click outside of the container of the popup listing publications of an event
const containerPublications = React.createRef();

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
// @ts-expect-error TS(2571): Object is of type 'unknown'.
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="popover-wrapper" ref={containerPublications}>
			{row.publications.length ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className="button-like-anchor popover-wrapper__trigger">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<span onClick={() => setShowPopup(!showPopup)}>{t("YES")}</span>
					</button>
					{showPopup && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="js-popover popover">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="popover__header" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="popover__content">
								{/* Show a list item for each publication of an event that isn't hidden*/}
// @ts-expect-error TS(7006): Parameter 'publication' implicitly has an 'any' ty... Remove this comment to see the full error message
								{row.publications.map((publication, key) =>
									!publication.hiding ? (
										// Check if publications is enabled and choose icon according
										publication.enabled ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<a
												href={publication.url}
												className="popover__list-item"
												target="_blank"
                        rel='noreferrer'
												key={key}
// @ts-expect-error TS(2322): Type '{ children: Element; href: any; className: s... Remove this comment to see the full error message
												enabled
											>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<span>{t(publication.name)}</span>
											</a>
										) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<button key={key} className="button-like-anchor popover__list-item">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
