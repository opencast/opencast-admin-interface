import React, { useEffect, useState } from "react";
import MainNav from "../shared/MainNav";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { loadEventsIntoTable, loadLifeCyclePoliciesIntoTable, loadSeriesIntoTable } from "../../thunks/tableThunks";
import { fetchFilters, editTextFilter, fetchStats } from "../../slices/tableFilterSlice";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { AsyncThunk } from "@reduxjs/toolkit";
import { getTotalLifeCyclePolicies } from "../../selectors/lifeCycleSelectors";
import { fetchLifeCyclePolicies } from "../../slices/lifeCycleSlice";
import { lifeCyclePoliciesTemplateMap } from "../../configs/tableConfigs/lifeCyclePoliciesTableMap";
import { fetchEvents } from "../../slices/eventSlice";
import { setOffset } from "../../slices/tableSlice";
import { fetchSeries } from "../../slices/seriesSlice";
import NewResourceModal from "../shared/NewResourceModal";
import { fetchLifeCyclePolicyActions, fetchLifeCyclePolicyTargetTypes, fetchLifeCyclePolicyTimings } from "../../slices/lifeCycleDetailsSlice";

/**
 * This component renders the table view of policies
 */
const LifeCyclePolicies = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);
	const [displayNewPolicyModal, setNewPolicyModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const policiesTotal = useAppSelector(state => getTotalLifeCyclePolicies(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));

	const loadEvents = async () => {
		// Fetching stats from server
		dispatch(fetchStats());

		// Fetching events from server
		await dispatch(fetchEvents());

		// Load events into table
		dispatch(loadEventsIntoTable());
	};

	const loadSeries = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		//fetching series from server
		dispatch(fetchSeries());

		//load series into table
		dispatch(loadSeriesIntoTable());
	};

	const loadLifeCyclePolicies = async () => {
		// Fetching policies from server
		await dispatch(fetchLifeCyclePolicies());

		// Load policies into table
		dispatch(loadLifeCyclePoliciesIntoTable());
	};

	useEffect(() => {
		if ("lifeCyclePolicies" !== currentFilterType) {
			dispatch(fetchFilters("lifeCyclePolicies"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load policies on mount
		loadLifeCyclePolicies().then((r) => console.info(r));

		// Fetch policies repeatedly
		let fetchInterval = setInterval(loadLifeCyclePolicies, 5000);

		return () => clearInterval(fetchInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	const showNewPolicyModal = async () => {
		await dispatch(fetchLifeCyclePolicyActions());
		await dispatch(fetchLifeCyclePolicyTargetTypes());
		await dispatch(fetchLifeCyclePolicyTimings());

		setNewPolicyModal(true);
	};

	const hideNewPolicyModal = () => {
		setNewPolicyModal(false);
	};

	return (
		<>
			<Header />
			<NavBar>
				{
					/* Display modal for new event if add event button is clicked */
					displayNewPolicyModal && (
						<NewResourceModal
							handleClose={hideNewPolicyModal}
							resource={"lifecyclepolicy"}
						/>
					)
				}

				{/* Include Burger-button menu*/}
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

				<nav>
					{hasAccess("ROLE_UI_EVENTS_VIEW", user) && (
						<Link
							to="/events/events"
							className={cn({ active: false })}
							onClick={() => loadEvents()}
						>
							{t("EVENTS.EVENTS.NAVIGATION.EVENTS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_SERIES_VIEW", user) && (
						<Link
							to="/events/series"
							className={cn({ active: false })}
							onClick={() => loadSeries()}
						>
							{t("EVENTS.EVENTS.NAVIGATION.SERIES")}
						</Link>
					)}
					{hasAccess("ROLE_UI_LIFECYCLEPOLICIES_VIEW", user) && (
						<Link
							to="/events/lifeCyclePolicies"
							className={cn({ active: true })}
							onClick={() => loadLifeCyclePolicies()}
						>
							{t("LIFECYCLE.NAVIGATION.POLICIES")}
						</Link>
					)}
				</nav>

				<div className="btn-group">
					{hasAccess("ROLE_UI_EVENTS_CREATE", user) && (
						<button className="add" onClick={() => showNewPolicyModal()}>
							<i className="fa fa-plus" />
							<span>{t("LIFECYCLE.POLICIES.TABLE.ADD_POLICY")}</span>
						</button>
					)}
				</div>
			</NavBar>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					{/* Include filters component */}
					{/* LifeCycle policies are not indexed, can't search or filter them */}
					{/* But if we don't include this component, the policies won't load on page load, because the first
							fetch request we send to the backend contains invalid params >.> */}
					<TableFilters
						loadResource={fetchLifeCyclePolicies as AsyncThunk<any, void, any>}
						loadResourceIntoTable={loadLifeCyclePoliciesIntoTable}
						resource={"lifeCyclePolicies"}
					/>

					<h1>{t("LIFECYCLE.POLICIES.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: policiesTotal })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={lifeCyclePoliciesTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default LifeCyclePolicies;
