import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { setSpecificEventFilter } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch } from "../../../store";
import { Tooltip } from "../../shared/Tooltip";
import { Recording } from "../../../slices/recordingSlice";

/**
 * This component renders the name cells of recordings in the table view
 */
const RecordingsNameCell = ({
	row,
}: {
	row: Recording
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const redirectToEvents = async (locationName: string) => {
		// redirect to tables
		await dispatch(loadEventsIntoTable());

		// set the location filter value of events to location name
		await dispatch(setSpecificEventFilter({ filter: "location", filterValue: locationName }));
	};

	return (
		<Tooltip title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.NAME")}>
			<Link
				to="/events/events"
				className="crosslink"
				onClick={async () => await redirectToEvents(row.name)}
			>
				{row.name}
			</Link>
		</Tooltip>
	);
};

export default RecordingsNameCell;
