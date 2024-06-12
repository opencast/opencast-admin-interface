import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
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
import { setOffset } from "../../actions/tableActions";
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
const Groups = ({
// @ts-expect-error TS(7031): Binding element 'loadingGroupsIntoTable' implicitl... Remove this comment to see the full error message
	loadingGroupsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingUsersIntoTable' implicitly... Remove this comment to see the full error message
	loadingUsersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingAclsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingAclsIntoTable,
// @ts-expect-error TS(7031): Binding element 'resetOffset' implicitly has an 'a... Remove this comment to see the full error message
	resetOffset,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewGroupModal, setNewGroupModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const groups = useAppSelector(state => getTotalGroups(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchGroupsWrapper = async () => {
		await dispatch(fetchGroups())
	}

	const loadGroups = async () => {
		// Fetching groups from server
		await dispatch(fetchGroups());

		// Load groups into table
		loadingGroupsIntoTable();
	};

	const loadUsers = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching users from server
		dispatch(fetchUsers());

		// Load users into table
		loadingUsersIntoTable();
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
				{/* Add group button */}
				<div className="btn-group">
					{hasAccess("ROLE_UI_GROUPS_CREATE", user) && (
						<button className="add" onClick={() => showNewGroupModal()}>
							<i className="fa fa-plus" />
							<span>{t("USERS.ACTIONS.ADD_GROUP")}</span>
						</button>
					)}
				</div>

				{/* Display modal for new acl if add acl button is clicked */}
				<NewResourceModal
					showModal={displayNewGroupModal}
					handleClose={hideNewGroupModal}
					resource="group"
				/>

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
			</NavBar>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					{/* Include filters component */}
					<TableFilters
						loadResource={fetchGroupsWrapper}
						loadResourceIntoTable={loadingGroupsIntoTable}
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingGroupsIntoTable: () => dispatch(loadGroupsIntoTable()),
	loadingUsersIntoTable: () => dispatch(loadUsersIntoTable()),
	loadingAclsIntoTable: () => dispatch(loadAclsIntoTable()),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
