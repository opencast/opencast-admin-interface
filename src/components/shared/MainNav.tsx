import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import {
	getOrgProperties,
	getUserInformation,
} from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { useAppSelector } from "../../store";
import { Tooltip } from "./Tooltip";
import ButtonLikeAnchor from "./ButtonLikeAnchor";
import { ParseKeys } from "i18next";

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
	const navigate = useNavigate();

	const orgProperties = useAppSelector(state => getOrgProperties(state));

	const statisticsEnabled = (orgProperties["admin.statistics.enabled"] || "false").toLowerCase() === "true";
	const themesEnabled = (orgProperties["admin.themes.enabled"] || "false").toLowerCase() === "true";

	useHotkeys(
		availableHotkeys.general.EVENT_VIEW.sequence,
		() => navigate("/events/events"),
		{ description: t(availableHotkeys.general.EVENT_VIEW.description) ?? undefined },
		[],
	);

	useHotkeys(
		availableHotkeys.general.SERIES_VIEW.sequence,
		() => navigate("/events/series"),
		{ description: t(availableHotkeys.general.SERIES_VIEW.description) ?? undefined },
		[],
	);

	useHotkeys(
		availableHotkeys.general.MAIN_MENU.sequence,
		() => toggleMenu(),
		{ description: t(availableHotkeys.general.MAIN_MENU.description) ?? undefined },
		[toggleMenu],
	);

	return (
		<div className="menu-top" >
			<ButtonLikeAnchor onClick={() => toggleMenu()}>
				<Tooltip title={t("HOTKEYS.DESCRIPTIONS.GENERAL.MAIN_MENU")} placement={"right"}>
					<i className="fa fa-bars" />
				</Tooltip>
			</ButtonLikeAnchor>
			{isOpen && (
				<nav id="roll-up-menu">
					<div id="nav-container">
						{/* todo: more than one href? how? roles? (see MainNav admin-ui-frontend)*/}
						<MainNavButton
							accessRole="ROLE_UI_NAV_RECORDINGS_VIEW"
							links={[
								{
									path: "/events/events",
									accessRole: "ROLE_UI_EVENTS_VIEW",
									tooltipTitle: "NAV.EVENTS.TITLE",
									className: "events",
								},
								{
									path: "/events/series",
									accessRole: "ROLE_UI_SERIES_VIEW",
									tooltipTitle: "NAV.EVENTS.TITLE",
									className: "events",
								},
							]}
						/>
						<MainNavButton
							accessRole="ROLE_UI_NAV_CAPTURE_VIEW"
							links={[
								{
									path: "/recordings/recordings",
									accessRole: "ROLE_UI_LOCATIONS_VIEW",
									tooltipTitle: "NAV.CAPTUREAGENTS.TITLE",
									className: "recordings",
								},
							]}
						/>
						<MainNavButton
							accessRole="ROLE_UI_NAV_SYSTEMS_VIEW"
							links={[
								{
									path: "/systems/jobs",
									accessRole: "ROLE_UI_JOBS_VIEW",
									tooltipTitle: "NAV.SYSTEMS.TITLE",
									className: "systems",
								},
								{
									path: "/systems/servers",
									accessRole: "ROLE_UI_SERVERS_VIEW",
									tooltipTitle: "NAV.SYSTEMS.TITLE",
									className: "systems",
								},
								{
									path: "/systems/services",
									accessRole: "ROLE_UI_SERVICES_VIEW",
									tooltipTitle: "NAV.SYSTEMS.TITLE",
									className: "systems",
								},
							]}
						/>
						<MainNavButton
							accessRole="ROLE_UI_NAV_ORGANIZATION_VIEW"
							links={[
								{
									path: "/users/users",
									accessRole: "ROLE_UI_USERS_VIEW",
									tooltipTitle: "NAV.USERS.TITLE",
									className: "users",
								},
								{
									path: "/users/groups",
									accessRole: "ROLE_UI_GROUPS_VIEW",
									tooltipTitle: "NAV.USERS.TITLE",
									className: "users",
								},
								{
									path: "/users/acls",
									accessRole: "ROLE_UI_ACLS_VIEW",
									tooltipTitle: "NAV.USERS.TITLE",
									className: "users",
								},
							]}
						/>
						{themesEnabled &&
							<MainNavButton
								accessRole="ROLE_UI_NAV_CONFIGURATION_VIEW"
								links={[
									{
										path: "/configuration/themes",
										accessRole: "ROLE_UI_THEMES_VIEW",
										tooltipTitle: "NAV.CONFIGURATION.TITLE",
										className: "configuration",
									},
								]}
							/>
						}
						{statisticsEnabled &&
							<MainNavButton
								accessRole="ROLE_UI_NAV_STATISTICS_VIEW"
								links={[
									{
										path: "/statistics/organization",
										accessRole: "ROLE_UI_STATISTICS_ORGANIZATION_VIEW",
										tooltipTitle: "NAV.STATISTICS.TITLE",
										className: "statistics",
									},
								]}
							/>
						}
					</div>
				</nav>
			)}
		</div>
	);
};

const MainNavButton = ({
	accessRole,
	links,
}: {
	accessRole: string
	links: (React.ComponentProps<typeof MainNavLink> & {accessRole: string})[]
}) => {

	const user = useAppSelector(state => getUserInformation(state));

	const linkProps = links.find(props => hasAccess(props.accessRole, user));

	return (
		hasAccess(accessRole, user) &&
		linkProps &&
			<MainNavLink
				{...linkProps}
			/>
	);
};

const MainNavLink = ({
	path,
	tooltipTitle,
	className,
}: {
	path: string
	tooltipTitle: ParseKeys
	className: string
}) => {
	const { t } = useTranslation();

	return (
		<Link to={path}>
			<Tooltip title={t(tooltipTitle)} placement={"right"}>
				<i className={className} />
			</Tooltip>
		</Link>
	);
};

export default MainNav;
