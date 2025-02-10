import React from "react";
import { useTranslation } from "react-i18next";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { setSpecificEventFilter } from "../../../slices/tableFilterSlice";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { Tooltip } from "../../shared/Tooltip";
import { Series } from "../../../slices/seriesSlice";

/**
 * This component renders the title cells of series in the table view
 */
const SeriesTitleCell = ({
	row,
}: {
	row: Series
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const redirectToEvents = async (seriesId: string) => {
		// redirect to tables
		await dispatch(loadEventsIntoTable());

		// set the series filter value of events to series title
		await dispatch(setSpecificEventFilter({filter: "series", filterValue: seriesId}));
	};

	return (
		<Tooltip title={t("EVENTS.SERIES.TABLE.TOOLTIP.SERIES")}>
			<Link
				to="/events/events"
				className="crosslink"
				onClick={async () => await redirectToEvents(row.id)}
			>
				{row.title}
			</Link>
		</Tooltip>
	);
};

export default SeriesTitleCell;
