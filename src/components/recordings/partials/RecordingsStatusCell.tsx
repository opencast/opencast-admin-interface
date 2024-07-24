import React from "react";
import { useTranslation } from "react-i18next";
import { Recording } from "../../../slices/recordingSlice";

/**
 * This component renders the status cells of recordings in the table view
 */
const RecordingsStatusCell = ({
	row
}: {
	row: Recording
}) => {
	const { t } = useTranslation();

	return <span data-status={row.status}>{t(row.status)}</span>;
};

export default RecordingsStatusCell;
