import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../actions/tableFilterActions";
import { connect } from "react-redux";
import { fetchEvents } from "../../../thunks/eventThunks";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";

/**
 * This component renders the presenters cells of events in the table view
 */
const EventsPresentersCell = ({
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
// @ts-expect-error TS(7006): Parameter 'presenter' implicitly has an 'any' type... Remove this comment to see the full error message
	const addFilter = async (presenter) => {
		let filter = filterMap.find(
// @ts-expect-error TS(7031): Binding element 'name' implicitly has an 'any' typ... Remove this comment to see the full error message
			({ name }) => name === "presentersBibliographic"
		);
		if (!!filter) {
			await editFilterValue(filter.name, presenter);
			await loadEvents();
			loadEventsIntoTable();
		}
	};

	return (
		// Link template for presenter of event
		// Repeat for each presenter
// @ts-expect-error TS(7006): Parameter 'presenter' implicitly has an 'any' type... Remove this comment to see the full error message
		row.presenters.map((presenter, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<button
				className="button-like-anchor metadata-entry"
				key={key}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
				title={t("EVENTS.EVENTS.TABLE.TOOLTIP.PRESENTER")}
				onClick={() => addFilter(presenter)}
			>
				{presenter}
			</button>
		))
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventsPresentersCell);
