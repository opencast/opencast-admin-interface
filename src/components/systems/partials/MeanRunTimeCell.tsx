import React from "react";
import { useTranslation } from "react-i18next";
import { renderValidDate } from "../../../utils/dateUtils";
import { Service } from "../../../slices/serviceSlice";

/**
 * This component renders the mean run time cells of systems in the table view
 */
const MeanRunTimeCell = ({
	row
}: {
	row: Service
}) => {
	const { t } = useTranslation();

	return (
		<span>
			{t("dateFormats.time.medium", { time: renderValidDate(row.meanRunTime.toString()) })}
		</span>
	);
};

export default MeanRunTimeCell;
