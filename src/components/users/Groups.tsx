import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainNav from "../shared/MainNav";
import { Link } from "react-router-dom";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import NewResourceModal from "../shared/NewResourceModal";
import { getTotalGroups } from "../../selectors/groupSelectors";
import { groupsTemplateMap } from "../../configs/tableConfigs/groupsTableMap";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	loadAclsIntoTable,
	loadGroupsIntoTable,
	loadUsersIntoTable,
} from "../../thunks/tableThunks";
import { setOffset } from "../../slices/tableSlice";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { fetchAcls } from "../../slices/aclSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchUsers } from "../../slices/userSlice";
import { fetchGroups } from "../../slices/groupSlice";

/**
 * This component renders the table view of groups
 */
const Groups = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewGroupModal, setNewGroupModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const groups = useAppSelector(state => getTotalGroups(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	const loadGroups = async () => {
		// Fetching groups from server
		await dispatch(fetchGroups());

		// Load groups into table
		dispatch(loadGroupsIntoTable());
	};

	const loadUsers = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching users from server
		dispatch(fetchUsers());

		// Load users into table
		dispatch(loadUsersIntoTable());
	};

	const loadAcls = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching acls from server
		dispatch(fetchAcls());

		// Load acls into table
		dispatch(loadAclsIntoTable());
	};

	useEffect(() => {
		if ("groups" !== currentFilterType) {
			dispatch(fetchFilters("groups"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load groups on mount
		loadGroups().then((r) => console.info(r));

		// Fetch groups every minute
		let fetchGroupsInterval = setInterval(loadGroups, 5000);

		return () => clearInterval(fetchGroupsInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	const showNewGroupModal = () => {
		setNewGroupModal(true);
	};

	const hideNewGroupModal = () => {
		setNewGroupModal(false);
	};

	return (
		<>
			<Header />
			<NavBar>
				{/* Display modal for new acl if add acl button is clicked */}
				{ displayNewGroupModal &&
					<NewResourceModal
						handleClose={hideNewGroupModal}
						resource="group"
					/>
				}

				{/* Include Burger-button menu*/}
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

				<nav>
					{hasAccess("ROLE_UI_USERS_VIEW", user) && (
						<Link
							to="/users/users"
							className={cn({ active: false })}
							onClick={() => loadUsers()}
						>
							{t("USERS.NAVIGATION.USERS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_GROUPS_VIEW", user) && (
						<Link
							to="/users/groups"
							className={cn({ active: true })}
							onClick={() => loadGroups()}
						>
							{t("USERS.NAVIGATION.GROUPS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_ACLS_VIEW", user) && (
						<Link
							to="/users/acls"
							className={cn({ active: false })}
							onClick={() => loadAcls()}
						>
							{t("USERS.NAVIGATION.PERMISSIONS")}
						</Link>
					)}
				</nav>

				{/* Add group button */}
				<div className="btn-group">
					{hasAccess("ROLE_UI_GROUPS_CREATE", user) && (
						<button className="add" onClick={() => showNewGroupModal()}>
							<i className="fa fa-plus" />
							<span>{t("USERS.ACTIONS.ADD_GROUP")}</span>
						</button>
					)}
				</div>
			</NavBar>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications context={"other"}/>

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
