import React from "react";

/**
 * This component renders the creators cells of series in the table view
 */
const SeriesCreatorsCell = ({
    row
}: any) => {
// @ts-expect-error TS(7006): Parameter 'organizer' implicitly has an 'any' type... Remove this comment to see the full error message
	return row.organizers.map((organizer, key) => (
		<span key={key} className="metadata-entry">
			{organizer}
		</span>
	));
};

export default SeriesCreatorsCell;
