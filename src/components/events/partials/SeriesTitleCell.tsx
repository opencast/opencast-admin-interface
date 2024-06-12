import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { setSpecificEventFilter } from "../../../slices/tableFilterSlice";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the title cells of series in the table view
 */
const SeriesTitleCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'loadingEventsIntoTable' implicitl... Remove this comment to see the full error message
	loadingEventsIntoTable,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

// @ts-expect-error TS(7006): Parameter 'seriesId' implicitly has an 'any' type.
	const redirectToEvents = async (seriesId) => {
		// redirect to tables
		await loadingEventsIntoTable();

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

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingEventsIntoTable: () => dispatch(loadEventsIntoTable()),
});

export default connect(null, mapDispatchToProps)(SeriesTitleCell);
