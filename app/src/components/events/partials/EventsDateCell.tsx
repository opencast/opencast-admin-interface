import React from "react";
import { useTranslation } from "react-i18next";
import { editFilterValue } from "../../../actions/tableFilterActions";
import { fetchEvents } from "../../../thunks/eventThunks";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { connect } from "react-redux";

/**
 * This component renders the start date cells of events in the table view
 */
const EventsDateCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'filterMap' implicitly has an 'any... Remove this comment to see the full error message
	filterMap,
// @ts-expect-error TS(7031): Binding element 'editFilterValue' implicitly has a... Remove this comment to see the full error message
	editFilterValue,
// @ts-expect-error TS(7031): Binding element 'loadEvents' implicitly has an 'an... Remove this comment to see the full error message
	loadEvents,
// @ts-expect-error TS(7031): Binding element 'loadEventsIntoTable' implicitly h... Remove this comment to see the full error message
	loadEventsIntoTable,
}) => {
	const { t } = useTranslation();

	// Filter with value of current cell
// @ts-expect-error TS(7006): Parameter 'date' implicitly has an 'any' type.
	const addFilter = async (date) => {
// @ts-expect-error TS(7031): Binding element 'name' implicitly has an 'any' typ... Remove this comment to see the full error message
		let filter = filterMap.find(({ name }) => name === "startDate");
		if (!!filter) {
			await editFilterValue(filter.name, date + "/" + date);
			await loadEvents();
			loadEventsIntoTable();
		}
	};

	return (
		// Link template for start date of event
		<button
			className="button-like-anchor crosslink"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
			title={t("EVENTS.EVENTS.TABLE.TOOLTIP.START")}
			onClick={() => addFilter(row.date)}
		>
			{t("dateFormats.date.short", { date: new Date(row.date) })}
		</button>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	filterMap: getFilters(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'filterName' implicitly has an 'any' typ... Remove this comment to see the full error message
	editFilterValue: (filterName, value) =>
		dispatch(editFilterValue(filterName, value)),
	loadEvents: () => dispatch(fetchEvents()),
	loadEventsIntoTable: () => dispatch(loadEventsIntoTable()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsDateCell);
