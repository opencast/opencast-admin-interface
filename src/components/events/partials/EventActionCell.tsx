import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import EventDetailsModal from "./modals/EventDetailsModal";
import EmbeddingCodeModal from "./modals/EmbeddingCodeModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import SeriesDetailsModal from "./modals/SeriesDetailsModal";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
	fetchSeriesDetailsThemeNames,
	fetchSeriesDetailsAcls,
	fetchSeriesDetailsFeeds,
	fetchSeriesDetailsMetadata,
	fetchSeriesDetailsTheme,
} from "../../../slices/seriesDetailsSlice";
import { Event, deleteEvent } from "../../../slices/eventSlice";
import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the action cells of events in the table view
 */
const EventActionCell = ({
	row,
}: {
	row: Event
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayEventDetailsModal, setEventDetailsModal] = useState(false);
	const [displaySeriesDetailsModal, setSeriesDetailsModal] = useState(false);
	const [eventDetailsTabIndex, setEventDetailsTabIndex] = useState(0);
	const [displayEmbeddingCodeModal, setEmbeddingCodeModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingEvent = (id) => {
		dispatch(deleteEvent(id));
	};

	const hideEmbeddingCodeModal = () => {
		setEmbeddingCodeModal(false);
	};

	const showEmbeddingCodeModal = () => {
		setEmbeddingCodeModal(true);
	};

	const showEventDetailsModal = () => {
		setEventDetailsModal(true);
	};

	const hideEventDetailsModal = () => {
		setEventDetailsModal(false);
	};

	const showSeriesDetailsModal = () => {
		setSeriesDetailsModal(true);
	};

	const hideSeriesDetailsModal = () => {
		setSeriesDetailsModal(false);
	};

	const onClickSeriesDetails = async () => {
		if (!!row.series) {
			await dispatch(fetchSeriesDetailsMetadata(row.series.id));
			await dispatch(fetchSeriesDetailsAcls(row.series.id));
			await dispatch(fetchSeriesDetailsFeeds(row.series.id));
			await dispatch(fetchSeriesDetailsTheme(row.series.id));
			await dispatch(fetchSeriesDetailsThemeNames());

			showSeriesDetailsModal();
		}
	};

	const onClickEventDetails = () => {
		setEventDetailsTabIndex(0);
		showEventDetailsModal();
	};

	const onClickComments = () => {
		setEventDetailsTabIndex(7);
		showEventDetailsModal();
	};

	const onClickWorkflow = () => {
		setEventDetailsTabIndex(5);
		showEventDetailsModal();
	};

	const onClickAssets = () => {
		setEventDetailsTabIndex(3);
		showEventDetailsModal();
	};

	return (
		<>
			{/* Display modal for editing table view if table edit button is clicked */}
			{displayEventDetailsModal &&
				<EventDetailsModal
					handleClose={hideEventDetailsModal}
					tabIndex={eventDetailsTabIndex}
					eventTitle={row.title}
					eventId={row.id}
				/>
			}

			{!!row.series && displaySeriesDetailsModal && (
				<SeriesDetailsModal
					handleClose={hideSeriesDetailsModal}
					seriesId={row.series.id}
					seriesTitle={row.series.title}
				/>
			)}

			{/* Open event details */}
			{hasAccess("ROLE_UI_EVENTS_DETAILS_VIEW", user) && (
				<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => onClickEventDetails()}
						className="button-like-anchor more"
					/>
				</Tooltip>
			)}

			{/* If event belongs to a series then the corresponding series details can be opened */}
			{!!row.series && hasAccess("ROLE_UI_SERIES_DETAILS_VIEW", user) && (
				<Tooltip title={t("EVENTS.SERIES.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => onClickSeriesDetails()}
						className="button-like-anchor more-series"
					/>
				</Tooltip>
			)}

			{/* Delete an event */}
			{/*TODO: needs to be checked if event is published */}
			{hasAccess("ROLE_UI_EVENTS_DELETE", user) && (
				<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.DELETE")}>
					<button
						onClick={() => setDeleteConfirmation(true)}
						className="button-like-anchor remove"
					/>
				</Tooltip>
			)}

			{/* Confirmation for deleting an event*/}
			{displayDeleteConfirmation && (
				<ConfirmModal
					close={hideDeleteConfirmation}
					resourceName={row.title}
					resourceType="EVENT"
					resourceId={row.id}
					deleteMethod={deletingEvent}
				/>
			)}

			{/* If the event has an preview then the editor can be opened and status if it needs to be cut is shown */}
			{!!row.has_preview && hasAccess("ROLE_UI_EVENTS_EDITOR_VIEW", user) && (
				<Tooltip
					title={
						row.needs_cutting
							? t("EVENTS.EVENTS.TABLE.TOOLTIP.EDITOR_NEEDS_CUTTING")
							: t("EVENTS.EVENTS.TABLE.TOOLTIP.EDITOR")
					}
				>
					<a
						href={`/editor-ui/index.html?id=${row.id}`}
						className="cut"
						target="_blank" rel="noreferrer"
					>
						{row.needs_cutting && <span id="badge" className="badge" />}
					</a>
				</Tooltip>
			)}

			{/* If the event has comments and no open comments then the comment tab of event details can be opened directly */}
			{row.has_comments && !row.has_open_comments && (
				<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.COMMENTS")}>
					<button
						onClick={() => onClickComments()}
						className="button-like-anchor comments"
					/>
				</Tooltip>
			)}

			{/* If the event has comments and open comments then the comment tab of event details can be opened directly */}
			{row.has_comments && row.has_open_comments && (
				<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.COMMENTS")}>
					<button
						onClick={() => onClickComments()}
						className="button-like-anchor comments-open"
					/>
				</Tooltip>
			)}

			{/*If the event is in in a paused workflow state then a warning icon is shown and workflow tab of event
                details can be opened directly */}
			{row.workflow_state === "PAUSED" &&
				hasAccess("ROLE_UI_EVENTS_DETAILS_WORKFLOWS_EDIT", user) && (
					<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.PAUSED_WORKFLOW")}>
						<button
							onClick={() => onClickWorkflow()}
							className="button-like-anchor fa fa-warning"
						/>
					</Tooltip>
				)}

			{/* Open assets tab of event details directly*/}
			{hasAccess("ROLE_UI_EVENTS_DETAILS_ASSETS_VIEW", user) && (
				<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.ASSETS")}>
					<button
						onClick={() => onClickAssets()}
						className="button-like-anchor fa fa-folder-open"
					/>
				</Tooltip>
			)}
			{/* Open dialog for embedded code*/}
			{hasAccess("ROLE_UI_EVENTS_EMBEDDING_CODE_VIEW", user) && (
				<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.EMBEDDING_CODE")}>
					<button
						onClick={() => showEmbeddingCodeModal()}
						className="button-like-anchor fa fa-link"
					/>
				</Tooltip>
			)}

			{displayEmbeddingCodeModal && (
				<EmbeddingCodeModal close={hideEmbeddingCodeModal} eventId={row.id} />
			)}
		</>
	);
};

export default EventActionCell;
