import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { usersTemplateMap } from "../../configs/tableConfigs/usersTableMap";
import { getTotalUsers } from "../../selectors/userSelectors";
import {
	loadUsersIntoTable,
} from "../../thunks/tableThunks";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";

import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchUsers } from "../../slices/userSlice";
import { loadUsers, usersLinks } from "./partials/UsersNavigation";

/**
 * This component renders the table view of users
 */
const Users = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const users = useAppSelector(state => getTotalUsers(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	useEffect(() => {
		if ("users" !== currentFilterType) {
			dispatch(fetchFilters("users"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load users on mount
		loadUsers(dispatch);

		// Fetch users every minute
		let fetchUsersInterval = setInterval(loadUsers, 5000);

		return () => clearInterval(fetchUsersInterval);
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
					accessRole: "ROLE_UI_USERS_CREATE",
					text: "USERS.ACTIONS.ADD_USER",
					resource: "user",
				}}
			/>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					{/* Include filters component */}
					<TableFilters
						loadResource={fetchUsers}
						loadResourceIntoTable={loadUsersIntoTable}
						resource={"users"}
					/>
					<h1>{t("USERS.USERS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: users })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={usersTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Users;
