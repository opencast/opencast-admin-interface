import React from "react";
import { useTranslation } from "react-i18next";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { connect } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";

/**
 * This component renders the start date cells of events in the table view
 */
const EventsDateCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'loadEventsIntoTable' implicitly h... Remove this comment to see the full error message
	loadEventsIntoTable,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
// @ts-expect-error TS(7006): Parameter 'date' implicitly has an 'any' type.
	const addFilter = async (date) => {
		let filter = filterMap.find(({ name }) => name === "startDate");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: date + "/" + date}));
			await dispatch(fetchEvents());
			loadEventsIntoTable();
		}
	};

	return (
		// Link template for start date of event
		<button
			className="button-like-anchor crosslink"
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
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadEventsIntoTable: () => dispatch(loadEventsIntoTable()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsDateCell);
