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
import { aclsTemplateMap } from "../../configs/tableConfigs/aclsTableConfig";
import { fetchFilters } from "../../thunks/tableFilterThunks";
import { fetchUsers } from "../../thunks/userThunks";
import {
	loadAclsIntoTable,
	loadGroupsIntoTable,
	loadUsersIntoTable,
} from "../../thunks/tableThunks";
import { fetchGroups } from "../../thunks/groupThunks";
import { fetchAcls } from "../../thunks/aclThunks";
import { getTotalAcls } from "../../selectors/aclSelectors";
import { editTextFilter } from "../../actions/tableFilterActions";
import { setOffset } from "../../actions/tableActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
// @ts-expect-error TS(6142): Module '../Header' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Header from "../Header";
// @ts-expect-error TS(6142): Module '../Footer' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Footer from "../Footer";
import { hasAccess } from "../../utils/utils";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";

/**
 * This component renders the table view of acls
 */
const Acls = ({
// @ts-expect-error TS(7031): Binding element 'loadingAcls' implicitly has an 'a... Remove this comment to see the full error message
	loadingAcls,
// @ts-expect-error TS(7031): Binding element 'loadingAclsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingAclsIntoTable,
// @ts-expect-error TS(7031): Binding element 'acls' implicitly has an 'any' typ... Remove this comment to see the full error message
	acls,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'loadingUsers' implicitly has an '... Remove this comment to see the full error message
	loadingUsers,
// @ts-expect-error TS(7031): Binding element 'loadingUsersIntoTable' implicitly... Remove this comment to see the full error message
	loadingUsersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingGroups' implicitly has an ... Remove this comment to see the full error message
	loadingGroups,
// @ts-expect-error TS(7031): Binding element 'loadingGroupsIntoTable' implicitl... Remove this comment to see the full error message
	loadingGroupsIntoTable,
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
	const [displayNewAclModal, setNewAclModal] = useState(false);

	const loadAcls = async () => {
		// Fetching acls from server
		await loadingAcls();

		// Load acls into table
		loadingAclsIntoTable();
	};

	const loadUsers = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching users from server
		loadingUsers();

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

	useEffect(() => {
		if ("acls" !== currentFilterType) {
			loadingFilters("acls");
		}

		resetTextFilter();

		// Load acls on mount
		loadAcls().then((r) => console.info(r));

		// Fetch ACLs every minute
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Header />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section className="action-nav-bar">
				{/* Add acl button */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="btn-group">
					{hasAccess("ROLE_UI_ACLS_CREATE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<button className="add" onClick={() => showNewAclModal()}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<i className="fa fa-plus" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span>{t("USERS.ACTIONS.ADD_ACL")}</span>
						</button>
					)}
				</div>

				{/* Display modal for new acl if add acl button is clicked */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<NewResourceModal
					showModal={displayNewAclModal}
					handleClose={hideNewAclModal}
					resource="acl"
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
							className={cn({ active: false })}
							onClick={() => loadGroups()}
						>
							{t("USERS.NAVIGATION.GROUPS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_ACLS_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/users/acls"
							className={cn({ active: true })}
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
						loadResource={loadingAcls}
						loadResourceIntoTable={loadingAclsIntoTable}
						resource={"acls"}
					/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h1>{t("USERS.ACLS.TABLE.CAPTION")}</h1>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h4>{t("TABLE_SUMMARY", { numberOfRows: acls })}</h4>
				</div>
				{/* Include table component */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Table templateMap={aclsTemplateMap} />
			</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Footer />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	acls: getTotalAcls(state),
	user: getUserInformation(state),
	currentFilterType: getCurrentFilterResource(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	loadingAcls: () => dispatch(fetchAcls()),
	loadingAclsIntoTable: () => dispatch(loadAclsIntoTable()),
	loadingUsers: () => dispatch(fetchUsers()),
	loadingUsersIntoTable: () => dispatch(loadUsersIntoTable()),
	loadingGroups: () => dispatch(fetchGroups()),
	loadingGroupsIntoTable: () => dispatch(loadGroupsIntoTable()),
	resetTextFilter: () => dispatch(editTextFilter("")),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Acls);
