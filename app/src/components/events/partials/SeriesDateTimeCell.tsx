import React from "react";
import { useTranslation } from "react-i18next";

/**
 * This component renders the creation date cells of series in the table view
 */
const SeriesDateTimeCell = ({
    row
}: any) => {
	const { t } = useTranslation();

	return (
		// Link template for creation date of series
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<span>
			{t("dateFormats.dateTime.short", {
				dateTime: new Date(row.creation_date),
			})}
		</span>
	);
};

export default SeriesDateTimeCell;
