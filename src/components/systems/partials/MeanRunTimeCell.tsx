import React from "react";
import { useTranslation } from "react-i18next";
import { renderValidDate } from "../../../utils/dateUtils";

/**
 * This component renders the mean run time cells of systems in the table view
 */
const MeanRunTimeCell = ({
    row
}: any) => {
	const { t } = useTranslation();

	return (
		<span>
			{t("dateFormats.time.medium", { time: renderValidDate(row.meanRunTime) })}
		</span>
	);
};

export default MeanRunTimeCell;
