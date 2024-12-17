import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EmbeddingCodeModal from "./modals/EmbeddingCodeModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import SeriesDetailsModal from "./modals/SeriesDetailsModal";
import { EventDetailsPage } from "./modals/EventDetails";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
	fetchSeriesDetailsAcls,
	fetchSeriesDetailsFeeds,
	fetchSeriesDetailsMetadata,
	fetchSeriesDetailsTheme,
	fetchSeriesDetailsThemeNames,
} from "../../../slices/seriesDetailsSlice";
import { Event, deleteEvent } from "../../../slices/eventSlice";
import { Tooltip } from "../../shared/Tooltip";
import { openModal } from "../../../slices/eventDetailsSlice";
import { ActionCellDelete } from "../../shared/ActionCellDelete";
import { IconButton } from "../../shared/IconButton";

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

	const [displaySeriesDetailsModal, setSeriesDetailsModal] = useState(false);
	const [displayEmbeddingCodeModal, setEmbeddingCodeModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const deletingEvent = (id: string) => {
		dispatch(deleteEvent(id));
	};

	const hideEmbeddingCodeModal = () => {
		setEmbeddingCodeModal(false);
	};

	const showEmbeddingCodeModal = () => {
		setEmbeddingCodeModal(true);
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
		dispatch(openModal(EventDetailsPage.Metadata, row));
	};

	const onClickComments = () => {
		dispatch(openModal(EventDetailsPage.Comments, row));
	};

	const onClickWorkflow = () => {
		dispatch(openModal(EventDetailsPage.Workflow, row));
	};

	const onClickAssets = () => {
		dispatch(openModal(EventDetailsPage.Assets, row));
	};

	return (
		<>
			{!!row.series && displaySeriesDetailsModal && (
				<SeriesDetailsModal
					handleClose={hideSeriesDetailsModal}
					seriesId={row.series.id}
					seriesTitle={row.series.title}
				/>
			)}

			{/* Open event details */}
			<IconButton
				callback={onClickEventDetails}
				iconClassname={"more"}
				editAccessRole={"ROLE_UI_EVENTS_DETAILS_VIEW"}
				tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.DETAILS"}
			/>

			{/* If event belongs to a series then the corresponding series details can be opened */}
			{!!row.series && (
				<IconButton
					callback={onClickSeriesDetails}
					iconClassname={"more-series"}
					editAccessRole={"ROLE_UI_SERIES_DETAILS_VIEW"}
					tooltipText={"EVENTS.SERIES.TABLE.TOOLTIP.DETAILS"}
				/>
			)}

			{/* Delete an event */}
			{/*TODO: needs to be checked if event is published */}
			<ActionCellDelete
				editAccessRole={"ROLE_UI_EVENTS_DELETE"}
				tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.DELETE"}
				resourceId={row.id}
				resourceName={row.title}
				resourceType={"EVENT"}
				deleteMethod={deletingEvent}
			/>

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
				<IconButton
					callback={() => onClickComments()}
					iconClassname={"comments"}
					tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.COMMENTS"}
				/>
			)}

			{/* If the event has comments and open comments then the comment tab of event details can be opened directly */}
			{row.has_comments && row.has_open_comments && (
				<IconButton
					callback={() => onClickComments()}
					iconClassname={"comments-open"}
					tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.COMMENTS"}
				/>
			)}

			{/*If the event is in in a paused workflow state then a warning icon is shown and workflow tab of event
				details can be opened directly */}
			{row.workflow_state === "PAUSED" &&
				<IconButton
					callback={() => onClickWorkflow()}
					iconClassname={"fa fa-warning"}
					editAccessRole={"ROLE_UI_EVENTS_DETAILS_WORKFLOWS_EDIT"}
					tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.PAUSED_WORKFLOW"}
				/>
			}

			{/* Open assets tab of event details directly*/}
			<IconButton
				callback={() => onClickAssets()}
				iconClassname={"fa fa-folder-open"}
				editAccessRole={"ROLE_UI_EVENTS_DETAILS_ASSETS_VIEW"}
				tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.ASSETS"}
			/>

			{/* Open dialog for embedded code*/}
			<IconButton
				callback={() => showEmbeddingCodeModal()}
				iconClassname={"fa fa-link"}
				editAccessRole={"ROLE_UI_EVENTS_EMBEDDING_CODE_VIEW"}
				tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.EMBEDDING_CODE"}
			/>

			{displayEmbeddingCodeModal && (
				<EmbeddingCodeModal close={hideEmbeddingCodeModal} eventId={row.id} />
			)}
		</>
	);
};

export default EventActionCell;
