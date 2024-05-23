import React from "react";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { useTranslation } from "react-i18next";
import Notifications from "../../../shared/Notifications";
import { FormikProps } from "formik";

/**
 * This component renders the summary page for new groups in the new group wizard.
 */
interface RequiredFormProps {
	name: string,
	description: string,
	roles: string[],
	users: string[],
}

const NewGroupSummaryPage = <T extends RequiredFormProps>({
	formik,
	previousPage,
}: {
	formik: FormikProps<T>,
	previousPage?: (values: T) => void,
}) => {
	const { t } = useTranslation();

	// get values of objects in field that should be shown
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
	const getValues = (field) => {
		let names = [];
		for (let i = 0; i < field.length; i++) {
			names.push(field[i].name);
		}
		return names;
	};

	return (
		<>
			<div className="modal-content">
				<div className="modal-body">
					<div className="full-col">
						<Notifications />

						<div className="obj">
							<header>{t("USERS.GROUPS.DETAILS.FORM.SUMMARY")}</header>
							<div className="obj-container">
								<table className="main-tbl">
									<tbody>
										<tr>
											<td>{t("USERS.GROUPS.DETAILS.FORM.NAME")}</td>
											<td>{formik.values.name}</td>
										</tr>
										<tr>
											<td>{t("USERS.GROUPS.DETAILS.FORM.DESCRIPTION")}</td>
											<td>{formik.values.description}</td>
										</tr>
										<tr>
											<td>{t("USERS.GROUPS.DETAILS.FORM.ROLES")}</td>
											<td>{getValues(formik.values.roles).join(", ")}</td>
										</tr>
										<tr>
											<td>{t("USERS.GROUPS.DETAILS.FORM.USERS")}</td>
											<td>{getValues(formik.values.users).join(", ")}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Button for navigation to next page */}
			<WizardNavigationButtons
				isLast
				previousPage={previousPage}
				formik={formik}
			/>
		</>
	);
};

export default NewGroupSummaryPage;
