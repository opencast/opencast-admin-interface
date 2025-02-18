import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import {
	getOrgProperties,
	getUserInformation
} from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { useAppSelector } from "../../store";
import { Tooltip } from "./Tooltip";

/**
 * This component renders the main navigation that opens when the burger button is clicked
 */
const MainNav = ({
	isOpen,
	toggleMenu,
}: {
	isOpen: boolean,
	toggleMenu: () => void,
}) => {
	const { t } = useTranslation();
	let navigate = useNavigate();

	const user = useAppSelector(state => getUserInformation(state));
	const orgProperties = useAppSelector(state => getOrgProperties(state));

	const statisticsEnabled = (orgProperties['admin.statistics.enabled'] || 'false').toLowerCase() === 'true';
	const themesEnabled = (orgProperties['admin.themes.enabled'] || 'false').toLowerCase() === 'true';

	useHotkeys(
    availableHotkeys.general.EVENT_VIEW.sequence,
    () => navigate("/events/events"),
		{ description: t(availableHotkeys.general.EVENT_VIEW.description) ?? undefined },
    []
  );

	useHotkeys(
    availableHotkeys.general.SERIES_VIEW.sequence,
    () => navigate("/events/series"),
		{ description: t(availableHotkeys.general.SERIES_VIEW.description) ?? undefined },
    []
  );

	useHotkeys(
    availableHotkeys.general.MAIN_MENU.sequence,
    () => toggleMenu(),
		{ description: t(availableHotkeys.general.MAIN_MENU.description) ?? undefined },
    [toggleMenu]
  );

	return (
		<>
			<div className="menu-top" >
				<button className="button-like-anchor" onClick={() => toggleMenu()}>
					<Tooltip title={t("HOTKEYS.DESCRIPTIONS.GENERAL.MAIN_MENU")} placement={"right"}>
						<i className="fa fa-bars" />
					</Tooltip>
				</button>
				{isOpen && (
					<nav id="roll-up-menu">
						<div id="nav-container">
							{/* todo: more than one href? how? roles? (see MainNav admin-ui-frontend)*/}
							{hasAccess("ROLE_UI_NAV_RECORDINGS_VIEW", user) &&
								(hasAccess("ROLE_UI_EVENTS_VIEW", user) ? (
									<Link to="/events/events">
										<Tooltip title={t("NAV.EVENTS.TITLE")} placement={"right"}>
											<i className="events" />
										</Tooltip>
									</Link>
								) : (
									hasAccess("ROLE_UI_SERIES_VIEW", user) && (
										<Link to="/events/series">
											<Tooltip title={t("NAV.EVENTS.TITLE")} placement={"right"}>
												<i className="events" />
											</Tooltip>
										</Link>
									)
								))}
							{hasAccess("ROLE_UI_NAV_CAPTURE_VIEW", user) &&
								hasAccess("ROLE_UI_LOCATIONS_VIEW", user) && (
									<Link
										to="/recordings/recordings"
									>
										<Tooltip title={t("NAV.CAPTUREAGENTS.TITLE")} placement={"right"}>
											<i
												className="recordings"
											/>
										</Tooltip>
									</Link>
								)}
							{hasAccess("ROLE_UI_NAV_SYSTEMS_VIEW", user) &&
								(hasAccess("ROLE_UI_JOBS_VIEW", user) ? (
									<Link to="/systems/jobs">
										<Tooltip  title={t("NAV.SYSTEMS.TITLE")} placement={"right"}>
											<i className="systems" />
										</Tooltip>
									</Link>
								) : hasAccess("ROLE_UI_SERVERS_VIEW", user) ? (
									<Link to="/systems/servers">
										<Tooltip title={t("NAV.SYSTEMS.TITLE")} placement={"right"}>
											<i className="systems" />
										</Tooltip>
									</Link>
								) : (
									hasAccess("ROLE_UI_SERVICES_VIEW", user) && (
										<Link to="/systems/services">
											<Tooltip title={t("NAV.SYSTEMS.TITLE")} placement={"right"}>
												<i className="systems" />
											</Tooltip>
										</Link>
									)
								))}
							{hasAccess("ROLE_UI_NAV_ORGANIZATION_VIEW", user) &&
								(hasAccess("ROLE_UI_USERS_VIEW", user) ? (
									<Link to="/users/users">
										<Tooltip title={t("NAV.USERS.TITLE")} placement={"right"}>
											<i className="users" />
										</Tooltip>
									</Link>
								) : hasAccess("ROLE_UI_GROUPS_VIEW", user) ? (
									<Link to="/users/groups">
										<Tooltip title={t("NAV.USERS.TITLE")} placement={"right"}>
											<i className="users" />
										</Tooltip>
									</Link>
								) : (
									hasAccess("ROLE_UI_ACLS_VIEW", user) && (
										<Link to="/users/acls">
											<Tooltip title={t("NAV.USERS.TITLE")} placement={"right"}>
												<i className="users" />
											</Tooltip>
										</Link>
									)
								))}
							{themesEnabled &&
								hasAccess("ROLE_UI_NAV_CONFIGURATION_VIEW", user) &&
								hasAccess("ROLE_UI_THEMES_VIEW", user) && (
									<Link to="/configuration/themes">
										<Tooltip title={t("NAV.CONFIGURATION.TITLE")} placement={"right"}>
											<i className="configuration" />
										</Tooltip>
									</Link>
								)}
							{statisticsEnabled &&
								hasAccess("ROLE_UI_NAV_STATISTICS_VIEW", user) &&
								hasAccess("ROLE_UI_STATISTICS_ORGANIZATION_VIEW", user) && (
									<Link to="/statistics/organization">
										<Tooltip title={t("NAV.STATISTICS.TITLE")} placement={"right"}>
											<i className="statistics" />
										</Tooltip>
									</Link>
								)}
						</div>
					</nav>
				)}
			</div>
		</>
	);
};

export default MainNav;
