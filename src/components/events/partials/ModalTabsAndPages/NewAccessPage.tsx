import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Notifications from "../../../shared/Notifications";
import {
	Role,
	checkAcls,
	fetchAclActions,
	fetchAclTemplateById,
	fetchAclTemplates,
	fetchRolesWithTarget,
} from "../../../../slices/aclSlice";
import { FieldArray, FormikProps } from "formik";
import { Field } from "../../../shared/Field";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
import DropDown from "../../../shared/DropDown";
import { filterRoles, getAclTemplateText } from "../../../../utils/aclUtils";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchSeriesDetailsAcls } from "../../../../slices/seriesDetailsSlice";
import { getSeriesDetailsAcl } from "../../../../selectors/seriesDetailsSelectors";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { TransformedAcl } from "../../../../slices/aclDetailsSlice";

/**
 * This component renders the access page for new events and series in the wizards.
 */
interface RequiredFormProps {
	isPartOf: string,
	acls: TransformedAcl[],
	aclTemplate: string,
	// theme: string,
}

const NewAccessPage = <T extends RequiredFormProps>({
	formik,
	nextPage,
	previousPage,
	editAccessRole,
	initEventAclWithSeriesAcl
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
	previousPage: (values: T, twoPagesBack?: boolean) => void,
	editAccessRole: string,
	initEventAclWithSeriesAcl: boolean
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	// States containing response from server concerning acl templates, actions and roles
	const [aclTemplates, setAclTemplates] = useState<{ id: string, value: string}[]>([]);
	const [aclActions, setAclActions] = useState<{ id: string, value: string}[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const seriesAcl = useAppSelector(state => getSeriesDetailsAcl(state));

	useEffect(() => {
		// fetch data about roles, acl templates and actions from backend
		async function fetchData() {
			setLoading(true);
			const responseTemplates = await fetchAclTemplates();
			setAclTemplates(responseTemplates);
			const responseActions = await fetchAclActions();
			setAclActions(responseActions);
			const responseRoles = await fetchRolesWithTarget("ACL");
			setRoles(responseRoles);
			setLoading(false);
		}

		fetchData();
	}, []);

	// If we have to use series ACL, fetch it
	useEffect(() => {
		if (initEventAclWithSeriesAcl && formik.values.isPartOf) {
			dispatch(fetchSeriesDetailsAcls(formik.values.isPartOf));
		}
	}, [formik.values.isPartOf, initEventAclWithSeriesAcl, dispatch]);

	// If we have to use series ACL, overwrite existing rules
	useEffect(() => {
		if (initEventAclWithSeriesAcl && formik.values.isPartOf && seriesAcl) {
			formik.setFieldValue("acls", seriesAcl)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initEventAclWithSeriesAcl, seriesAcl]);

	const handleTemplateChange = async (value: string) => {
		// fetch information about chosen template from backend
		let template = await fetchAclTemplateById(value);

		// always add current user to acl since template could lock the user out
		template = template.concat({
			role: user.userRole,
			read: true,
			write: true,
			actions: [],
		});

		formik.setFieldValue("aclTemplate", value);
		formik.setFieldValue("acls", template);
		await dispatch(checkAcls(formik.values.acls));
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
																							dispatch(checkAcls(formik.values.acls));
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
			<WizardNavigationButtons
				formik={formik}
				nextPage={async () => {
					if (await dispatch(checkAcls(formik.values.acls))) {
						nextPage(formik.values);
					}
				}}
				previousPage={previousPage}
			/>

			<div className="btm-spacer" />
		</>
	);
};

export default NewAccessPage;
