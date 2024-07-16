import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import SeriesDetailsModal from "./modals/SeriesDetailsModal";
import {
	fetchSeriesDetailsThemeNames,
	fetchSeriesDetailsAcls,
	fetchSeriesDetailsFeeds,
	fetchSeriesDetailsMetadata,
	fetchSeriesDetailsTheme,
} from "../../../slices/seriesDetailsSlice";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
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

import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the action cells of series in the table view
 */
const SeriesActionsCell = ({
	row,
}: {
	row: Series
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displaySeriesDetailsModal, setSeriesDetailsModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const hasEvents = useAppSelector(state => getSeriesHasEvents(state));
	const deleteAllowed = useAppSelector(state => isSeriesDeleteAllowed(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

	const showDeleteConfirmation = async () => {
		await dispatch(checkForEventsDeleteSeriesModal(row.id));

		setDeleteConfirmation(true);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingSeries = (id) => {
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

		setSeriesDetailsModal(true);
	};

	return (
		<>
			{/* series details */}
			{hasAccess("ROLE_UI_SERIES_DETAILS_VIEW", user) && (
				<Tooltip title={t("EVENTS.SERIES.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => showSeriesDetailsModal()}
						className="button-like-anchor more-series"
					/>
				</Tooltip>
			)}

			{displaySeriesDetailsModal && (
				<SeriesDetailsModal
					handleClose={hideSeriesDetailsModal}
					seriesId={row.id}
					seriesTitle={row.title}
				/>
			)}

			{/* delete series */}
			{hasAccess("ROLE_UI_SERIES_DELETE", user) && (
				<Tooltip title={t("EVENTS.SERIES.TABLE.TOOLTIP.DELETE")}>
					<button
						onClick={() => showDeleteConfirmation()}
						className="button-like-anchor remove"

					/>
				</Tooltip>
			)}

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
