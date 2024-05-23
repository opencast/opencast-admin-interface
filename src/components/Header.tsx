import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import i18n from "../i18n/i18n";
import languages from "../i18n/languages";
// @ts-expect-error TS(2307): Cannot find module '../img/opencast-white.svg' or ... Remove this comment to see the full error message
import opencastLogo from "../img/opencast-white.svg";
import { GlobalHotKeys } from "react-hotkeys";
import { setSpecificServiceFilter } from "../slices/tableFilterSlice";
import { loadServicesIntoTable } from "../thunks/tableThunks";
import { getErrorCount, getHealthStatus } from "../selectors/healthSelectors";
import {
	getOrgProperties,
	getUserInformation,
} from "../selectors/userInfoSelectors";
import { availableHotkeys } from "../configs/hotkeysConfig";
import { studioURL } from "../configs/generalConfig";
import { getCurrentLanguageInformation, hasAccess } from "../utils/utils";
import { overflowStyle } from "../utils/componentStyles";
import RegistrationModal from "./shared/RegistrationModal";
import HotKeyCheatSheet from "./shared/HotKeyCheatSheet";
import { useAppDispatch, useAppSelector } from "../store";
import { HealthStatus, fetchHealthStatus } from "../slices/healthSlice";
import { UserInfoState } from "../slices/userInfoSlice";

// Get code, flag and name of the current language
const currentLanguage = getCurrentLanguageInformation();

// References for detecting a click outside of the container of the dropdown menus
const containerLang = React.createRef<HTMLDivElement>();
const containerHelp = React.createRef<HTMLDivElement>();
const containerUser = React.createRef<HTMLDivElement>();
const containerNotify = React.createRef<HTMLDivElement>();

function changeLanguage(code: string) {
	// Load json-file of the language with provided code
	i18n.changeLanguage(code);
	// Reload window for updating the flag of the language dropdown menu
	window.location.reload();
}

function logout() {
	window.location.href = "/j_spring_security_logout";
}

/**
 * Component that renders the header and the navigation in the upper right corner.
 */
const Header = ({
// @ts-expect-error TS(7031): Binding element 'loadingServicesIntoTable' implici... Remove this comment to see the full error message
	loadingServicesIntoTable,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	// State for opening (true) and closing (false) the dropdown menus for language, notification, help and user
	const [displayMenuLang, setMenuLang] = useState(false);
	const [displayMenuUser, setMenuUser] = useState(false);
	const [displayMenuNotify, setMenuNotify] = useState(false);
	const [displayMenuHelp, setMenuHelp] = useState(false);
	const [displayRegistrationModal, setRegistrationModal] = useState(false);
	const [displayHotKeyCheatSheet, setHotKeyCheatSheet] = useState(false);

	const healthStatus = useAppSelector(state => getHealthStatus(state));
	const errorCounter = useAppSelector(state => getErrorCount(state));
	const user = useAppSelector(state => getUserInformation(state));
	const orgProperties = useAppSelector(state => getOrgProperties(state));

	const loadHealthStatus = async () => {
		await dispatch(fetchHealthStatus());
	};

	const hideMenuHelp = () => {
		setMenuHelp(false);
	};

	const showRegistrationModal = () => {
		setRegistrationModal(true);
	};

	const hideRegistrationModal = () => {
		setRegistrationModal(false);
	};

	const redirectToServices = async () => {
		// Load services into table
		await loadingServicesIntoTable();

		// set the action filter value of services to true
		await dispatch(setSpecificServiceFilter({ filter: "actions", filterValue: "true" }));
	};

	const showHotKeyCheatSheet = () => {
		setHotKeyCheatSheet(true);
	};

	const hideHotKeyCheatSheet = () => {
		setHotKeyCheatSheet(false);
	};

	const hotKeyHandlers = {
		HOTKEY_CHEATSHEET: showHotKeyCheatSheet,
	};

	useEffect(() => {
		// Function for handling clicks outside of an open dropdown menu
		const handleClickOutside = (e: MouseEvent) => {
			if (containerLang.current && !containerLang.current.contains(e.target as Node)) {
				setMenuLang(false);
			}

			if (containerHelp.current && !containerHelp.current.contains(e.target as Node)) {
				setMenuHelp(false);
			}

			if (containerUser.current && !containerUser.current.contains(e.target as Node)) {
				setMenuUser(false);
			}

			if (
				containerNotify.current &&
				!containerNotify.current.contains(e.target as Node)
			) {
				setMenuNotify(false);
			}
		};

		// Fetching health status information at mount
		loadHealthStatus().then((r) => console.info(r));
		// Fetch health status every minute
		setInterval(() => dispatch(fetchHealthStatus()), 5000);

		// Event listener for handle a click outside of dropdown menu
		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<GlobalHotKeys
// @ts-expect-error TS(2769): No overload matches this call.
				keyMap={availableHotkeys.general}
				handlers={hotKeyHandlers}
			/>
			<header className="primary-header">
				{/* Opencast logo in upper left corner */}
				<div className="header-branding">
					<a href="/" target="_self" className="logo">
						<img src={opencastLogo} alt="Opencast Logo" />
					</a>
				</div>

				{/* Navigation with icons and dropdown menus in upper right corner */}
				<nav className="header-nav nav-dd-container" id="nav-dd-container">
					{/* Select language */}
					<div className="nav-dd lang-dd" id="lang-dd" ref={containerLang}>
						<div
							className="lang"
							title={t("LANGUAGE")}
							onClick={() => setMenuLang(!displayMenuLang)}
						>
							<img src={currentLanguage?.flag} alt={currentLanguage?.code} />
						</div>
						{/* Click on the flag icon, a dropdown menu with all available languages opens */}
						{displayMenuLang && <MenuLang />}
					</div>

					{/* Media Module */}
					{/* Show icon only if mediaModuleUrl is set*/}
					{/* The seperated if clauses are intentional because on start up orgProperties are not filled yet,
                    otherwise the app crashes */}
					{!!orgProperties &&
						!!orgProperties["org.opencastproject.admin.mediamodule.url"] && (
							<div className="nav-dd" title={t("MEDIAMODULE")}>
								<a
									href={
										orgProperties["org.opencastproject.admin.mediamodule.url"]
									}
								>
									<span className="fa fa-play-circle" />
								</a>
							</div>
						)}

					{/* Opencast Studio */}
					{hasAccess("ROLE_STUDIO", user) && (
						<div className="nav-dd" title="Studio">
							<a href={studioURL}>
								<span className="fa fa-video-camera" />
							</a>
						</div>
					)}

					{/* System warnings and notifications */}
					{hasAccess("ROLE_ADMIN", user) && (
						<div
							className="nav-dd info-dd"
							id="info-dd"
							title={t("SYSTEM_NOTIFICATIONS")}
							ref={containerNotify}
						>
							<div onClick={() => setMenuNotify(!displayMenuNotify)}>
								<i className="fa fa-bell" aria-hidden="true" />
								{errorCounter !== 0 && (
									<span id="error-count" className="badge">
										{errorCounter}
									</span>
								)}
								{/* Click on the bell icon, a dropdown menu with all services in serviceList and their status opens */}
								{displayMenuNotify && (
									<MenuNotify
										healthStatus={healthStatus}
										redirectToServices={redirectToServices}
									/>
								)}
							</div>
						</div>
					)}

					{/* Help */}
					{/* Show only if documentationUrl or restdocsUrl is set */}
					{/* The seperated if clauses are intentional because on start up orgProperties are not filled yet,
                    otherwise the app crashes */}
					{!!orgProperties &&
						(!!orgProperties[
							"org.opencastproject.admin.help.documentation.url"
						] ||
							!!orgProperties[
								"org.opencastproject.admin.help.restdocs.url"
							]) && (
							<div
								title="Help"
								className="nav-dd"
								id="help-dd"
								ref={containerHelp}
							>
								<div
									className="fa fa-question-circle"
									onClick={() => setMenuHelp(!displayMenuHelp)}
								/>
								{/* Click on the help icon, a dropdown menu with documentation, REST-docs and shortcuts (if available) opens */}
								{displayMenuHelp && (
									<MenuHelp
										hideMenuHelp={hideMenuHelp}
										showRegistrationModal={showRegistrationModal}
										showHotKeyCheatSheet={showHotKeyCheatSheet}
										orgProperties={orgProperties}
										user={user}
									/>
								)}
							</div>
						)}

					{/* Username */}
					<div className="nav-dd user-dd" id="user-dd" ref={containerUser}>
						<div
							className="h-nav"
							onClick={() => setMenuUser(!displayMenuUser)}
						>
							{user.user.name || user.user.username}
							<span className="dropdown-icon" />
						</div>
						{/* Click on username, a dropdown menu with the option to logout opens */}
						{displayMenuUser && <MenuUser />}
					</div>
				</nav>
			</header>

			{/* Adopters Registration Modal */}
			{displayRegistrationModal && (
				<RegistrationModal close={hideRegistrationModal} />
			)}

			{/* Hotkey Cheat Sheet */}
			{displayHotKeyCheatSheet && (
				<HotKeyCheatSheet close={hideHotKeyCheatSheet} />
			)}
		</>
	);
};

const MenuLang = () => {
	return (
		<ul className="dropdown-ul">
			{/* one list item for each available language */}
			{languages.map((language, key) => (
				<li key={key}>
					<button className="button-like-anchor" onClick={() => changeLanguage(language.code)}>
						<img
							className="lang-flag"
							src={language.flag}
							alt={language.code}
						/>
						{language.long}
					</button>
				</li>
			))}
		</ul>
	);
};

const MenuNotify = ({
	healthStatus,
	redirectToServices
}: {
	healthStatus: HealthStatus[],
	redirectToServices: () => Promise<void>,
}) => {
	return (
		<ul className="dropdown-ul">
			{/* For each service in the serviceList (Background Services) one list item */}
			{healthStatus.map((service, key) => (
				<li key={key}>
					{!!service.status && (
						<Link
							to="/systems/services"
							onClick={async () => await redirectToServices()}
						>
							<span> {service.name} </span>
							{service.error ? (
								<span className="ng-multi-value ng-multi-value-red">
									{service.status}
								</span>
							) : (
								<span className="ng-multi-value ng-multi-value-green">
									{service.status}
								</span>
							)}
						</Link>
					)}
				</li>
			))}
		</ul>
	);
};

const MenuHelp = ({
	hideMenuHelp,
	showRegistrationModal,
	showHotKeyCheatSheet,
	user,
	orgProperties,
}: {
	hideMenuHelp: () => void,
	showRegistrationModal: () => void,
	showHotKeyCheatSheet: () => void,
	user: UserInfoState,
	orgProperties: { [key: string]: string },
}) => {
	const { t } = useTranslation();

	// show Adopter Registration Modal and hide drop down
	const showAdoptersRegistrationModal = () => {
		showRegistrationModal();
		hideMenuHelp();
	};

	// show Hotkeys Cheat Sheet and hide drop down
	const showHotKeys = () => {
		showHotKeyCheatSheet();
		hideMenuHelp();
	};

	return (
		<>
			<ul style={overflowStyle} className="dropdown-ul">
				{/* Show only if documentationUrl is set */}
				{!!orgProperties[
					"org.opencastproject.admin.help.documentation.url"
				] && (
					<li>
						<a
							href={
								orgProperties[
									"org.opencastproject.admin.help.documentation.url"
								]
							}
						>
							<span>{t("HELP.DOCUMENTATION")}</span>
						</a>
					</li>
				)}
				{/* Show only if restUrl is set */}
				{!!orgProperties["org.opencastproject.admin.help.restdocs.url"] &&
					hasAccess("ROLE_ADMIN", user) && (
						<li>
							<a
								target="_self"
								href={
									orgProperties["org.opencastproject.admin.help.restdocs.url"]
								}
							>
								<span>{t("HELP.REST_DOC")}</span>
							</a>
						</li>
					)}
				<li>
					<button className="button-like-anchor" onClick={() => showHotKeys()}>
						<span>{t("HELP.HOTKEY_CHEAT_SHEET")}</span>
					</button>
				</li>
				{/* Adoter registration Modal */}
				{hasAccess("ROLE_ADMIN", user) && (
					<li>
						<button className="button-like-anchor" onClick={() => showAdoptersRegistrationModal()}>
							<span>{t("HELP.ADOPTER_REGISTRATION")}</span>
						</button>
					</li>
				)}
			</ul>
		</>
	);
};

const MenuUser = () => {
	const { t } = useTranslation();
	return (
		<ul className="dropdown-ul">
			<li>
				<button className="button-like-anchor" onClick={() => logout()}>
					<span className="logout-icon">{t("LOGOUT")}</span>
				</button>
			</li>
		</ul>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingServicesIntoTable: () => dispatch(loadServicesIntoTable()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
