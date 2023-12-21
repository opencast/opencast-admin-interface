import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import cn from "classnames";
import { connect } from "react-redux";
import MainNav from "../shared/MainNav";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import NewResourceModal from "../shared/NewResourceModal";
import { usersTemplateMap } from "../../configs/tableConfigs/usersTableConfig";
import { getTotalUsers } from "../../selectors/userSelectors";
import { fetchUsers } from "../../thunks/userThunks";
import {
	loadAclsIntoTable,
	loadGroupsIntoTable,
	loadUsersIntoTable,
} from "../../thunks/tableThunks";
import { fetchFilters } from "../../thunks/tableFilterThunks";
import { fetchGroups } from "../../thunks/groupThunks";
import { editTextFilter } from "../../actions/tableFilterActions";
import { setOffset } from "../../actions/tableActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
import Header from "../Header";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { fetchAcls } from "../../slices/aclSlice";
import { useAppDispatch } from "../../store";

/**
 * This component renders the table view of users
 */
const Users = ({
// @ts-expect-error TS(7031): Binding element 'loadingUsers' implicitly has an '... Remove this comment to see the full error message
	loadingUsers,
// @ts-expect-error TS(7031): Binding element 'loadingUsersIntoTable' implicitly... Remove this comment to see the full error message
	loadingUsersIntoTable,
// @ts-expect-error TS(7031): Binding element 'users' implicitly has an 'any' ty... Remove this comment to see the full error message
	users,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'loadingGroups' implicitly has an ... Remove this comment to see the full error message
	loadingGroups,
// @ts-expect-error TS(7031): Binding element 'loadingGroupsIntoTable' implicitl... Remove this comment to see the full error message
	loadingGroupsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingAclsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingAclsIntoTable,
// @ts-expect-error TS(7031): Binding element 'resetTextFilter' implicitly has a... Remove this comment to see the full error message
	resetTextFilter,
// @ts-expect-error TS(7031): Binding element 'resetOffset' implicitly has an 'a... Remove this comment to see the full error message
	resetOffset,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'currentFilterType' implicitly has... Remove this comment to see the full error message
	currentFilterType,
}) => {
	const { t } = useTranslation();
        const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewUserModal, setNewUserModal] = useState(false);

	const loadUsers = async () => {
		// Fetching users from server
		await loadingUsers();

		// Load users into table
		loadingUsersIntoTable();
	};

	const loadGroups = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching groups from server
		loadingGroups();

		// Load groups into table
		loadingGroupsIntoTable();
	};

	const loadAcls = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching acls from server
		dispatch(fetchAcls());

		// Load acls into table
		loadingAclsIntoTable();
	};

	useEffect(() => {
		if ("users" !== currentFilterType) {
			loadingFilters("users");
		}

		resetTextFilter();

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
		setNewUserModal(true);
	};

	const hideNewUserModal = () => {
		setNewUserModal(false);
	};

	return (
		<>
			<Header />
			<section className="action-nav-bar">
				{/* Add user button */}
				<div className="btn-group">
					{hasAccess("ROLE_UI_USERS_CREATE", user) && (
						<button className="add" onClick={() => showNewUserModal()}>
							<i className="fa fa-plus" />
							<span>{t("USERS.ACTIONS.ADD_USER")}</span>
						</button>
					)}
				</div>

				{/* Display modal for new acl if add acl button is clicked */}
				<NewResourceModal
					showModal={displayNewUserModal}
					handleClose={hideNewUserModal}
					resource="user"
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
			</section>

			<div
				className="main-view"
				style={displayNavigation ? styleNavOpen : styleNavClosed}
			>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					{/* Include filters component */}
					<TableFilters
						loadResource={loadingUsers}
						loadResourceIntoTable={loadingUsersIntoTable}
						resource={"users"}
					/>
					<h1>{t("USERS.USERS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: users })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={usersTemplateMap} />
			</div>
			<Footer />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	users: getTotalUsers(state),
	user: getUserInformation(state),
	currentFilterType: getCurrentFilterResource(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	loadingUsers: () => dispatch(fetchUsers()),
	loadingUsersIntoTable: () => dispatch(loadUsersIntoTable()),
	loadingGroups: () => dispatch(fetchGroups()),
	loadingGroupsIntoTable: () => dispatch(loadGroupsIntoTable()),
	loadingAclsIntoTable: () => dispatch(loadAclsIntoTable()),
	resetTextFilter: () => dispatch(editTextFilter("")),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
