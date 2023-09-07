import React from "react";
import { useTranslation } from "react-i18next";

/**
 * This component renders the status cells of recordings in the table view
 */
const RecordingsStatusCell = ({
 row
}: any) => {
	const { t } = useTranslation();

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
	return <span data-status={row.status}>{t(row.status)}</span>;
};

export default RecordingsStatusCell;
