import React from "react";
import { useTranslation } from "react-i18next";
import { renderValidDate } from "../../../utils/dateUtils";

/**
 * This component renders the updated cells of recordings in the table view
 */
const RecordingsUpdateCell = ({
    row
}: any) => {
	const { t } = useTranslation();

	return (
		<span>
			{t("dateFormats.dateTime.short", { dateTime: renderValidDate(row.updated) })}
		</span>
	);
};

export default RecordingsUpdateCell;
