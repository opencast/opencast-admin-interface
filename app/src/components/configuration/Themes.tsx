import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../shared/MainNav' was resolved to '/home/... Remove this comment to see the full error message
import MainNav from "../shared/MainNav";
import { Link } from "react-router-dom";
import cn from "classnames";
// @ts-expect-error TS(6142): Module '../shared/TableFilters' was resolved to '/... Remove this comment to see the full error message
import TableFilters from "../shared/TableFilters";
// @ts-expect-error TS(6142): Module '../shared/Table' was resolved to '/home/ar... Remove this comment to see the full error message
import Table from "../shared/Table";
import { fetchFilters } from "../../thunks/tableFilterThunks";
import { connect } from "react-redux";
import { themesTemplateMap } from "../../configs/tableConfigs/themesTableConfig";
import { getTotalThemes } from "../../selectors/themeSelectors";
import { fetchThemes } from "../../thunks/themeThunks";
import { loadThemesIntoTable } from "../../thunks/tableThunks";
// @ts-expect-error TS(6142): Module '../shared/Notifications' was resolved to '... Remove this comment to see the full error message
import Notifications from "../shared/Notifications";
// @ts-expect-error TS(6142): Module '../shared/NewResourceModal' was resolved t... Remove this comment to see the full error message
import NewResourceModal from "../shared/NewResourceModal";
import { editTextFilter } from "../../actions/tableFilterActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
// @ts-expect-error TS(6142): Module '../Header' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Header from "../Header";
// @ts-expect-error TS(6142): Module '../Footer' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";

/**
 * This component renders the table view of events
 */
const Themes = ({
// @ts-expect-error TS(7031): Binding element 'loadingThemes' implicitly has an ... Remove this comment to see the full error message
	loadingThemes,
// @ts-expect-error TS(7031): Binding element 'loadingThemesIntoTable' implicitl... Remove this comment to see the full error message
	loadingThemesIntoTable,
// @ts-expect-error TS(7031): Binding element 'themes' implicitly has an 'any' t... Remove this comment to see the full error message
	themes,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'resetTextFilter' implicitly has a... Remove this comment to see the full error message
	resetTextFilter,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'currentFilterType' implicitly has... Remove this comment to see the full error message
	currentFilterType,
}) => {
	const { t } = useTranslation();
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewThemesModal, setNewThemesModal] = useState(false);

	const loadThemes = async () => {
		// Fetching themes from server
		await loadingThemes();

		// Load users into table
		loadingThemesIntoTable();
	};

	useEffect(() => {
		if ("themes" !== currentFilterType) {
			loadingFilters("themes");
		}

		resetTextFilter();

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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Header />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section className="action-nav-bar">
				{/* Add theme button */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="btn-group">
					{hasAccess("ROLE_UI_THEMES_CREATE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<button className="add" onClick={() => showNewThemesModal()}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<i className="fa fa-plus" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span>{t("CONFIGURATION.ACTIONS.ADD_THEME")}</span>
						</button>
					)}
				</div>

				{/* Display modal for new series if add series button is clicked */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<NewResourceModal
					showModal={displayNewThemesModal}
					handleClose={hideNewThemesModal}
					resource={"themes"}
				/>

				{/* Include Burger-button menu*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<nav>
					{hasAccess("ROLE_UI_THEMES_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/configuration/themes"
							className={cn({ active: true })}
							onClick={() => loadThemes()}
						>
							{t("CONFIGURATION.NAVIGATION.THEMES")}
						</Link>
					)}
				</nav>
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
					{/* Include filters component */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<TableFilters
						loadResource={loadingThemes}
						loadResourceIntoTable={loadingThemesIntoTable}
						resource={"themes"}
					/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h1>{t("CONFIGURATION.THEMES.TABLE.CAPTION")}</h1>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h4>{t("TABLE_SUMMARY", { numberOfRows: themes })}</h4>
				</div>
				{/* Include table component */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Table templateMap={themesTemplateMap} />
			</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Footer />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	themes: getTotalThemes(state),
	user: getUserInformation(state),
	currentFilterType: getCurrentFilterResource(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	loadingThemes: () => dispatch(fetchThemes()),
	loadingThemesIntoTable: () => dispatch(loadThemesIntoTable()),
	resetTextFilter: () => dispatch(editTextFilter("")),
});

export default connect(mapStateToProps, mapDispatchToProps)(Themes);
