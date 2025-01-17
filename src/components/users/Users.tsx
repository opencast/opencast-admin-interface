import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import cn from "classnames";
import MainNav from "../shared/MainNav";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import NewResourceModal from "../shared/NewResourceModal";
import { usersTemplateMap } from "../../configs/tableConfigs/usersTableMap";
import { getTotalUsers } from "../../selectors/userSelectors";
import {
	loadAclsIntoTable,
	loadGroupsIntoTable,
	loadUsersIntoTable,
} from "../../thunks/tableThunks";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
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
import { ModalHandle } from "../shared/modals/Modal";

/**
 * This component renders the table view of users
 */
const Users: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);
	const newUserModalRef = useRef<ModalHandle>(null);

  const users = useAppSelector(state => getTotalUsers(state));
  const user = useAppSelector(state => getUserInformation(state));
  const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	const loadUsers = async () => {
		// Fetching users from server
		await dispatch(fetchUsers());

		// Load users into table
		dispatch(loadUsersIntoTable());
	};

	const loadGroups = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching groups from server
		dispatch(fetchGroups());

		// Load groups into table
		dispatch(loadGroupsIntoTable());
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
		if ("users" !== currentFilterType) {
			dispatch(fetchFilters("users"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load users on mount
		loadUsers().then((r) => console.info(r));

		// Fetch users every minute
		let fetchUsersInterval = setInterval(loadUsers, 5000);

		return () => clearInterval(fetchUsersInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	const showNewUserModal = () => {
		newUserModalRef.current?.open();
	};

	const hideNewUserModal = () => {
		newUserModalRef.current?.close?.();
	};

	return (
		<>
			<Header />
			<NavBar>
				{/* Display modal for new acl if add acl button is clicked */}
				<NewResourceModal
					handleClose={hideNewUserModal}
					resource="user"
					modalRef={newUserModalRef}
				/>

				{/* Include Burger-button menu*/}
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

				<nav>
					{hasAccess("ROLE_UI_USERS_VIEW", user) && (
						<Link
							to="/users/users"
							className={cn({ active: true })}
							onClick={() => loadUsers()}
						>
							{t("USERS.NAVIGATION.USERS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_GROUPS_VIEW", user) && (
						<Link
							to="/users/groups"
							className={cn({ active: false })}
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
				
				{/* Add user button */}
				<div className="btn-group">
					{hasAccess("ROLE_UI_USERS_CREATE", user) && (
						<button className="add" onClick={() => showNewUserModal()}>
							<i className="fa fa-plus" />
							<span>{t("USERS.ACTIONS.ADD_USER")}</span>
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
