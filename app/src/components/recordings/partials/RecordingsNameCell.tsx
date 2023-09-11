import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { setSpecificEventFilter } from "../../../thunks/tableFilterThunks";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { connect } from "react-redux";

/**
 * This component renders the name cells of recordings in the table view
 */
const RecordingsNameCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'loadingEventsIntoTable' implicitl... Remove this comment to see the full error message
	loadingEventsIntoTable,
// @ts-expect-error TS(7031): Binding element 'setSpecificEventFilter' implicitl... Remove this comment to see the full error message
	setSpecificEventFilter,
}) => {
	const { t } = useTranslation();

// @ts-expect-error TS(7006): Parameter 'locationName' implicitly has an 'any' t... Remove this comment to see the full error message
	const redirectToEvents = async (locationName) => {
		// redirect to tables
		await loadingEventsIntoTable();

		// set the location filter value of events to location name
		await setSpecificEventFilter("location", locationName);
	};

	return (
		<Link
			to="/events/events"
			className="crosslink"
			onClick={async () => await redirectToEvents(row.Name)}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
			title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.NAME")}
		>
			{row.name}
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

export default connect(null, mapDispatchToProps)(RecordingsNameCell);
