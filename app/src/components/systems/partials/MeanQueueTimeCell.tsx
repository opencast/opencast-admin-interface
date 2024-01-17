import React from "react";
import { useTranslation } from "react-i18next";
import { renderValidDate } from "../../../utils/dateUtils";

/**
 * This component renders the mean queue time cells of systems in the table view
 */
const MeanQueueTimeCell = ({
    row
}: any) => {
	const { t } = useTranslation();

	return (
		<span>
			{t("dateFormats.time.medium", { time: renderValidDate(row.meanQueueTime) })}
		</span>
	);
};

export default MeanQueueTimeCell;
