import React from "react";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { useTranslation } from "react-i18next";
import { Field } from "formik";

/**
 * This component renders the metadata page for groups in the new groups wizard and group details modal
 */
const GroupMetadataPage = ({
    nextPage,
    formik,
    isEdit
}: any) => {
	const { t } = useTranslation();

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* Fields for name and description */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="form-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<label>
								{t("USERS.GROUPS.DETAILS.FORM.NAME")}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i className="required">*</i>
							</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<Field
								tabIndex="1"
								type="text"
								autoFocus={!isEdit}
								placeholder={t("USERS.GROUPS.DETAILS.FORM.NAME")}
								name="name"
							/>
						</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<label>{t("USERS.GROUPS.DETAILS.FORM.DESCRIPTION")}</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<Field
								as="textarea"
								tabIndex="2"
								placeholder={t("USERS.GROUPS.DETAILS.FORM.DESCRIPTION")}
								name="description"
							/>
						</div>
					</div>
				</div>
			</div>

			{!isEdit && (
				//{/* Button for navigation to next page */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<WizardNavigationButtons isFirst formik={formik} nextPage={nextPage} />
			)}
		</>
	);
};

export default GroupMetadataPage;
