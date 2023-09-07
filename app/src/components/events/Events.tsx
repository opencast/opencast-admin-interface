import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
// @ts-expect-error TS(6142): Module '../shared/TableFilters' was resolved to '/... Remove this comment to see the full error message
import TableFilters from "../shared/TableFilters";
// @ts-expect-error TS(6142): Module '../shared/MainNav' was resolved to '/home/... Remove this comment to see the full error message
import MainNav from "../shared/MainNav";
// @ts-expect-error TS(6142): Module '../shared/Stats' was resolved to '/home/ar... Remove this comment to see the full error message
import Stats from "../shared/Stats";
// @ts-expect-error TS(6142): Module '../shared/Table' was resolved to '/home/ar... Remove this comment to see the full error message
import Table from "../shared/Table";
// @ts-expect-error TS(6142): Module '../shared/Notifications' was resolved to '... Remove this comment to see the full error message
import Notifications from "../shared/Notifications";
// @ts-expect-error TS(6142): Module '../shared/NewResourceModal' was resolved t... Remove this comment to see the full error message
import NewResourceModal from "../shared/NewResourceModal";
// @ts-expect-error TS(6142): Module './partials/modals/DeleteEventsModal' was r... Remove this comment to see the full error message
import DeleteEventsModal from "./partials/modals/DeleteEventsModal";
// @ts-expect-error TS(6142): Module './partials/modals/StartTaskModal' was reso... Remove this comment to see the full error message
import StartTaskModal from "./partials/modals/StartTaskModal";
// @ts-expect-error TS(6142): Module './partials/modals/EditScheduledEventsModal... Remove this comment to see the full error message
import EditScheduledEventsModal from "./partials/modals/EditScheduledEventsModal";
// @ts-expect-error TS(6142): Module './partials/modals/EditMetadataEventsModal'... Remove this comment to see the full error message
import EditMetadataEventsModal from "./partials/modals/EditMetadataEventsModal";
import { eventsTemplateMap } from "../../configs/tableConfigs/eventsTableConfig";
import { fetchEventMetadata, fetchEvents } from "../../thunks/eventThunks";
import {
	loadEventsIntoTable,
	loadSeriesIntoTable,
} from "../../thunks/tableThunks";
import { fetchSeries } from "../../thunks/seriesThunks";
import { fetchFilters, fetchStats } from "../../thunks/tableFilterThunks";
import {
	getTotalEvents,
	isFetchingAssetUploadOptions,
	isLoading,
	isShowActions,
} from "../../selectors/eventSelectors";
import { editTextFilter } from "../../actions/tableFilterActions";
import { setOffset } from "../../actions/tableActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
// @ts-expect-error TS(6142): Module '../Header' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Header from "../Header";
// @ts-expect-error TS(6142): Module '../Footer' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { showActions } from "../../actions/eventActions";
import { GlobalHotKeys } from "react-hotkeys";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { fetchAssetUploadOptions } from "../../thunks/assetsThunks";

// References for detecting a click outside of the container of the dropdown menu
const containerAction = React.createRef();

/**
 * This component renders the table view of events
 */
const Events = ({
// @ts-expect-error TS(7031): Binding element 'loadingEvents' implicitly has an ... Remove this comment to see the full error message
	loadingEvents,
// @ts-expect-error TS(7031): Binding element 'loadingEventsIntoTable' implicitl... Remove this comment to see the full error message
	loadingEventsIntoTable,
// @ts-expect-error TS(7031): Binding element 'events' implicitly has an 'any' t... Remove this comment to see the full error message
	events,
// @ts-expect-error TS(7031): Binding element 'showActions' implicitly has an 'a... Remove this comment to see the full error message
	showActions,
// @ts-expect-error TS(7031): Binding element 'loadingSeries' implicitly has an ... Remove this comment to see the full error message
	loadingSeries,
// @ts-expect-error TS(7031): Binding element 'loadingSeriesIntoTable' implicitl... Remove this comment to see the full error message
	loadingSeriesIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'loadingStats' implicitly has an '... Remove this comment to see the full error message
	loadingStats,
// @ts-expect-error TS(7031): Binding element 'loadingEventMetadata' implicitly ... Remove this comment to see the full error message
	loadingEventMetadata,
// @ts-expect-error TS(7031): Binding element 'resetTextFilter' implicitly has a... Remove this comment to see the full error message
	resetTextFilter,
// @ts-expect-error TS(7031): Binding element 'fetchAssetUploadOptions' implicit... Remove this comment to see the full error message
	fetchAssetUploadOptions,
// @ts-expect-error TS(7031): Binding element 'resetOffset' implicitly has an 'a... Remove this comment to see the full error message
	resetOffset,
// @ts-expect-error TS(7031): Binding element 'setShowActions' implicitly has an... Remove this comment to see the full error message
	setShowActions,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'isFetchingAssetUploadOptions' imp... Remove this comment to see the full error message
	isFetchingAssetUploadOptions,
// @ts-expect-error TS(7031): Binding element 'currentFilterType' implicitly has... Remove this comment to see the full error message
	currentFilterType,
}) => {
	const { t } = useTranslation();
	const [displayActionMenu, setActionMenu] = useState(false);
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewEventModal, setNewEventModal] = useState(false);
	const [displayDeleteModal, setDeleteModal] = useState(false);
	const [displayStartTaskModal, setStartTaskModal] = useState(false);
	const [
		displayEditScheduledEventsModal,
		setEditScheduledEventsModal,
	] = useState(false);
	const [displayEditMetadataEventsModal, setEditMetadataEventsModal] = useState(
		false
	);

	let location = useLocation();

	const loadEvents = async () => {
		// Fetching stats from server
		loadingStats();

		// Fetching events from server
		await loadingEvents();

		// Load events into table
		loadingEventsIntoTable();
	};

	const loadSeries = () => {
		// Reset the current page to first page
		resetOffset();

		//fetching series from server
		loadingSeries();

		//load series into table
		loadingSeriesIntoTable();
	};

	useEffect(() => {
		if ("events" !== currentFilterType) {
			loadingFilters("events");
		}

		resetTextFilter();

		// disable actions button
		setShowActions(false);

		// Load events on mount
		loadEvents().then((r) => console.info(r));

		// Function for handling clicks outside of an open dropdown menu
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
		const handleClickOutside = (e) => {
			if (
				containerAction.current &&
// @ts-expect-error TS(2571): Object is of type 'unknown'.
				!containerAction.current.contains(e.target)
			) {
				setActionMenu(false);
			}
		};

		// Fetch events every minute
		let fetchEventsInterval = setInterval(loadEvents, 5000);

		// Event listener for handle a click outside of dropdown menu
		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
			clearInterval(fetchEventsInterval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.hash]);

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const handleActionMenu = (e) => {
		e.preventDefault();
		setActionMenu(!displayActionMenu);
	};

	const showNewEventModal = async () => {
		await loadingEventMetadata();
		await fetchAssetUploadOptions();

		setNewEventModal(true);
	};

	const hideNewEventModal = () => {
		setNewEventModal(false);
	};

	const hideDeleteModal = () => {
		setDeleteModal(false);
	};

	const hideStartTaskModal = () => {
		setStartTaskModal(false);
	};

	const hideEditScheduledEventsModal = () => {
		setEditScheduledEventsModal(false);
	};

	const hideEditMetadataEventsModal = () => {
		setEditMetadataEventsModal(false);
	};

	const hotKeyHandlers = {
		NEW_EVENT: showNewEventModal,
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<GlobalHotKeys
// @ts-expect-error TS(2769): No overload matches this call.
				keyMap={availableHotkeys.general}
				handlers={hotKeyHandlers}
			/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Header />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section className="action-nav-bar">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="btn-group">
					{hasAccess("ROLE_UI_EVENTS_CREATE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<button className="add" onClick={() => showNewEventModal()}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<i className="fa fa-plus" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span>{t("EVENTS.EVENTS.ADD_EVENT")}</span>
						</button>
					)}
				</div>

				{
					/* Display modal for new event if add event button is clicked */
					!isFetchingAssetUploadOptions && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<NewResourceModal
							showModal={displayNewEventModal}
							handleClose={hideNewEventModal}
							resource={"events"}
						/>
					)
				}

				{/* Display bulk actions modal if one is chosen from dropdown */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				{displayDeleteModal && <DeleteEventsModal close={hideDeleteModal} />}

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				{displayStartTaskModal && <StartTaskModal close={hideStartTaskModal} />}

				{displayEditScheduledEventsModal && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<EditScheduledEventsModal close={hideEditScheduledEventsModal} />
				)}

				{displayEditMetadataEventsModal && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<EditMetadataEventsModal close={hideEditMetadataEventsModal} />
				)}

				{/* Include Burger-button menu */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<nav>
					{hasAccess("ROLE_UI_EVENTS_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/events/events"
							className={cn({ active: true })}
							onClick={() => loadEvents()}
						>
							{t("EVENTS.EVENTS.NAVIGATION.EVENTS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_SERIES_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/events/series"
							className={cn({ active: false })}
							onClick={() => loadSeries()}
						>
							{t("EVENTS.EVENTS.NAVIGATION.SERIES")}
						</Link>
					)}
				</nav>

				{/* Include status bar component*/}
				{hasAccess("ROLE_UI_EVENTS_COUNTERS_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="stats-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Stats />
					</div>
				)}
			</section>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div
				className="main-view"
				style={displayNavigation ? styleNavOpen : styleNavClosed}
			>
				{/* Include notifications component */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="controls-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="filters-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div
							className={cn("drop-down-container", { disabled: !showActions })}
							onClick={(e) => handleActionMenu(e)}
// @ts-expect-error TS(2322): Type 'RefObject<unknown>' is not assignable to typ... Remove this comment to see the full error message
							ref={containerAction}
						>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span>{t("BULK_ACTIONS.CAPTION")}</span>
							{/* show dropdown if actions is clicked*/}
							{displayActionMenu && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<ul className="dropdown-ul">
									{hasAccess("ROLE_UI_EVENTS_DELETE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<button className="button-like-anchor" onClick={() => setDeleteModal(true)}>
												{t("BULK_ACTIONS.DELETE.EVENTS.CAPTION")}
											</button>
										</li>
									)}
									{hasAccess("ROLE_UI_TASKS_CREATE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<button className="button-like-anchor" onClick={() => setStartTaskModal(true)}>
												{t("BULK_ACTIONS.SCHEDULE_TASK.CAPTION")}
											</button>
										</li>
									)}
									{hasAccess("ROLE_UI_EVENTS_DETAILS_SCHEDULING_EDIT", user) &&
										hasAccess("ROLE_UI_EVENTS_DETAILS_METADATA_EDIT", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<button className="button-like-anchor" onClick={() => setEditScheduledEventsModal(true)}>
													{t("BULK_ACTIONS.EDIT_EVENTS.CAPTION")}
												</button>
											</li>
										)}
									{hasAccess("ROLE_UI_EVENTS_DETAILS_METADATA_EDIT", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<button className="button-like-anchor" onClick={() => setEditMetadataEventsModal(true)}>
												{t("BULK_ACTIONS.EDIT_EVENTS_METADATA.CAPTION")}
											</button>
										</li>
									)}
								</ul>
							)}
						</div>

						{/* Include filters component*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<TableFilters
							loadResource={loadingEvents}
							loadResourceIntoTable={loadingEventsIntoTable}
							resource={"events"}
						/>
					</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h1>{t("EVENTS.EVENTS.TABLE.CAPTION")}</h1>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h4>{t("TABLE_SUMMARY", { numberOfRows: events })}</h4>
				</div>
				{/*Include table component*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Table templateMap={eventsTemplateMap} resourceType="events" />
			</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Footer />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	events: getTotalEvents(state),
	showActions: isShowActions(state),
	user: getUserInformation(state),
	currentFilterType: getCurrentFilterResource(state),
	isLoadingEvents: isLoading(state),
	isFetchingAssetUploadOptions: isFetchingAssetUploadOptions(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingEvents: () => dispatch(fetchEvents()),
	loadingEventsIntoTable: () => dispatch(loadEventsIntoTable()),
	loadingSeries: () => dispatch(fetchSeries()),
	loadingSeriesIntoTable: () => dispatch(loadSeriesIntoTable()),
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	loadingStats: () => dispatch(fetchStats()),
	loadingEventMetadata: () => dispatch(fetchEventMetadata()),
	resetTextFilter: () => dispatch(editTextFilter("")),
	resetOffset: () => dispatch(setOffset(0)),
// @ts-expect-error TS(7006): Parameter 'isShowing' implicitly has an 'any' type... Remove this comment to see the full error message
	setShowActions: (isShowing) => dispatch(showActions(isShowing)),
	fetchAssetUploadOptions: () => dispatch(fetchAssetUploadOptions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);
