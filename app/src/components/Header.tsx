import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n/i18n";
import languages from "../i18n/languages";
// @ts-expect-error TS(2307): Cannot find module '../img/opencast-white.svg' or ... Remove this comment to see the full error message
import opencastLogo from "../img/opencast-white.svg";
import { GlobalHotKeys } from "react-hotkeys";
import { fetchHealthStatus } from "../thunks/healthThunks";
import { setSpecificServiceFilter } from "../thunks/tableFilterThunks";
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
// @ts-expect-error TS(6142): Module './shared/RegistrationModal' was resolved t... Remove this comment to see the full error message
import RegistrationModal from "./shared/RegistrationModal";
// @ts-expect-error TS(6142): Module './shared/HotKeyCheatSheet' was resolved to... Remove this comment to see the full error message
import HotKeyCheatSheet from "./shared/HotKeyCheatSheet";

// Get code, flag and name of the current language
const currentLanguage = getCurrentLanguageInformation();

// References for detecting a click outside of the container of the dropdown menus
const containerLang = React.createRef();
const containerHelp = React.createRef();
const containerUser = React.createRef();
const containerNotify = React.createRef();

// @ts-expect-error TS(7006): Parameter 'code' implicitly has an 'any' type.
function changeLanguage(code) {
	// Load json-file of the language with provided code
	i18n.changeLanguage(code);
	// Reload window for updating the flag of the language dropdown menu
	window.location.reload();
}

function logout() {
	axios
		.get("/j_spring_security_logout")
		.then((response) => {
			console.info(response);
			window.location.reload();
		})
		.catch((response) => {
			console.error(response);
		});
}

/**
 * Component that renders the header and the navigation in the upper right corner.
 */
const Header = ({
// @ts-expect-error TS(7031): Binding element 'loadingHealthStatus' implicitly h... Remove this comment to see the full error message
	loadingHealthStatus,
// @ts-expect-error TS(7031): Binding element 'healthStatus' implicitly has an '... Remove this comment to see the full error message
	healthStatus,
// @ts-expect-error TS(7031): Binding element 'errorCounter' implicitly has an '... Remove this comment to see the full error message
	errorCounter,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'orgProperties' implicitly has an ... Remove this comment to see the full error message
	orgProperties,
// @ts-expect-error TS(7031): Binding element 'setSpecificServiceFilter' implici... Remove this comment to see the full error message
	setSpecificServiceFilter,
// @ts-expect-error TS(7031): Binding element 'loadingServicesIntoTable' implici... Remove this comment to see the full error message
	loadingServicesIntoTable,
}) => {
	const { t } = useTranslation();
	// State for opening (true) and closing (false) the dropdown menus for language, notification, help and user
	const [displayMenuLang, setMenuLang] = useState(false);
	const [displayMenuUser, setMenuUser] = useState(false);
	const [displayMenuNotify, setMenuNotify] = useState(false);
	const [displayMenuHelp, setMenuHelp] = useState(false);
	const [displayRegistrationModal, setRegistrationModal] = useState(false);
	const [displayHotKeyCheatSheet, setHotKeyCheatSheet] = useState(false);

	const loadHealthStatus = async () => {
		await loadingHealthStatus();
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
		await setSpecificServiceFilter("actions", "true");
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
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
		const handleClickOutside = (e) => {
// @ts-expect-error TS(2571): Object is of type 'unknown'.
			if (containerLang.current && !containerLang.current.contains(e.target)) {
				setMenuLang(false);
			}

// @ts-expect-error TS(2571): Object is of type 'unknown'.
			if (containerHelp.current && !containerHelp.current.contains(e.target)) {
				setMenuHelp(false);
			}

// @ts-expect-error TS(2571): Object is of type 'unknown'.
			if (containerUser.current && !containerUser.current.contains(e.target)) {
				setMenuUser(false);
			}

			if (
				containerNotify.current &&
// @ts-expect-error TS(2571): Object is of type 'unknown'.
				!containerNotify.current.contains(e.target)
			) {
				setMenuNotify(false);
			}
		};

		// Fetching health status information at mount
		loadHealthStatus().then((r) => console.info(r));
		// Fetch health status every minute
		setInterval(loadingHealthStatus, 5000);

		// Event listener for handle a click outside of dropdown menu
		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<GlobalHotKeys
// @ts-expect-error TS(2769): No overload matches this call.
				keyMap={availableHotkeys.general}
				handlers={hotKeyHandlers}
			/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<header className="primary-header">
				{/* Opencast logo in upper left corner */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="header-branding">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<a href="/" target="_self" className="logo">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<img src={opencastLogo} alt="Opencast Logo" />
					</a>
				</div>

				{/* Navigation with icons and dropdown menus in upper right corner */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<nav className="header-nav nav-dd-container" id="nav-dd-container">
					{/* Select language */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="nav-dd lang-dd" id="lang-dd" ref={containerLang}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div
							className="lang"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
							title={t("LANGUAGE")}
							onClick={() => setMenuLang(!displayMenuLang)}
						>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<img src={currentLanguage.flag} alt={currentLanguage.code} />
						</div>
						{/* Click on the flag icon, a dropdown menu with all available languages opens */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{displayMenuLang && <MenuLang />}
					</div>

					{/* Media Module */}
					{/* Show icon only if mediaModuleUrl is set*/}
					{/* The seperated if clauses are intentional because on start up orgProperties are not filled yet,
                    otherwise the app crashes */}
					{!!orgProperties &&
						!!orgProperties["org.opencastproject.admin.mediamodule.url"] && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="nav-dd" title={t("MEDIAMODULE")}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<a
									href={
										orgProperties["org.opencastproject.admin.mediamodule.url"]
									}
								>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<span className="fa fa-play-circle" />
								</a>
							</div>
						)}

					{/* Opencast Studio */}
					{hasAccess("ROLE_STUDIO", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="nav-dd" title="Studio">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<a href={studioURL}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<span className="fa fa-video-camera" />
							</a>
						</div>
					)}

					{/* System warnings and notifications */}
					{hasAccess("ROLE_ADMIN", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div
							className="nav-dd info-dd"
							id="info-dd"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
							title={t("SYSTEM_NOTIFICATIONS")}
// @ts-expect-error TS(2322): Type 'RefObject<unknown>' is not assignable to typ... Remove this comment to see the full error message
							ref={containerNotify}
						>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div onClick={() => setMenuNotify(!displayMenuNotify)}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i className="fa fa-bell" aria-hidden="true" />
								{errorCounter !== 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<span id="error-count" className="badge">
										{errorCounter}
									</span>
								)}
								{/* Click on the bell icon, a dropdown menu with all services in serviceList and their status opens */}
								{displayMenuNotify && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div
								title="Help"
								className="nav-dd"
								id="help-dd"
// @ts-expect-error TS(2322): Type 'RefObject<unknown>' is not assignable to typ... Remove this comment to see the full error message
								ref={containerHelp}
							>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div
									className="fa fa-question-circle"
									onClick={() => setMenuHelp(!displayMenuHelp)}
								/>
								{/* Click on the help icon, a dropdown menu with documentation, REST-docs and shortcuts (if available) opens */}
								{displayMenuHelp && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="nav-dd user-dd" id="user-dd" ref={containerUser}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div
							className="h-nav"
							onClick={() => setMenuUser(!displayMenuUser)}
						>
							{user.user.name || user.user.username}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span className="dropdown-icon" />
						</div>
						{/* Click on username, a dropdown menu with the option to logout opens */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{displayMenuUser && <MenuUser />}
					</div>
				</nav>
			</header>

			{/* Adopters Registration Modal */}
			{displayRegistrationModal && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<RegistrationModal close={hideRegistrationModal} />
			)}

			{/* Hotkey Cheat Sheet */}
			{displayHotKeyCheatSheet && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<HotKeyCheatSheet close={hideHotKeyCheatSheet} />
			)}
		</>
	);
};

const MenuLang = () => {
	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<ul className="dropdown-ul">
			{/* one list item for each available language */}
			{languages.map((language, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className="button-like-anchor" onClick={() => changeLanguage(language.code)}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// @ts-expect-error TS(7031): Binding element 'healthStatus' implicitly has an '... Remove this comment to see the full error message
const MenuNotify = ({ healthStatus, redirectToServices }) => {
	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<ul className="dropdown-ul">
			{/* For each service in the serviceList (Background Services) one list item */}
// @ts-expect-error TS(7006): Parameter 'service' implicitly has an 'any' type.
			{healthStatus.map((service, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li key={key}>
					{!!service.status && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/systems/services"
							onClick={async () => await redirectToServices()}
						>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span> {service.name} </span>
							{service.error ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<span className="ng-multi-value ng-multi-value-red">
									{service.status}
								</span>
							) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(7031): Binding element 'hideMenuHelp' implicitly has an '... Remove this comment to see the full error message
	hideMenuHelp,
// @ts-expect-error TS(7031): Binding element 'showRegistrationModal' implicitly... Remove this comment to see the full error message
	showRegistrationModal,
// @ts-expect-error TS(7031): Binding element 'showHotKeyCheatSheet' implicitly ... Remove this comment to see the full error message
	showHotKeyCheatSheet,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'orgProperties' implicitly has an ... Remove this comment to see the full error message
	orgProperties,
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<ul style={overflowStyle} className="dropdown-ul">
				{/* Show only if documentationUrl is set */}
				{!!orgProperties[
					"org.opencastproject.admin.help.documentation.url"
				] && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<a
							href={
								orgProperties[
									"org.opencastproject.admin.help.documentation.url"
								]
							}
						>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span>{t("HELP.DOCUMENTATION")}</span>
						</a>
					</li>
				)}
				{/* Show only if restUrl is set */}
				{!!orgProperties["org.opencastproject.admin.help.restdocs.url"] &&
					hasAccess("ROLE_ADMIN", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<a
								target="_self"
								href={
									orgProperties["org.opencastproject.admin.help.restdocs.url"]
								}
							>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<span>{t("HELP.REST_DOC")}</span>
							</a>
						</li>
					)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className="button-like-anchor" onClick={() => showHotKeys()}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<span>{t("HELP.HOTKEY_CHEAT_SHEET")}</span>
					</button>
				</li>
				{/* Adoter registration Modal */}
				{hasAccess("ROLE_ADMIN", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<button className="button-like-anchor" onClick={() => showAdoptersRegistrationModal()}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<ul className="dropdown-ul">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button className="button-like-anchor" onClick={() => logout()}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<span className="logout-icon">{t("LOGOUT")}</span>
				</button>
			</li>
		</ul>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	healthStatus: getHealthStatus(state),
	errorCounter: getErrorCount(state),
	user: getUserInformation(state),
	orgProperties: getOrgProperties(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingHealthStatus: () => dispatch(fetchHealthStatus()),
	loadingServicesIntoTable: () => dispatch(loadServicesIntoTable()),
// @ts-expect-error TS(7006): Parameter 'filter' implicitly has an 'any' type.
	setSpecificServiceFilter: (filter, filterValue) =>
		dispatch(setSpecificServiceFilter(filter, filterValue)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
