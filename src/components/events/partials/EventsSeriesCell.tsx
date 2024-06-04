import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { connect } from "react-redux";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";

/**
 * This component renders the series cells of events in the table view
 */
const EventsSeriesCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'loadEventsIntoTable' implicitly h... Remove this comment to see the full error message
	loadEventsIntoTable,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
// @ts-expect-error TS(7006): Parameter 'series' implicitly has an 'any' type.
	const addFilter = async (series) => {
		let filter = filterMap.find(({ name }) => name === "series");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: series.id}));
			await dispatch(fetchEvents());
			loadEventsIntoTable();
		}
	};

	return (
		!!row.series && (
			// Link template for series of event
			<button
				className="button-like-anchor crosslink"
				title={t("EVENTS.EVENTS.TABLE.TOOLTIP.SERIES")}
				onClick={() => addFilter(row.series)}
			>
				{row.series.title}
			</button>
		)
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadEventsIntoTable: () => dispatch(loadEventsIntoTable()),
});

// @ts-expect-error TS(2345): Argument of type '({ row, filterMap, editFilterVal... Remove this comment to see the full error message
export default connect(mapStateToProps, mapDispatchToProps)(EventsSeriesCell);
