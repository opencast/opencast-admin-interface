import { useTranslation } from "react-i18next";
import React from "react";

/**
 * This component renders the start cells of events in the table view
 */
const EventsStartCell = ({
    row
}: any) => {
	const { t } = useTranslation();

	return (
		// Link template for start date of event
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<span>
			{t("dateFormats.time.short", { time: new Date(row.start_date) })}
		</span>
	);
};

export default EventsStartCell;
