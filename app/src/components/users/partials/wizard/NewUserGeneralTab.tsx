import React from "react";
import { Field } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import { useTranslation } from "react-i18next";
import cn from "classnames";

/**
 * This component renders the general user information tab for new users in the new users wizard.
 */
const NewUserGeneralTab = ({
    formik
}: any) => {
	const { t } = useTranslation();

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="form-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<Notifications />
					{/* Fields for user information needed */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<label>
							{t("USERS.USERS.DETAILS.FORM.USERNAME")}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<i className="required">*</i>
						</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Field
							type="text"
							name="username"
							autoFocus
							className={cn({
								error: formik.touched.username && formik.errors.username,
							})}
							placeholder={t("USERS.USERS.DETAILS.FORM.USERNAME") + "..."}
						/>
					</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<label>
							{t("USERS.USERS.DETAILS.FORM.NAME")}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<i className="required">*</i>
						</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Field
							type="text"
							name="name"
							className={cn({
								error: formik.touched.name && formik.errors.name,
							})}
							placeholder={t("USERS.USERS.DETAILS.FORM.NAME") + "..."}
						/>
					</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<label>
							{t("USERS.USERS.DETAILS.FORM.EMAIL")}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<i className="required">*</i>
						</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Field
							type="text"
							name="email"
							className={cn({
								error: formik.touched.email && formik.errors.email,
							})}
							placeholder={t("USERS.USERS.DETAILS.FORM.EMAIL") + "..."}
						/>
					</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<label>
							{t("USERS.USERS.DETAILS.FORM.PASSWORD")}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<i className="required">*</i>
						</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Field
							type="password"
							name="password"
							className={cn({
								error: formik.touched.password && formik.errors.password,
							})}
							placeholder={t("USERS.USERS.DETAILS.FORM.PASSWORD") + "..."}
						/>
					</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<label>
							{t("USERS.USERS.DETAILS.FORM.REPEAT_PASSWORD")}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<i className="required">*</i>
						</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Field
							type="password"
							name="passwordConfirmation"
							className={cn({
								error:
									formik.touched.passwordConfirmation &&
									formik.errors.passwordConfirmation,
							})}
							placeholder={
								t("USERS.USERS.DETAILS.FORM.REPEAT_PASSWORD") + "..."
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewUserGeneralTab;
