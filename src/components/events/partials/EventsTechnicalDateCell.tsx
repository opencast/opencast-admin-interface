import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { connect } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { renderValidDate } from "../../../utils/dateUtils";
import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the technical date cells of events in the table view
 */
const EventsTechnicalDateCell = ({
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
		let filter = filterMap.find(({ name }) => name === "technicalStart");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: date + "/" + date}));
			await dispatch(fetchEvents());
			loadEventsIntoTable();
		}
	};

	return (
		// Link template for technical date of event
		<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.START")}>
			<button
				className="button-like-anchor crosslink"
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
				onClick={() => addFilter()}
			>
				{t("dateFormats.date.short", { date: renderValidDate(row.technical_start) })}
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventsTechnicalDateCell);
