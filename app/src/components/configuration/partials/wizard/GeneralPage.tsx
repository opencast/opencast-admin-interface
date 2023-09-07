import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import { Field } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";

/**
 * This component renders the general page for new themes in the new themes wizard
 * and for themes in the themes details modal.
 * Here, additional information, like name, for themes can be provided.
 */
const GeneralPage = ({
    formik,
    nextPage,
    isEdit
}: any) => {
	const { t } = useTranslation();

	// Style used in themes details modal
	const editStyle = {
		color: "#666666",
		fontSize: "14px",
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* Fields for name and description */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="form-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<Notifications />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<label className="required" style={isEdit && editStyle}>
									{t("CONFIGURATION.THEMES.DETAILS.GENERAL.NAME")}
								</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<Field
									name="name"
									type="text"
									autoFocus={!isEdit}
									placeholder={
										t("CONFIGURATION.THEMES.DETAILS.GENERAL.NAME") + "..."
									}
								/>
							</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<label style={isEdit && editStyle}>
									{t("CONFIGURATION.THEMES.DETAILS.GENERAL.DESCRIPTION")}
								</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<Field
									name="description"
									as="textarea"
									placeholder={
										t("CONFIGURATION.THEMES.DETAILS.GENERAL.DESCRIPTION") +
										"..."
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Show navigation buttons only if page is used for a new theme*/}
			{!isEdit && (
				//Button for navigation to next page
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<WizardNavigationButtons isFirst formik={formik} nextPage={nextPage} />
			)}
		</>
	);
};

export default GeneralPage;
