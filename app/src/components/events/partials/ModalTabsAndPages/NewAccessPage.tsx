import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
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
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
import DropDown from "../../../shared/DropDown";
import { filterRoles, getAclTemplateText } from "../../../../utils/aclUtils";
import { useAppSelector } from "../../../../store";

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
// @ts-expect-error TS(7031): Binding element 'checkAcls' implicitly has an 'any... Remove this comment to see the full error message
	checkAcls,
}) => {
	const { t } = useTranslation();

	// States containing response from server concerning acl templates, actions and roles
	const [aclTemplates, setAclTemplates] = useState([]);
	const [aclActions, setAclActions] = useState([]);
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

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
		<>
			<div className="modal-content">
				<div className="modal-body">
					<div className="full-col">
						{/* Notifications */}
						<Notifications context="not_corner" />
						{!loading && (
							<ul>
								<li>
									<div className="obj list-obj">
										<header className="no-expand">
											{t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.TITLE")}
										</header>
										<div className="obj-container">
											<p>
												{t(
													"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION"
												)}
											</p>

											{/* Template selection*/}
											<div className="obj tbl-list">
												<table className="main-tbl">
													<thead>
														<tr>
															<th>
																{t("EVENTS.SERIES.NEW.ACCESS.TEMPLATES.TITLE")}
															</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															{aclTemplates.length > 0 ? (
																<td className="editable">
																	<div className="obj-container padded">
																		{/* dropdown for selecting a policy template */}
																		<DropDown
																			value={formik.values.aclTemplate}
																			text={getAclTemplateText(
																				aclTemplates,
																				formik.values.aclTemplate
																			)}
																			options={aclTemplates}
																			type={"aclTemplate"}
																			required={true}
																			handleChange={(element) => {
																				if (element) {
																					handleTemplateChange(element.value)
																				}
																			}}
																			placeholder={t(
																				"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.LABEL"
																			)}
																			tabIndex={1}
																			autoFocus={true}
																		/>
																	</div>
																</td>
															) : (
																//Show if no option is available
																<td>
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
										<div className="obj-container">
											<div className="obj tbl-list">
												<header>
													{t(
														"EVENTS.SERIES.DETAILS.ACCESS.ACCESS_POLICY.DETAILS"
													)}
												</header>
												<div className="obj-container">
													<table className="main-tbl">
														<thead>
															<tr>
																<th>
																	{t(
																		"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.ROLE"
																	)}
																</th>
																<th className="fit">
																	{t(
																		"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.READ"
																	)}
																</th>
																<th className="fit">
																	{t(
																		"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.WRITE"
																	)}
																</th>
																{aclActions.length > 0 && (
																	<th className="fit">
																		{t(
																			"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.ADDITIONAL_ACTIONS"
																		)}
																	</th>
																)}
																<th className="fit">
																	{t(
																		"EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.ACTION"
																	)}
																</th>
															</tr>
														</thead>
														<tbody>
															{/*Add fieldArray/row for each policy in acls field*/}
															<FieldArray name="acls">
																{({ insert, remove, push }) => (
																	<>
																		{roles.length > 0 ? (
																			formik.values.acls.length > 0 &&
																			formik.values.acls.map(
// @ts-expect-error TS(7006): Parameter 'policy' implicitly has an 'any' type.
																				(policy, index) => (
																					<tr key={index}>
																						{/* dropdown for acl (/policy) role */}
																						<td className="editable">
																							<DropDown
																								value={policy.role}
																								text={policy.role}
																								options={filterRoles(
																									roles,
																									formik.values.acls
																								)}
																								type={"aclRole"}
																								required={true}
																								handleChange={(element) => {
																									if (element) {
																										formik.setFieldValue(
																											`acls.${index}.role`,
																											element.value
																										)
																									}
																								}}
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
																						<td className="fit text-center">
																							<Field
																								type="checkbox"
																								name={`acls.${index}.read`}
																							/>
																						</td>
																						<td className="fit text-center">
																							<Field
																								type="checkbox"
																								name={`acls.${index}.write`}
																							/>
																						</td>
																						{/* Show only if policy has actions*/}
																						{aclActions.length > 0 && (
																							<td className="fit editable">
																								<div>
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
																						<td>
																							<button
																								onClick={() => remove(index)}
																								className="button-like-anchor remove"
																							/>
																						</td>
																					</tr>
																				)
																			)
																		) : (
																			<tr>
																				<td>
																					{t(
																						"EVENTS.SERIES.NEW.ACCESS.ROLES.EMPTY"
																					)}
																				</td>
																			</tr>
																		)}

																		{/*Todo: show only if user has role ROLE_UI_SERIES_DETAILS_ACL_EDIT */}
																		{hasAccess(editAccessRole, user) && (
																			<tr>
																				{/*Add additional policy row*/}
																				<td colSpan={5}>
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
			<footer>
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
					tabIndex={100}
				>
					{t("WIZARD.NEXT_STEP")}
				</button>
				<button
					className="cancel"
					onClick={() => previousPage(formik.values, false)}
					tabIndex={101}
				>
					{t("WIZARD.BACK")}
				</button>
			</footer>

			<div className="btm-spacer" />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({

});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'acls' implicitly has an 'any' type.
	checkAcls: (acls) => dispatch(checkAcls(acls)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAccessPage);
