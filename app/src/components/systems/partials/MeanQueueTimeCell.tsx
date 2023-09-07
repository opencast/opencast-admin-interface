import React from "react";
import { useTranslation } from "react-i18next";

/**
 * This component renders the mean queue time cells of systems in the table view
 */
const MeanQueueTimeCell = ({
    row
}: any) => {
	const { t } = useTranslation();

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<span>
			{t("dateFormats.time.medium", { time: new Date(row.meanQueueTime) })}
		</span>
	);
};

export default MeanQueueTimeCell;
