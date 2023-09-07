import React from "react";

/**
 * This component renders the contributors cells of series in the table view
 */
const SeriesContributorsCell = ({
    row
}: any) => {
// @ts-expect-error TS(7006): Parameter 'contributor' implicitly has an 'any' ty... Remove this comment to see the full error message
	return row.contributors.map((contributor, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<span key={key} className="metadata-entry">
			{contributor}
		</span>
	));
};

export default SeriesContributorsCell;
