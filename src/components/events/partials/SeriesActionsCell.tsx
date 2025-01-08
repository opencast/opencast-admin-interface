import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
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
import { ModalHandle } from "../../shared/modals/Modal";

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

	const deleteConfirmationModalRef = useRef<ModalHandle>(null);
	const detailsModalRef = useRef<ModalHandle>(null);

	const user = useAppSelector(state => getUserInformation(state));
	const hasEvents = useAppSelector(state => getSeriesHasEvents(state));
	const deleteAllowed = useAppSelector(state => isSeriesDeleteAllowed(state));

	const hideDeleteConfirmation = () => {
		deleteConfirmationModalRef.current?.close?.();
	};

	const showDeleteConfirmation = async () => {
		await dispatch(checkForEventsDeleteSeriesModal(row.id));

		deleteConfirmationModalRef.current?.open();
	};

	const deletingSeries = (id: string) => {
		dispatch(deleteSeries(id));
	};

	const showSeriesDetailsModal = async () => {
		await dispatch(fetchSeriesDetailsMetadata(row.id));
		await dispatch(fetchSeriesDetailsAcls(row.id));
		await dispatch(fetchSeriesDetailsFeeds(row.id));
		await dispatch(fetchSeriesDetailsTheme(row.id));
		await dispatch(fetchSeriesDetailsThemeNames());
		await dispatch(fetchSeriesDetailsTobira(row.id));

		detailsModalRef.current?.open();
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

			<SeriesDetailsModal
				seriesId={row.id}
				seriesTitle={row.title}
				modalRef={detailsModalRef}
			/>

			{/* delete series */}
			{hasAccess("ROLE_UI_SERIES_DELETE", user) && (
				<Tooltip title={t("EVENTS.SERIES.TABLE.TOOLTIP.DELETE")}>
					<button
						onClick={() => showDeleteConfirmation()}
						className="button-like-anchor remove"

					/>
				</Tooltip>
			)}

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
				modalRef={deleteConfirmationModalRef}
			/>
		</>
	);
};

export default SeriesActionsCell;
