import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { aclsTemplateMap } from "../../configs/tableConfigs/aclsTableMap";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	loadAclsIntoTable,
} from "../../thunks/tableThunks";
import { getTotalAcls } from "../../selectors/aclSelectors";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchAcls } from "../../slices/aclSlice";
import { loadAcls, usersLinks } from "./partials/UsersNavigation";

/**
 * This component renders the table view of acls
 */
const Acls = () => {
	const { t } = useTranslation();
	const [displayNavigation, setNavigation] = useState(false);

	const dispatch = useAppDispatch();
	const acls = useAppSelector(state => getTotalAcls(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	useEffect(() => {
		if ("acls" !== currentFilterType) {
			dispatch(fetchFilters("acls"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load acls on mount
		loadAcls(dispatch);

		// Fetch Acls every minute
		let fetchAclInterval = setInterval(loadAcls, 5000);

		return () => clearInterval(fetchAclInterval);
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
					accessRole: "ROLE_UI_ACLS_CREATE",
					text: "USERS.ACTIONS.ADD_ACL",
					resource: "acl",
				}}
			/>

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
