import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../shared/MainNav' was resolved to '/home/... Remove this comment to see the full error message
import MainNav from "../shared/MainNav";
import { Link } from "react-router-dom";
import cn from "classnames";
// @ts-expect-error TS(6142): Module '../shared/TableFilters' was resolved to '/... Remove this comment to see the full error message
import TableFilters from "../shared/TableFilters";
// @ts-expect-error TS(6142): Module '../shared/Table' was resolved to '/home/ar... Remove this comment to see the full error message
import Table from "../shared/Table";
// @ts-expect-error TS(6142): Module '../shared/Notifications' was resolved to '... Remove this comment to see the full error message
import Notifications from "../shared/Notifications";
// @ts-expect-error TS(6142): Module '../shared/NewResourceModal' was resolved t... Remove this comment to see the full error message
import NewResourceModal from "../shared/NewResourceModal";
import { getTotalGroups } from "../../selectors/groupSelectors";
import { groupsTemplateMap } from "../../configs/tableConfigs/groupsTableConfig";
import { fetchFilters } from "../../thunks/tableFilterThunks";
import { fetchUsers } from "../../thunks/userThunks";
import {
	loadAclsIntoTable,
	loadGroupsIntoTable,
	loadUsersIntoTable,
} from "../../thunks/tableThunks";
import { fetchGroups } from "../../thunks/groupThunks";
import { fetchAcls } from "../../thunks/aclThunks";
import { editTextFilter } from "../../actions/tableFilterActions";
import { setOffset } from "../../actions/tableActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
// @ts-expect-error TS(6142): Module '../Header' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Header from "../Header";
// @ts-expect-error TS(6142): Module '../Footer' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";

/**
 * This component renders the table view of groups
 */
const Groups = ({
// @ts-expect-error TS(7031): Binding element 'loadingGroups' implicitly has an ... Remove this comment to see the full error message
	loadingGroups,
// @ts-expect-error TS(7031): Binding element 'loadingGroupsIntoTable' implicitl... Remove this comment to see the full error message
	loadingGroupsIntoTable,
// @ts-expect-error TS(7031): Binding element 'groups' implicitly has an 'any' t... Remove this comment to see the full error message
	groups,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'loadingUsers' implicitly has an '... Remove this comment to see the full error message
	loadingUsers,
// @ts-expect-error TS(7031): Binding element 'loadingUsersIntoTable' implicitly... Remove this comment to see the full error message
	loadingUsersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingAcls' implicitly has an 'a... Remove this comment to see the full error message
	loadingAcls,
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
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewGroupModal, setNewGroupModal] = useState(false);

	const loadGroups = async () => {
		// Fetching groups from server
		await loadingGroups();

		// Load groups into table
		loadingGroupsIntoTable();
	};

	const loadUsers = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching users from server
		loadingUsers();

		// Load users into table
		loadingUsersIntoTable();
	};

	const loadAcls = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching acls from server
		loadingAcls();

		// Load acls into table
		loadingAclsIntoTable();
	};

	useEffect(() => {
		if ("groups" !== currentFilterType) {
			loadingFilters("groups");
		}

		resetTextFilter();

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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Header />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section className="action-nav-bar">
				{/* Add group button */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="btn-group">
					{hasAccess("ROLE_UI_GROUPS_CREATE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<button className="add" onClick={() => showNewGroupModal()}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<i className="fa fa-plus" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span>{t("USERS.ACTIONS.ADD_GROUP")}</span>
						</button>
					)}
				</div>

				{/* Display modal for new acl if add acl button is clicked */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<NewResourceModal
					showModal={displayNewGroupModal}
					handleClose={hideNewGroupModal}
					resource="group"
				/>

				{/* Include Burger-button menu*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<nav>
					{hasAccess("ROLE_UI_USERS_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/users/users"
							className={cn({ active: false })}
							onClick={() => loadUsers()}
						>
							{t("USERS.NAVIGATION.USERS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_GROUPS_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/users/groups"
							className={cn({ active: true })}
							onClick={() => loadGroups()}
						>
							{t("USERS.NAVIGATION.GROUPS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_ACLS_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
						loadResource={loadingGroups}
						loadResourceIntoTable={loadingGroupsIntoTable}
						resource={"groups"}
					/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h1>{t("USERS.GROUPS.TABLE.CAPTION")}</h1>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h4>{t("TABLE_SUMMARY", { numberOfRows: groups })}</h4>
				</div>
				{/* Include table component */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Table templateMap={groupsTemplateMap} />
			</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Footer />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	groups: getTotalGroups(state),
	user: getUserInformation(state),
	currentFilterType: getCurrentFilterResource(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	loadingGroups: () => dispatch(fetchGroups()),
	loadingGroupsIntoTable: () => dispatch(loadGroupsIntoTable()),
	loadingUsers: () => dispatch(fetchUsers()),
	loadingUsersIntoTable: () => dispatch(loadUsersIntoTable()),
	loadingAcls: () => dispatch(fetchAcls()),
	loadingAclsIntoTable: () => dispatch(loadAclsIntoTable()),
	resetTextFilter: () => dispatch(editTextFilter("")),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
