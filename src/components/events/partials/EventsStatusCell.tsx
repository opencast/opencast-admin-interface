import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { connect } from "react-redux";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the status cells of events in the table view
 */
const EventsStatusCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'loadEventsIntoTable' implicitly h... Remove this comment to see the full error message
	loadEventsIntoTable,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
// @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
	const addFilter = async (status) => {
		let filter = filterMap.find(({ name }) => name === "status");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: status}));
			await dispatch(fetchEvents());
			loadEventsIntoTable();
		}
	};

	return (
		<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.STATUS")}>
			<button
				className="button-like-anchor crosslink"
				onClick={() => addFilter(row.event_status)}
			>
				{t(row.displayable_status)}
			</button>
		</Tooltip>
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

export default connect(mapStateToProps, mapDispatchToProps)(EventsStatusCell);
