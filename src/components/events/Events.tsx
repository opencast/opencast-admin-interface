import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useLocation } from "react-router";
import TableFilters from "../shared/TableFilters";
import Stats from "../shared/Stats";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import DeleteEventsModal from "./partials/modals/DeleteEventsModal";
import StartTaskModal from "./partials/modals/StartTaskModal";
import EditScheduledEventsModal from "./partials/modals/EditScheduledEventsModal";
import EditMetadataEventsModal from "./partials/modals/EditMetadataEventsModal";
import { eventsTemplateMap } from "../../configs/tableConfigs/eventsTableMap";
import {
	loadEventsIntoTable,
} from "../../thunks/tableThunks";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	getTotalEvents,
	isFetchingAssetUploadOptions as getIsFetchingAssetUploadOptions,
	isShowActions,
} from "../../selectors/eventSelectors";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { fetchAssetUploadOptions } from "../../thunks/assetsThunks";
import { useAppDispatch, useAppSelector } from "../../store";
import {
	fetchEventMetadata,
	fetchEvents,
	setShowActions,
} from "../../slices/eventSlice";
import EventDetailsModal from "./partials/modals/EventDetailsModal";
import { showModal } from "../../selectors/eventDetailsSelectors";
import { eventsLinks, loadEvents } from "./partials/EventsNavigation";
import { Modal, ModalHandle } from "../shared/modals/Modal";

// References for detecting a click outside of the container of the dropdown menu
const containerAction = React.createRef<HTMLDivElement>();

/**
 * This component renders the table view of events
 */
const Events = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const displayEventDetailsModal = useAppSelector(state => showModal(state));

	const [displayActionMenu, setActionMenu] = useState(false);
	const [displayNavigation, setNavigation] = useState(false);
	const newEventModalRef = useRef<ModalHandle>(null);
	const startTaskModalRef = useRef<ModalHandle>(null);
	const deleteModalRef = useRef<ModalHandle>(null);
	const editScheduledEventsModalRef = useRef<ModalHandle>(null);
	const editMetadataEventsModalRef = useRef<ModalHandle>(null);

	const user = useAppSelector(state => getUserInformation(state));
	const showActions = useAppSelector(state => isShowActions(state));
	const events = useAppSelector(state => getTotalEvents(state));
	const isFetchingAssetUploadOptions = useAppSelector(state => getIsFetchingAssetUploadOptions(state));

	let location = useLocation();

	useEffect(() => {
		dispatch(fetchFilters("events"))

		// Reset text filter
		dispatch(editTextFilter(""));

		// disable actions button
		dispatch(setShowActions(false));

		// Load events on mount
		loadEvents(dispatch);

		// Function for handling clicks outside of an open dropdown menu
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerAction.current &&
				!containerAction.current.contains(e.target as Node)
			) {
				setActionMenu(false);
			}
		};

		// Fetch events every five seconds
		let fetchEventsInterval = setInterval(() => loadEvents(dispatch), 5000);

		// Event listener for handle a click outside of dropdown menu
		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
			clearInterval(fetchEventsInterval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.hash]);

	const handleActionMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setActionMenu(!displayActionMenu);
	};

	const onNewEventModal = async () => {
		await dispatch(fetchEventMetadata());
		await dispatch(fetchAssetUploadOptions());

		newEventModalRef.current?.open();
	};

	const hideDeleteModal = () => {
		deleteModalRef.current?.close?.();
	};

	const hideStartTaskModal = () => {
		startTaskModalRef.current?.close?.();
	};

	const hideEditScheduledEventsModal = () => {
		editScheduledEventsModalRef.current?.close?.();
	};

	const hideEditMetadataEventsModal = () => {
		editMetadataEventsModalRef.current?.close?.();
	};

	return (
		<>
			<Header />
			<NavBar
				displayNavigation={displayNavigation}
				setNavigation={setNavigation}
				navAriaLabel={"EVENTS.EVENTS.NAVIGATION.LABEL"}
				links={
					eventsLinks
				}
				create={{
					accessRole: "ROLE_UI_EVENTS_CREATE",
					onShowModal: onNewEventModal,
					text: "EVENTS.EVENTS.ADD_EVENT",
					isDisplay: !isFetchingAssetUploadOptions,
					resource: "events",
					hotkeySequence: availableHotkeys.general.NEW_EVENT.sequence,
					hotkeyDescription: availableHotkeys.general.NEW_EVENT.description,
				}}
			>
				{/* Display bulk actions modal if one is chosen from dropdown */}
				<Modal
					header={t("BULK_ACTIONS.DELETE.EVENTS.CAPTION")}
					classId="delete-events-status-modal"
					ref={deleteModalRef}
				>
					<DeleteEventsModal close={hideDeleteModal} />
				</Modal>

				<Modal
					header={t("BULK_ACTIONS.SCHEDULE_TASK.CAPTION")}
					classId=""
					ref={startTaskModalRef}
				>
					<StartTaskModal close={hideStartTaskModal} />
				</Modal>

				<Modal
					header={t("BULK_ACTIONS.EDIT_EVENTS.CAPTION")}
					classId=""
					ref={editScheduledEventsModalRef}
				>
					<EditScheduledEventsModal close={hideEditScheduledEventsModal} />
				</Modal>

				<Modal
					header={t("BULK_ACTIONS.EDIT_EVENTS_METADATA.CAPTION")}
					classId=""
					ref={editMetadataEventsModalRef}
				>
					<EditMetadataEventsModal close={hideEditMetadataEventsModal} />
				</Modal>

				{/* Include status bar component*/}
				{hasAccess("ROLE_UI_EVENTS_COUNTERS_VIEW", user) && (
					<div className="stats-container">
						<Stats />
					</div>
				)}
			</NavBar>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications context={"other"}/>

				<div className="controls-container">
					<div className="filters-container">
						<div
							className={cn("drop-down-container", { disabled: !showActions })}
							onClick={(e) => handleActionMenu(e)}
							ref={containerAction}
						>
							<span>{t("BULK_ACTIONS.CAPTION")}</span>
							{/* show dropdown if actions is clicked*/}
							{displayActionMenu && (
								<ul className="dropdown-ul">
									{hasAccess("ROLE_UI_EVENTS_DELETE", user) && (
										<li>
											<button className="button-like-anchor" onClick={() => deleteModalRef.current?.open()}>
												{t("BULK_ACTIONS.DELETE.EVENTS.CAPTION")}
											</button>
										</li>
									)}
									{hasAccess("ROLE_UI_TASKS_CREATE", user) && (
										<li>
											<button className="button-like-anchor" onClick={() => startTaskModalRef.current?.open()}>
												{t("BULK_ACTIONS.SCHEDULE_TASK.CAPTION")}
											</button>
										</li>
									)}
									{hasAccess("ROLE_UI_EVENTS_DETAILS_SCHEDULING_EDIT", user) &&
										hasAccess("ROLE_UI_EVENTS_DETAILS_METADATA_EDIT", user) && (
											<li>
												<button className="button-like-anchor" onClick={() => editScheduledEventsModalRef.current?.open()}>
													{t("BULK_ACTIONS.EDIT_EVENTS.CAPTION")}
												</button>
											</li>
										)}
									{hasAccess("ROLE_UI_EVENTS_DETAILS_METADATA_EDIT", user) && (
										<li>
											<button className="button-like-anchor" onClick={() => editMetadataEventsModalRef.current?.open()}>
												{t("BULK_ACTIONS.EDIT_EVENTS_METADATA.CAPTION")}
											</button>
										</li>
									)}
								</ul>
							)}
						</div>

						{/* Include filters component*/}
						<TableFilters
							loadResource={fetchEvents}
							loadResourceIntoTable={loadEventsIntoTable}
							resource={"events"}
						/>
					</div>
					<h1>{t("EVENTS.EVENTS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: events })}</h4>
				</div>

				{/*Include table modal*/}
				{displayEventDetailsModal &&
					<EventDetailsModal />
				}

				{/*Include table component*/}
				{/* <Table templateMap={eventsTemplateMap} resourceType="events" /> */}
				<Table templateMap={eventsTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Events;
