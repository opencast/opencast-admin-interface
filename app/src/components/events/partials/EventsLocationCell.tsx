import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../actions/tableFilterActions";
import { connect } from "react-redux";
import { fetchEvents } from "../../../thunks/eventThunks";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";

/**
 * This component renders the location cells of events in the table view
 */
const EventsLocationCell = ({
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
// @ts-expect-error TS(7006): Parameter 'location' implicitly has an 'any' type.
	const addFilter = (location) => {
// @ts-expect-error TS(7031): Binding element 'name' implicitly has an 'any' typ... Remove this comment to see the full error message
		let filter = filterMap.find(({ name }) => name === "location");
		if (!!filter) {
			editFilterValue(filter.name, location);
			loadEvents();
			loadEventsIntoTable();
		}
	};

	return (
		// Link template for location of event
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<button
			className="button-like-anchor crosslink"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
			title={t("EVENTS.EVENTS.TABLE.TOOLTIP.LOCATION")}
			onClick={() => addFilter(row.location)}
		>
			{row.location}
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

export default connect(mapStateToProps, mapDispatchToProps)(EventsLocationCell);
