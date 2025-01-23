import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useLocation } from "react-router";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import DeleteSeriesModal from "./partials/modals/DeleteSeriesModal";
import { seriesTemplateMap } from "../../configs/tableConfigs/seriesTableMap";
import {
	loadSeriesIntoTable,
} from "../../thunks/tableThunks";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import { getTotalSeries, isShowActions } from "../../selectors/seriesSeletctor";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import {
	fetchSeries,
	fetchSeriesMetadata,
	fetchSeriesThemes,
	showActionsSeries,
} from "../../slices/seriesSlice";
import { fetchSeriesDetailsTobiraNew } from "../../slices/seriesSlice";
import { eventsLinks, loadSeries } from "./partials/EventsNavigation";

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
	const [displayDeleteSeriesModal, setDeleteSeriesModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	let location = useLocation();

	const series = useAppSelector(state => getTotalSeries(state));
	const showActions = useAppSelector(state => isShowActions(state));

	useEffect(() => {
		if ("series" !== currentFilterType) {
			dispatch(fetchFilters("series"))
		}

		// Reset text filer
		dispatch(editTextFilter(""));

		// disable actions button
		dispatch(showActionsSeries(false));

		// Load events on mount
		loadSeries(dispatch);

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
		let fetchSeriesInterval = setInterval(() => loadSeries(dispatch), 5000);

		// Event listener for handle a click outside of dropdown menu
		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
			clearInterval(fetchSeriesInterval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.hash]);

	const handleActionMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setActionMenu(!displayActionMenu);
	};

	const onNewSeriesModal = async () => {
		await dispatch(fetchSeriesMetadata());
		await dispatch(fetchSeriesThemes());
		await dispatch(fetchSeriesDetailsTobiraNew("/"));
	};

	const hideDeleteModal = () => {
		setDeleteSeriesModal(false);
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
					accessRole: "ROLE_UI_SERIES_CREATE",
					onShowModal: onNewSeriesModal,
					text: "EVENTS.EVENTS.ADD_SERIES",
					resource: "series",
					hotkeySequence: availableHotkeys.general.NEW_SERIES.sequence,
					hotkeyDescription: availableHotkeys.general.NEW_SERIES.description,
				}}
			>
				{displayDeleteSeriesModal && (
					<DeleteSeriesModal close={hideDeleteModal} />
				)}
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
				<Table templateMap={seriesTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Series;
