import React from "react";
import { useTranslation } from "react-i18next";

/**
 * This component renders the updated cells of recordings in the table view
 */
const RecordingsUpdateCell = ({
    row
}: any) => {
	const { t } = useTranslation();

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<span>
			{t("dateFormats.dateTime.short", { dateTime: new Date(row.update) })}
		</span>
	);
};

export default RecordingsUpdateCell;
