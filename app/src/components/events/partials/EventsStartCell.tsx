import { useTranslation } from "react-i18next";
import React from "react";
import { renderValidDate } from "../../../utils/dateUtils";

/**
 * This component renders the start cells of events in the table view
 */
const EventsStartCell = ({
    row
}: any) => {
	const { t } = useTranslation();

	return (
		// Link template for start date of event
		<span>
			{t("dateFormats.time.short", { time: renderValidDate(row.start_date) })}
		</span>
	);
};

export default EventsStartCell;
