import React, { useEffect, useState } from "react";
import MainNav from "../shared/MainNav";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Link, useLocation } from "react-router-dom";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import NewResourceModal from "../shared/NewResourceModal";
import DeleteSeriesModal from "./partials/modals/DeleteSeriesModal";
import { seriesTemplateMap } from "../../configs/tableConfigs/seriesTableMap";
import {
	loadEventsIntoTable,
	loadSeriesIntoTable,
} from "../../thunks/tableThunks";
import { fetchFilters, fetchStats, editTextFilter } from "../../slices/tableFilterSlice";
import { getTotalSeries, isShowActions } from "../../selectors/seriesSeletctor";
import { setOffset } from "../../slices/tableSlice";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useHotkeys } from "react-hotkeys-hook";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchEvents } from "../../slices/eventSlice";
import {
	fetchSeries,
	fetchSeriesMetadata,
	fetchSeriesThemes,
	showActionsSeries,
} from "../../slices/seriesSlice";
import { fetchSeriesDetailsTobiraNew } from "../../slices/seriesSlice";
import { ShowSeriesDetailsModal } from "./partials/modals/ShowSeriesDetailsModal";

// References for detecting a click outside of the container of the dropdown menu
const containerAction = React.createRef<HTMLDivElement>();

/**
 * This component renders the table view of series
 */
const Series = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayActionMenu, setActionMenu] = useState(false);
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewSeriesModal, setNewSeriesModal] = useState(false);
	const [displayDeleteSeriesModal, setDeleteSeriesModal] = useState(false);

  const user = useAppSelector(state => getUserInformation(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	let location = useLocation();

	const series = useAppSelector(state => getTotalSeries(state));
	const showActions = useAppSelector(state => isShowActions(state));

	const loadEvents = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching stats from server
		dispatch(fetchStats());

		// Fetching events from server
		dispatch(fetchEvents());

		// Load events into table
		dispatch(loadEventsIntoTable());
	};

	const loadSeries = async () => {
		//fetching series from server
		await dispatch(fetchSeries());

		//load series into table
		dispatch(loadSeriesIntoTable());
	};

	useEffect(() => {
		if ("series" !== currentFilterType) {
			dispatch(fetchFilters("series"))
		}

		// Reset text filer
		dispatch(editTextFilter(""));

		// disable actions button
		dispatch(showActionsSeries(false));

		// Load events on mount
		loadSeries().then((r) => console.info(r));

		// Function for handling clicks outside of an dropdown menu
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerAction.current &&
				!containerAction.current.contains(e.target as Node)
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

	const handleActionMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setActionMenu(!displayActionMenu);
	};

	const showNewSeriesModal = async () => {
		await dispatch(fetchSeriesMetadata());
		await dispatch(fetchSeriesThemes());
		await dispatch(fetchSeriesDetailsTobiraNew("/"));

		setNewSeriesModal(true);
	};

	const hideNewSeriesModal = () => {
		setNewSeriesModal(false);
	};

	const hideDeleteModal = () => {
		setDeleteSeriesModal(false);
	};

	useHotkeys(
    availableHotkeys.general.NEW_SERIES.sequence,
    () => showNewSeriesModal(),
		{ description: t(availableHotkeys.general.NEW_SERIES.description) ?? undefined },
    [showNewSeriesModal]
  );

	return (
		<>
			<Header />
			<NavBar>
				{/* Display modal for new series if add series button is clicked */}
				{ displayNewSeriesModal &&
					<NewResourceModal
						handleClose={hideNewSeriesModal}
						resource={"series"}
					/>
				}

				{displayDeleteSeriesModal && (
					<DeleteSeriesModal close={hideDeleteModal} />
				)}

				{/* Include Burger-button menu */}
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

				<nav aria-label={t("EVENTS.EVENTS.NAVIGATION.LABEL")}>
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
				
				<div className="btn-group">
					{hasAccess("ROLE_UI_SERIES_CREATE", user) && (
						<button className="add" onClick={() => showNewSeriesModal()}>
							<i className="fa fa-plus" />
							<span>{t("EVENTS.EVENTS.ADD_SERIES")}</span>
						</button>
					)}
				</div>
			</NavBar>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications />

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
							loadResource={fetchSeries}
							loadResourceIntoTable={loadSeriesIntoTable}
							resource={"series"}
						/>
					</div>
					<h1>{t("EVENTS.SERIES.TABLE.CAPTION")}</h1>
					{/* Include table view */}
					<h4>{t("TABLE_SUMMARY", { numberOfRows: series })}</h4>
				</div>

				<ShowSeriesDetailsModal />

				<Table templateMap={seriesTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Series;
