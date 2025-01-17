import React, { useState } from "react";
import ConfirmModal from "../../shared/ConfirmModal";
import SeriesDetailsModal from "./modals/SeriesDetailsModal";
import {
	fetchSeriesDetailsThemeNames,
	fetchSeriesDetailsAcls,
	fetchSeriesDetailsFeeds,
	fetchSeriesDetailsMetadata,
	fetchSeriesDetailsTheme,
	fetchSeriesDetailsTobira,
} from "../../../slices/seriesDetailsSlice";
import {
	getSeriesHasEvents,
	isSeriesDeleteAllowed,
} from "../../../selectors/seriesSeletctor";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
	Series,
	checkForEventsDeleteSeriesModal,
	deleteSeries,
} from "../../../slices/seriesSlice";
import { IconButton } from "../../shared/IconButton";

/**
 * This component renders the action cells of series in the table view
 */
const SeriesActionsCell = ({
	row,
}: {
	row: Series
}) => {
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displaySeriesDetailsModal, setSeriesDetailsModal] = useState(false);

	const hasEvents = useAppSelector(state => getSeriesHasEvents(state));
	const deleteAllowed = useAppSelector(state => isSeriesDeleteAllowed(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

	const showDeleteConfirmation = async () => {
		await dispatch(checkForEventsDeleteSeriesModal(row.id));

		setDeleteConfirmation(true);
	};

	const deletingSeries = (id: string) => {
		dispatch(deleteSeries(id));
	};

	const hideSeriesDetailsModal = () => {
		setSeriesDetailsModal(false);
	};

	const showSeriesDetailsModal = async () => {
		await dispatch(fetchSeriesDetailsMetadata(row.id));
		await dispatch(fetchSeriesDetailsAcls(row.id));
		await dispatch(fetchSeriesDetailsFeeds(row.id));
		await dispatch(fetchSeriesDetailsTheme(row.id));
		await dispatch(fetchSeriesDetailsThemeNames());
		await dispatch(fetchSeriesDetailsTobira(row.id));

		setSeriesDetailsModal(true);
	};

	return (
		<>
			{/* series details */}
			<IconButton
				callback={() => showSeriesDetailsModal()}
				iconClassname={"more-series"}
				editAccessRole={"ROLE_UI_SERIES_DETAILS_VIEW"}
				tooltipText={"EVENTS.SERIES.TABLE.TOOLTIP.DETAILS"}
			/>
			{displaySeriesDetailsModal && (
				<SeriesDetailsModal
					handleClose={hideSeriesDetailsModal}
					seriesId={row.id}
					seriesTitle={row.title}
				/>
			)}

			{/* delete series */}
			<IconButton
				callback={() => showDeleteConfirmation()}
				iconClassname={"remove"}
				editAccessRole={"ROLE_UI_SERIES_DELETE"}
				tooltipText={"EVENTS.SERIES.TABLE.TOOLTIP.DELETE"}
			/>
			{displayDeleteConfirmation && (
				<ConfirmModal
					close={hideDeleteConfirmation}
					resourceName={row.title}
					resourceType="SERIES"
					resourceId={row.id}
					deleteMethod={deletingSeries}
					deleteAllowed={deleteAllowed}
					showCautionMessage={hasEvents}
					deleteNotAllowedMessage={
						"CONFIRMATIONS.ERRORS.SERIES_HAS_EVENTS"
					} /* The highlighted series cannot be deleted as they still contain events */
					deleteWithCautionMessage={
						"CONFIRMATIONS.WARNINGS.SERIES_HAS_EVENTS"
					} /* This series does contain events. Deleting the series will not delete the events. */
				/>
			)}
		</>
	);
};

export default SeriesActionsCell;
