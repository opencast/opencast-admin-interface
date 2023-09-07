import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import {
	checkAcls,
	fetchAclActions,
	fetchAclTemplateById,
	fetchAclTemplates,
	fetchRolesWithTarget,
} from "../../../../thunks/aclThunks";
import { Field, FieldArray } from "formik";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderMultiField' w... Remove this comment to see the full error message
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
import DropDown from "../../../shared/DropDown";
import { filterRoles, getAclTemplateText } from "../../../../utils/aclUtils";

/**
 * This component renders the access page for new events and series in the wizards.
 */
const NewAccessPage = ({
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'editAccessRole' implicitly has an... Remove this comment to see the full error message
	editAccessRole,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'checkAcls' implicitly has an 'any... Remove this comment to see the full error message
	checkAcls,
}) => {
	const { t } = useTranslation();

	// States containing response from server concerning acl templates, actions and roles
	const [aclTemplates, setAclTemplates] = useState([]);
	const [aclActions, setAclActions] = useState([]);
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(false);

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

		formik.setFieldValue("aclTemplate", value);
		formik.setFieldValue("acls", template);
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
						{/* Notifications */}
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
											{t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.TITLE")}
										</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<p>
												{t(
													"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION"
												)}
											</p>

											{/* Template selection*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<th>
																{t("EVENTS.SERIES.NEW.ACCESS.TEMPLATES.TITLE")}
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
																		{/* dropdown for selecting a policy template */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<DropDown
																			value={formik.values.aclTemplate}
																			text={getAclTemplateText(
																				aclTemplates,
																				formik.values.aclTemplate
																			)}
																			options={aclTemplates}
																			type={"aclTemplate"}
																			required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																			handleChange={(element) =>
																				handleTemplateChange(element.value)
																			}
																			placeholder={t(
																				"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.LABEL"
																			)}
																			tabIndex={"1"}
																			autoFocus={true}
																		/>
																	</div>
																</td>
															) : (
																//Show if no option is available
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<div className="obj-container padded">
																		{t(
																			"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.EMPTY"
																		)}
																	</div>
																</td>
															)}
														</tr>
													</tbody>
												</table>
											</div>
										</div>

										{/* Area for editing acls */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<header>
													{t(
														"EVENTS.SERIES.DETAILS.ACCESS.ACCESS_POLICY.DETAILS"
													)}
												</header>
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
																		"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.ROLE"
																	)}
																</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<th className="fit">
																	{t(
																		"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.READ"
																	)}
																</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<th className="fit">
																	{t(
																		"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.WRITE"
																	)}
																</th>
																{aclActions.length > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th className="fit">
																		{t(
																			"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.ADDITIONAL_ACTIONS"
																		)}
																	</th>
																)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<th className="fit">
																	{t(
																		"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.ACTION"
																	)}
																</th>
															</tr>
														</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<tbody>
															{/*Add fieldArray/row for each policy in acls field*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<FieldArray name="acls">
																{({ insert, remove, push }) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<>
																		{roles.length > 0 ? (
																			formik.values.acls.length > 0 &&
																			formik.values.acls.map(
// @ts-expect-error TS(7006): Parameter 'policy' implicitly has an 'any' type.
																				(policy, index) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																					<tr key={index}>
																						{/* dropdown for acl (/policy) role */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<td className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<DropDown
																								value={policy.role}
																								text={policy.role}
																								options={filterRoles(
																									roles,
																									formik.values.acls
																								)}
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
																									"EVENTS.SERIES.NEW.ACCESS.ROLES.LABEL"
																								)}
																								tabIndex={index + 1}
																								disabled={
																									!hasAccess(
																										editAccessRole,
																										user
																									)
																								}
																							/>
																						</td>
																						{/* Checkboxes for  policy.read and policy.write*/}
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
																						{/* Show only if policy has actions*/}
																						{aclActions.length > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<td className="fit editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																								<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																									<Field
																										fieldInfo={{
																											id: `acls.${index}.actions`,
																											type: "mixed_text",
																											collection: aclActions,
																										}}
																										onlyCollectionValues
																										name={`acls.${index}.actions`}
																										component={RenderMultiField}
																									/>
																								</div>
																							</td>
																						)}
																						{/*Remove policy*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<button
																								onClick={() => remove(index)}
																								className="button-like-anchor remove"
																							/>
																						</td>
																					</tr>
																				)
																			)
																		) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<td>
																					{t(
																						"EVENTS.SERIES.NEW.ACCESS.ROLES.EMPTY"
																					)}
																				</td>
																			</tr>
																		)}

																		{/*Todo: show only if user has role ROLE_UI_SERIES_DETAILS_ACL_EDIT */}
																		{hasAccess(editAccessRole, user) && (
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
																						+{" "}
																						{t(
																							"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.NEW"
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
								</li>
							</ul>
						)}
					</div>
				</div>
			</div>
			{/* Button for navigation to next page and previous page */}
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

export default connect(mapStateToProps, mapDispatchToProps)(NewAccessPage);
