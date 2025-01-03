import React from "react";
import { useTranslation } from "react-i18next";
import { renderValidDate } from "../../../utils/dateUtils";
import { Job } from "../../../slices/jobSlice";

/**
 * This component renders the started date cells of jobs in the table view
 */
const JobsStartedCell = ({
	row
}: {
	row: Job
}) => {
	const { t } = useTranslation();

	return (
		<span>
			{t("dateFormats.dateTime.short", { dateTime: renderValidDate(row.started) })}
		</span>
	);
};

export default JobsStartedCell;
