import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { Tooltip } from "../../shared/Tooltip";
import { Event } from "../../../slices/eventSlice";

/**
 * This component renders the presenters cells of events in the table view
 */
const EventsPresentersCell = ({
	row,
}: {
	row: Event
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
	const addFilter = async (presenter: string) => {
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
