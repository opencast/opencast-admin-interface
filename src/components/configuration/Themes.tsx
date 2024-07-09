import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainNav from "../shared/MainNav";
import { Link } from "react-router-dom";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import { connect } from "react-redux";
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
const Themes = ({
// @ts-expect-error TS(7031): Binding element 'loadingThemesIntoTable' implicitl... Remove this comment to see the full error message
	loadingThemesIntoTable,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewThemesModal, setNewThemesModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const themes = useAppSelector(state => getTotalThemes(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchThemesWrapper = async () => {
		await dispatch(fetchThemes())
	}

	const loadThemes = async () => {
		// Fetching themes from server
		await dispatch(fetchThemes());

		// Load users into table
		loadingThemesIntoTable();
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

				{/* Add theme button */}
				<div className="btn-group">
					{hasAccess("ROLE_UI_THEMES_CREATE", user) && (
						<button className="add" onClick={() => showNewThemesModal()}>
							<i className="fa fa-plus" />
							<span>{t("CONFIGURATION.ACTIONS.ADD_THEME")}</span>
						</button>
					)}
				</div>
			</NavBar>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					{/* Include filters component */}
					<TableFilters
						loadResource={fetchThemesWrapper}
						loadResourceIntoTable={loadingThemesIntoTable}
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingThemesIntoTable: () => dispatch(loadThemesIntoTable()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Themes);
