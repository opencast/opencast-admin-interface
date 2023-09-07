import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { setSpecificEventFilter } from "../../../thunks/tableFilterThunks";
import { Link } from "react-router-dom";

/**
 * This component renders the title cells of series in the table view
 */
const SeriesTitleCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'loadingEventsIntoTable' implicitl... Remove this comment to see the full error message
	loadingEventsIntoTable,
// @ts-expect-error TS(7031): Binding element 'setSpecificEventFilter' implicitl... Remove this comment to see the full error message
	setSpecificEventFilter,
}) => {
	const { t } = useTranslation();

// @ts-expect-error TS(7006): Parameter 'seriesId' implicitly has an 'any' type.
	const redirectToEvents = async (seriesId) => {
		// redirect to tables
		await loadingEventsIntoTable();

		// set the series filter value of events to series title
		await setSpecificEventFilter("series", seriesId);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<Link
			to="/events/events"
			className="crosslink"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
			title={t("EVENTS.SERIES.TABLE.TOOLTIP.SERIES")}
			onClick={async () => await redirectToEvents(row.id)}
		>
			{row.title}
		</Link>
	);
};

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingEventsIntoTable: () => dispatch(loadEventsIntoTable()),
// @ts-expect-error TS(7006): Parameter 'filter' implicitly has an 'any' type.
	setSpecificEventFilter: (filter, filterValue) =>
		dispatch(setSpecificEventFilter(filter, filterValue)),
});

export default connect(null, mapDispatchToProps)(SeriesTitleCell);
