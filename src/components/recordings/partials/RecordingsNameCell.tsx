import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { setSpecificEventFilter } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch } from "../../../store";
import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the name cells of recordings in the table view
 */
const RecordingsNameCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

// @ts-expect-error TS(7006): Parameter 'locationName' implicitly has an 'any' t... Remove this comment to see the full error message
	const redirectToEvents = async (locationName) => {
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
				onClick={async () => await redirectToEvents(row.Name)}
			>
				{row.name}
			</Link>
		</Tooltip>
	);
};

export default RecordingsNameCell;
