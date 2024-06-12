import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainNav from "../shared/MainNav";
import { Link } from "react-router-dom";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import { themesTemplateMap } from "../../configs/tableConfigs/themesTableMap";
import { getTotalThemes } from "../../selectors/themeSelectors";
import { loadThemesIntoTable } from "../../thunks/tableThunks";
import Notifications from "../shared/Notifications";
import NewResourceModal from "../shared/NewResourceModal";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchThemes } from "../../slices/themeSlice";

/**
 * This component renders the table view of events
 */
const Themes = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewThemesModal, setNewThemesModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const themes = useAppSelector(state => getTotalThemes(state));

	const loadThemes = async () => {
		// Fetching themes from server
		await dispatch(fetchThemes());

		// Load users into table
		dispatch(loadThemesIntoTable());
	};

	useEffect(() => {
		if ("themes" !== currentFilterType) {
			dispatch(fetchFilters("themes"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load themes on mount
		loadThemes().then((r) => console.info(r));

		// Fetch themes every minute
		let fetchThemesInterval = setInterval(loadThemes, 5000);

		return () => clearInterval(fetchThemesInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	const showNewThemesModal = () => {
		setNewThemesModal(true);
	};

	const hideNewThemesModal = () => {
		setNewThemesModal(false);
	};

	return (
		<>
			<Header />
			<NavBar>
				{/* Add theme button */}
				<div className="btn-group">
					{hasAccess("ROLE_UI_THEMES_CREATE", user) && (
						<button className="add" onClick={() => showNewThemesModal()}>
							<i className="fa fa-plus" />
							<span>{t("CONFIGURATION.ACTIONS.ADD_THEME")}</span>
						</button>
					)}
				</div>

				{/* Display modal for new series if add series button is clicked */}
				<NewResourceModal
					showModal={displayNewThemesModal}
					handleClose={hideNewThemesModal}
					resource={"themes"}
				/>

				{/* Include Burger-button menu*/}
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

				<nav>
					{hasAccess("ROLE_UI_THEMES_VIEW", user) && (
						<Link
							to="/configuration/themes"
							className={cn({ active: true })}
							onClick={() => loadThemes()}
						>
							{t("CONFIGURATION.NAVIGATION.THEMES")}
						</Link>
					)}
				</nav>
			</NavBar>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					{/* Include filters component */}
					<TableFilters
						loadResource={fetchThemes}
						loadResourceIntoTable={loadThemesIntoTable}
						resource={"themes"}
					/>
					<h1>{t("CONFIGURATION.THEMES.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: themes })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={themesTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Themes;
