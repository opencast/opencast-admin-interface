import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the presenters cells of events in the table view
 */
const EventsPresentersCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
// @ts-expect-error TS(7006): Parameter 'presenter' implicitly has an 'any' type... Remove this comment to see the full error message
	const addFilter = async (presenter) => {
		let filter = filterMap.find(
			({ name }) => name === "presentersBibliographic"
		);
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: presenter}));
			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
		}
	};

	return (
		// Link template for presenter of event
		// Repeat for each presenter
// @ts-expect-error TS(7006): Parameter 'presenter' implicitly has an 'any' type... Remove this comment to see the full error message
		row.presenters.map((presenter, key) => (
			<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.PRESENTER")} key={key}>
				<button
					className="button-like-anchor metadata-entry"
					onClick={() => addFilter(presenter)}
				>
					{presenter}
				</button>
			</Tooltip>
		))
	);
};

export default EventsPresentersCell;
