import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { connect } from "react-redux";
import { Field, FieldArray } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderMultiField' w... Remove this comment to see the full error message
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import {
	checkAcls,
	fetchAclActions,
	fetchAclTemplateById,
	fetchAclTemplates,
	fetchRolesWithTarget,
} from "../../../../thunks/aclThunks";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
import DropDown from "../../../shared/DropDown";
import { filterRoles, getAclTemplateText } from "../../../../utils/aclUtils";

/**
 * This component renders the access policy page in the new ACL wizard and in the ACL details modal
 */
const AclAccessPage = ({
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'isEdit' implicitly has an 'any' t... Remove this comment to see the full error message
	isEdit,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'checkAcls' implicitly has an 'any... Remove this comment to see the full error message
	checkAcls,
}) => {
	const { t } = useTranslation();

	const [aclTemplates, setAclTemplates] = useState([]);
	const [aclActions, setAclActions] = useState([]);
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(false);

	const isAccess =
		hasAccess("ROLE_UI_SERIES_DETAILS_ACL_EDIT", user) || !isEdit;

	useEffect(() => {
		// fetch data about roles, acl templates and actions from backend
		async function fetchData() {
			setLoading(true);
			const responseTemplates = await fetchAclTemplates();
// @ts-expect-error TS(2345): Argument of type '{ id: string; value: any; }[]' i... Remove this comment to see the full error message
			setAclTemplates(responseTemplates);
			const responseActions = await fetchAclActions();
// @ts-expect-error TS(2345): Argument of type '{ id: string; value: any; }[]' i... Remove this comment to see the full error message
			setAclActions(responseActions);
			const responseRoles = await fetchRolesWithTarget("ACL");
			setRoles(responseRoles);
			setLoading(false);
		}

		fetchData();
	}, []);

// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	const handleTemplateChange = async (value) => {
		// fetch information about chosen template from backend
		const template = await fetchAclTemplateById(value);

		formik.setFieldValue("acls", template);
		formik.setFieldValue("aclTemplate", value);
		await checkAcls(formik.values.acls);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Notifications context="not_corner" />
						{!loading && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<ul>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="obj list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<header className="no-expand">
											{t("USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.TITLE")}
										</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="obj-container">
											{/* Template selection */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="obj tbl-list">
												{isAccess && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<th>
																	{t("USERS.ACLS.NEW.ACCESS.TEMPLATES.TITLE")}
																</th>
															</tr>
														</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tr>
																{aclTemplates.length > 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<td className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<div className="obj-container padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<p>
																				{t(
																					"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION"
																				)}
																			</p>

																			{/* dropdown for selecting a policy template */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<DropDown
																				value={formik.values.aclTemplate}
																				text={getAclTemplateText(
																					aclTemplates,
																					formik.values.aclTemplate
																				)}
																				options={
																					!!aclTemplates ? aclTemplates : []
																				}
																				type={"aclTemplate"}
																				required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																				handleChange={(element) =>
																					handleTemplateChange(element.value)
																				}
																				placeholder={t(
																					"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.LABEL"
																				)}
																				tabIndex={"1"}
																				autoFocus={true}
																			/>
																		</div>
																	</td>
																) : (
																	// Show if no option is available
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<div className="obj-container padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<p>
																				{t(
																					"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION"
																				)}
																			</p>
																			{t(
																				"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.EMPTY"
																			)}
																		</div>
																	</td>
																)}
															</tr>
														</tbody>
													</table>
												)}
											</div>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<header>{t("")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th>
																		{t(
																			"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.ROLE"
																		)}
																	</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th className="fit">
																		{t(
																			"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.READ"
																		)}
																	</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th className="fit">
																		{t(
																			"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.WRITE"
																		)}
																	</th>
																	{aclActions.length > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<th className="fit">
																			{t(
																				"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.ADDITIONAL_ACTIONS"
																			)}
																		</th>
																	)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th className="fit">
																		{t(
																			"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.ACTION"
																		)}
																	</th>
																</tr>
															</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<FieldArray name="acls">
																	{({ insert, remove, push }) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<>
																			{roles.length > 0 ? (
																				formik.values.acls.length > 0 &&
// @ts-expect-error TS(7006): Parameter 'acl' implicitly has an 'any' type.
																				formik.values.acls.map((acl, index) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																					<tr key={index}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<td className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<DropDown
																								value={acl.role}
																								text={acl.role}
																								options={
																									!!roles && roles.length > 0
																										? filterRoles(
																												roles,
																												formik.values.acls
																										  )
																										: []
																								}
																								type={"aclRole"}
																								required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																								handleChange={(element) =>
																									formik.setFieldValue(
																										`acls.${index}.role`,
																										element.value
																									)
																								}
																								placeholder={t(
																									"USERS.ACLS.NEW.ACCESS.ROLES.LABEL"
																								)}
																								tabIndex={index + 1}
																								disabled={!isAccess}
																							/>
																						</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<td className="fit text-center">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<Field
																								type="checkbox"
																								name={`acls.${index}.read`}
																							/>
																						</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<td className="fit text-center">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<Field
																								type="checkbox"
																								name={`acls.${index}.write`}
																							/>
																						</td>
																						{aclActions.length > 0 &&
																							(isAccess ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																								<td className="fit editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																									<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																										<Field
																											name={`acls.${index}.actions`}
																											fieldInfo={{
																												id: `acls.${index}.actions`,
																												type: "mixed_text",
																												collection: aclActions,
																											}}
																											onlyCollectionValues
																											component={
																												RenderMultiField
																											}
																										/>
																									</div>
																								</td>
																							) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																								<td className="fit">
																									{/*repeat for each additional action*/}
																									{formik.values.acls[
																										index
																									].actions.map(
// @ts-expect-error TS(7006): Parameter 'action' implicitly has an 'any' type.
																										(action, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																											<div key={key}>
																												{action.value}
																											</div>
																										)
																									)}
																								</td>
																							))}
																						{/*Remove policy*/}
																						{isAccess && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																								<button
																									onClick={() => remove(index)}
																									className="button-like-anchor remove"
																								/>
																							</td>
																						)}
																					</tr>
																				))
																			) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																					<td>
																						{t(
																							"USERS.ACLS.NEW.ACCESS.ROLES.EMPTY"
																						)}
																					</td>
																				</tr>
																			)}

																			{isAccess && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<tr>
																					{/*Add additional policy row*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																					<td colSpan="5">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<button
																							onClick={() => {
																								push({
																									role: "",
																									read: false,
																									write: false,
																									actions: [],
																								});
																								checkAcls(formik.values.acls);
																							}}
                                              className="button-like-anchor"
																						>
																							{" "}
																							+{" "}
																							{t(
																								"USERS.ACLS.NEW.ACCESS.ACCESS_POLICY.NEW"
																							)}
																						</button>
																					</td>
																				</tr>
																			)}
																		</>
																	)}
																</FieldArray>
															</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>
								</li>
							</ul>
						)}
					</div>
				</div>
			</div>
			{/* Button for navigation to next page and previous page */}
			{!isEdit && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<button
							type="submit"
							className={cn("submit", {
								active: formik.dirty && formik.isValid,
								inactive: !(formik.dirty && formik.isValid),
							})}
							disabled={!(formik.dirty && formik.isValid)}
							onClick={async () => {
								if (await checkAcls(formik.values.acls)) {
									nextPage(formik.values);
								}
							}}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
							tabIndex="100"
						>
							{t("WIZARD.NEXT_STEP")}
						</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<button
							className="cancel"
							onClick={() => previousPage(formik.values, false)}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
							tabIndex="101"
						>
							{t("WIZARD.BACK")}
						</button>
					</footer>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="btm-spacer" />
				</>
			)}
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'acls' implicitly has an 'any' type.
	checkAcls: (acls) => dispatch(checkAcls(acls)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AclAccessPage);
