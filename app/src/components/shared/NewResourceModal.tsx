import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../events/partials/wizards/NewEventWizard'... Remove this comment to see the full error message
import NewEventWizard from "../events/partials/wizards/NewEventWizard";
// @ts-expect-error TS(6142): Module '../events/partials/wizards/NewSeriesWizard... Remove this comment to see the full error message
import NewSeriesWizard from "../events/partials/wizards/NewSeriesWizard";
// @ts-expect-error TS(6142): Module '../configuration/partials/wizard/NewThemeW... Remove this comment to see the full error message
import NewThemeWizard from "../configuration/partials/wizard/NewThemeWizard";
// @ts-expect-error TS(6142): Module '../users/partials/wizard/NewAclWizard' was... Remove this comment to see the full error message
import NewAclWizard from "../users/partials/wizard/NewAclWizard";
// @ts-expect-error TS(6142): Module '../users/partials/wizard/NewGroupWizard' w... Remove this comment to see the full error message
import NewGroupWizard from "../users/partials/wizard/NewGroupWizard";
// @ts-expect-error TS(6142): Module '../users/partials/wizard/NewUserWizard' wa... Remove this comment to see the full error message
import NewUserWizard from "../users/partials/wizard/NewUserWizard";

/**
 * This component renders the modal for adding new resources
 */
const NewResourceModal = ({
    handleClose,
    showModal,
    resource
}: any) => {
	const { t } = useTranslation();

	const close = () => {
		handleClose();
	};

	return (
		// todo: add hotkeys
		showModal && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<section
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
					tabIndex="1"
					className="modal wizard modal-animation"
					id="add-event-modal"
				>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<button
              className="button-like-anchor fa fa-times close-modal"
              onClick={() => close()}
            />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{resource === "events" && <h2>{t("EVENTS.EVENTS.NEW.CAPTION")}</h2>}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{resource === "series" && <h2>{t("EVENTS.SERIES.NEW.CAPTION")}</h2>}
						{resource === "themes" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<h2>{t("CONFIGURATION.THEMES.DETAILS.NEWCAPTION")}</h2>
						)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{resource === "acl" && <h2>{t("USERS.ACLS.NEW.CAPTION")}</h2>}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{resource === "group" && <h2>{t("USERS.GROUPS.NEW.CAPTION")}</h2>}
						{resource === "user" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<h2>{t("USERS.USERS.DETAILS.NEWCAPTION")}</h2>
						)}
					</header>
					{resource === "events" && (
						//New Event Wizard
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<NewEventWizard close={close} />
					)}
					{resource === "series" && (
						// New Series Wizard
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<NewSeriesWizard close={close} />
					)}
					{resource === "themes" && (
						// New Theme Wizard
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<NewThemeWizard close={close} />
					)}
					{resource === "acl" && (
						// New ACL Wizard
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<NewAclWizard close={close} />
					)}
					{resource === "group" && (
						// New Group Wizard
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<NewGroupWizard close={close} />
					)}
					{resource === "user" && (
						// New User Wizard
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<NewUserWizard close={close} />
					)}
				</section>
			</>
		)
	);
};

export default NewResourceModal;
