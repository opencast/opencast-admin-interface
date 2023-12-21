import React, { useEffect, useState } from "react";
import MainNav from "../shared/MainNav";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import NewResourceModal from "../shared/NewResourceModal";
import DeleteSeriesModal from "./partials/modals/DeleteSeriesModal";
import { seriesTemplateMap } from "../../configs/tableConfigs/seriesTableMap";
import {
	fetchSeries,
	fetchSeriesMetadata,
	fetchSeriesThemes,
} from "../../thunks/seriesThunks";
import {
	loadEventsIntoTable,
	loadSeriesIntoTable,
} from "../../thunks/tableThunks";
import { fetchEvents } from "../../thunks/eventThunks";
import { fetchFilters, fetchStats } from "../../thunks/tableFilterThunks";
import { getTotalSeries, isShowActions } from "../../selectors/seriesSeletctor";
import { editTextFilter } from "../../actions/tableFilterActions";
import { setOffset } from "../../actions/tableActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
import Header from "../Header";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { showActions } from "../../actions/seriesActions";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { GlobalHotKeys } from "react-hotkeys";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";

// References for detecting a click outside of the container of the dropdown menu
const containerAction = React.createRef();

/**
 * This component renders the table view of series
 */
const Series = ({
// @ts-expect-error TS(7031): Binding element 'showActions' implicitly has an 'a... Remove this comment to see the full error message
	showActions,
// @ts-expect-error TS(7031): Binding element 'loadingSeries' implicitly has an ... Remove this comment to see the full error message
	loadingSeries,
// @ts-expect-error TS(7031): Binding element 'loadingSeriesIntoTable' implicitl... Remove this comment to see the full error message
	loadingSeriesIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingEvents' implicitly has an ... Remove this comment to see the full error message
	loadingEvents,
// @ts-expect-error TS(7031): Binding element 'loadingEventsIntoTable' implicitl... Remove this comment to see the full error message
	loadingEventsIntoTable,
// @ts-expect-error TS(7031): Binding element 'series' implicitly has an 'any' t... Remove this comment to see the full error message
	series,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'loadingStats' implicitly has an '... Remove this comment to see the full error message
	loadingStats,
// @ts-expect-error TS(7031): Binding element 'loadingSeriesMetadata' implicitly... Remove this comment to see the full error message
	loadingSeriesMetadata,
// @ts-expect-error TS(7031): Binding element 'loadingSeriesThemes' implicitly h... Remove this comment to see the full error message
	loadingSeriesThemes,
// @ts-expect-error TS(7031): Binding element 'resetTextFilter' implicitly has a... Remove this comment to see the full error message
	resetTextFilter,
// @ts-expect-error TS(7031): Binding element 'resetOffset' implicitly has an 'a... Remove this comment to see the full error message
	resetOffset,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'setShowActions' implicitly has an... Remove this comment to see the full error message
	setShowActions,
// @ts-expect-error TS(7031): Binding element 'currentFilterType' implicitly has... Remove this comment to see the full error message
	currentFilterType,
}) => {
	const { t } = useTranslation();
	const [displayActionMenu, setActionMenu] = useState(false);
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewSeriesModal, setNewSeriesModal] = useState(false);
	const [displayDeleteSeriesModal, setDeleteSeriesModal] = useState(false);

	let location = useLocation();

	const loadEvents = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching stats from server
		loadingStats();

		// Fetching events from server
		loadingEvents();

		// Load events into table
		loadingEventsIntoTable();
	};

	const loadSeries = async () => {
		//fetching series from server
		await loadingSeries();

		//load series into table
		loadingSeriesIntoTable();
	};

	useEffect(() => {
		if ("series" !== currentFilterType) {
			loadingFilters("series");
		}

		resetTextFilter();

		// disable actions button
		setShowActions(false);

		// Load events on mount
		loadSeries().then((r) => console.info(r));

		// Function for handling clicks outside of an dropdown menu
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

		// Fetch series every minute
		let fetchSeriesInterval = setInterval(loadSeries, 5000);

		// Event listener for handle a click outside of dropdown menu
		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
			clearInterval(fetchSeriesInterval);
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

	const showNewSeriesModal = async () => {
		await loadingSeriesMetadata();
		await loadingSeriesThemes();

		setNewSeriesModal(true);
	};

	const hideNewSeriesModal = () => {
		setNewSeriesModal(false);
	};

	const hideDeleteModal = () => {
		setDeleteSeriesModal(false);
	};

	const hotKeyHandlers = {
		NEW_SERIES: showNewSeriesModal,
	};

	return (
		<>
			<GlobalHotKeys
// @ts-expect-error TS(2769): No overload matches this call.
				keyMap={availableHotkeys.general}
				handlers={hotKeyHandlers}
			/>
			<Header />
			<section className="action-nav-bar">
				<div className="btn-group">
					{hasAccess("ROLE_UI_SERIES_CREATE", user) && (
						<button className="add" onClick={() => showNewSeriesModal()}>
							<i className="fa fa-plus" />
							<span>{t("EVENTS.EVENTS.ADD_SERIES")}</span>
						</button>
					)}
				</div>

				{/* Display modal for new series if add series button is clicked */}
				<NewResourceModal
					showModal={displayNewSeriesModal}
					handleClose={hideNewSeriesModal}
					resource={"series"}
				/>

				{displayDeleteSeriesModal && (
					<DeleteSeriesModal close={hideDeleteModal} />
				)}

				{/* Include Burger-button menu */}
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

				<nav>
					{hasAccess("ROLE_UI_EVENTS_VIEW", user) && (
						<Link
							to="/events/events"
							className={cn({ active: false })}
							onClick={() => loadEvents()}
						>
							{t("EVENTS.EVENTS.NAVIGATION.EVENTS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_SERIES_VIEW", user) && (
						<Link
							to="/events/series"
							className={cn({ active: true })}
							onClick={() => loadSeries()}
						>
							{t("EVENTS.EVENTS.NAVIGATION.SERIES")}
						</Link>
					)}
				</nav>
			</section>

			<div
				className="main-view"
				style={displayNavigation ? styleNavOpen : styleNavClosed}
			>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					<div className="filters-container">
						<div
							className={cn("drop-down-container", { disabled: !showActions })}
							onClick={(e) => handleActionMenu(e)}
// @ts-expect-error TS(2322): Type 'RefObject<unknown>' is not assignable to typ... Remove this comment to see the full error message
							ref={containerAction}
						>
							<span>{t("BULK_ACTIONS.CAPTION")}</span>
							{/* show dropdown if actions is clicked*/}
							{displayActionMenu && (
								<ul className="dropdown-ul">
									{hasAccess("ROLE_UI_SERIES_DELETE", user) && (
										<li>
											<button className="button-like-anchor" onClick={() => setDeleteSeriesModal(true)}>
												{t("BULK_ACTIONS.DELETE.SERIES.CAPTION")}
											</button>
										</li>
									)}
								</ul>
							)}
						</div>
						{/* Include filters component */}
						<TableFilters
							loadResource={loadingSeries}
							loadResourceIntoTable={loadingSeriesIntoTable}
							resource={"series"}
						/>
					</div>
					<h1>{t("EVENTS.SERIES.TABLE.CAPTION")}</h1>
					{/* Include table view */}
					<h4>{t("TABLE_SUMMARY", { numberOfRows: series })}</h4>
				</div>
				<Table templateMap={seriesTemplateMap} />
			</div>
			<Footer />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	series: getTotalSeries(state),
	showActions: isShowActions(state),
	user: getUserInformation(state),
	currentFilterType: getCurrentFilterResource(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingSeries: () => dispatch(fetchSeries()),
	loadingSeriesIntoTable: () => dispatch(loadSeriesIntoTable()),
	loadingEvents: () => dispatch(fetchEvents()),
	loadingEventsIntoTable: () => dispatch(loadEventsIntoTable()),
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	loadingStats: () => dispatch(fetchStats()),
	loadingSeriesMetadata: () => dispatch(fetchSeriesMetadata()),
	loadingSeriesThemes: () => dispatch(fetchSeriesThemes()),
	resetTextFilter: () => dispatch(editTextFilter("")),
	resetOffset: () => dispatch(setOffset(0)),
// @ts-expect-error TS(7006): Parameter 'isShowing' implicitly has an 'any' type... Remove this comment to see the full error message
	setShowActions: (isShowing) => dispatch(showActions(isShowing)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Series);
