import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainNav from "../shared/MainNav";
import { Link } from "react-router-dom";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import NewResourceModal from "../shared/NewResourceModal";
import { aclsTemplateMap } from "../../configs/tableConfigs/aclsTableMap";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	loadAclsIntoTable,
	loadGroupsIntoTable,
	loadUsersIntoTable,
} from "../../thunks/tableThunks";
import { getTotalAcls } from "../../selectors/aclSelectors";
import { setOffset } from "../../slices/tableSlice";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { hasAccess } from "../../utils/utils";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchAcls } from "../../slices/aclSlice";
import { fetchUsers } from "../../slices/userSlice";
import { fetchGroups } from "../../slices/groupSlice";

/**
 * This component renders the table view of acls
 */
const Acls = () => {
	const { t } = useTranslation();
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewAclModal, setNewAclModal] = useState(false);

	const dispatch = useAppDispatch();
	const acls = useAppSelector(state => getTotalAcls(state));
	const user = useAppSelector(state => getUserInformation(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	const loadAcls = async () => {
		// Fetching acls from server
		await dispatch(fetchAcls());

		// Load acls into table
		dispatch(loadAclsIntoTable());
	};

	const loadUsers = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching users from server
		dispatch(fetchUsers());

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

	useEffect(() => {
		if ("acls" !== currentFilterType) {
			dispatch(fetchFilters("acls"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load acls on mount
		loadAcls().then((r) => console.info(r));

		// Fetch Acls every minute
		let fetchAclInterval = setInterval(loadAcls, 5000);

		return () => clearInterval(fetchAclInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	const showNewAclModal = () => {
		setNewAclModal(true);
	};

	const hideNewAclModal = () => {
		setNewAclModal(false);
	};

	return (
		<>
			<Header />
			<NavBar>
				{/* Display modal for new acl if add acl button is clicked */}
				{ displayNewAclModal &&
					<NewResourceModal
						handleClose={hideNewAclModal}
						resource="acl"
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
							className={cn({ active: false })}
							onClick={() => loadGroups()}
						>
							{t("USERS.NAVIGATION.GROUPS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_ACLS_VIEW", user) && (
						<Link
							to="/users/acls"
							className={cn({ active: true })}
							onClick={() => loadAcls()}
						>
							{t("USERS.NAVIGATION.PERMISSIONS")}
						</Link>
					)}
				</nav>
				
				{/* Add acl button */}
				<div className="btn-group">
					{hasAccess("ROLE_UI_ACLS_CREATE", user) && (
						<button className="add" onClick={() => showNewAclModal()}>
							<i className="fa fa-plus" />
							<span>{t("USERS.ACTIONS.ADD_ACL")}</span>
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
						loadResource={fetchAcls}
						loadResourceIntoTable={loadAclsIntoTable}
						resource={"acls"}
					/>
					<h1>{t("USERS.ACLS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: acls })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={aclsTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Acls;
