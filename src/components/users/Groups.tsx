import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { getTotalGroups } from "../../selectors/groupSelectors";
import { groupsTemplateMap } from "../../configs/tableConfigs/groupsTableMap";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	loadGroupsIntoTable,
} from "../../thunks/tableThunks";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchGroups } from "../../slices/groupSlice";
import { loadGroups, usersLinks } from "./partials/UsersNavigation";

/**
 * This component renders the table view of groups
 */
const Groups = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const groups = useAppSelector(state => getTotalGroups(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	useEffect(() => {
		if ("groups" !== currentFilterType) {
			dispatch(fetchFilters("groups"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load groups on mount
		loadGroups(dispatch);

		// Fetch groups every minute
		let fetchGroupsInterval = setInterval(loadGroups, 5000);

		return () => clearInterval(fetchGroupsInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Header />
			<NavBar
				displayNavigation={displayNavigation}
				setNavigation={setNavigation}
				links={usersLinks}
				create={{
					accessRole: "ROLE_UI_GROUPS_CREATE",
					text: "USERS.ACTIONS.ADD_GROUP",
					resource: "group",
				}}
			/>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					{/* Include filters component */}
					<TableFilters
						loadResource={fetchGroups}
						loadResourceIntoTable={loadGroupsIntoTable}
						resource={"groups"}
					/>
					<h1>{t("USERS.GROUPS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: groups })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={groupsTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Groups;
