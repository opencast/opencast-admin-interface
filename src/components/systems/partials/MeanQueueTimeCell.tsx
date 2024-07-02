import React from "react";
import { useTranslation } from "react-i18next";
import { renderValidDate } from "../../../utils/dateUtils";
import { Service } from "../../../slices/serviceSlice";

/**
 * This component renders the mean queue time cells of systems in the table view
 */
const MeanQueueTimeCell = ({
	row
}: {
	row: Service
}) => {
	const { t } = useTranslation();

	return (
		<span>
			{t("dateFormats.time.medium", { time: renderValidDate(row.meanQueueTime.toString()) })}
		</span>
	);
};

export default MeanQueueTimeCell;
