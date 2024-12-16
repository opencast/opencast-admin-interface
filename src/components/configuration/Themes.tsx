import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import { themesTemplateMap } from "../../configs/tableConfigs/themesTableMap";
import { getTotalThemes } from "../../selectors/themeSelectors";
import { loadThemesIntoTable } from "../../thunks/tableThunks";
import Notifications from "../shared/Notifications";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
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
		loadThemes();

		// Fetch themes every minute
		let fetchThemesInterval = setInterval(loadThemes, 5000);

		return () => clearInterval(fetchThemesInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Header />
			<NavBar
				displayNavigation={displayNavigation}
				setNavigation={setNavigation}
				links={[
					{
						path: "/configuration/themes",
						accessRole: "ROLE_UI_THEMES_VIEW",
						loadFn: loadThemes,
						text: "CONFIGURATION.NAVIGATION.THEMES"
					},
				]}
				create={{
					accessRole: "ROLE_UI_THEMES_CREATE",
					text: "CONFIGURATION.ACTIONS.ADD_THEME",
					resource: "themes",
				}}
			/>

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
