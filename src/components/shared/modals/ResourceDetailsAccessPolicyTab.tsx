import React, { useState, useEffect } from "react";
import RenderMultiField from "../wizard/RenderMultiField";
import {
	Role,
	fetchAclActions,
	fetchAclTemplateById,
	fetchAclTemplates,
	fetchRolesWithTarget,
} from "../../../slices/aclSlice";
import Notifications from "../Notifications";
import { Formik, Field, FieldArray, FormikErrors } from "formik";
import { NOTIFICATION_CONTEXT } from "../../../configs/modalConfig";
import {
	createPolicy,
	prepareAccessPolicyRulesForPost,
} from "../../../utils/resourceUtils";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import DropDown from "../DropDown";
import { filterRoles, getAclTemplateText } from "../../../utils/aclUtils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { removeNotificationWizardForm, addNotification } from "../../../slices/notificationSlice";
import { useTranslation } from "react-i18next";
import { Ace, TransformedAcl } from "../../../slices/aclDetailsSlice";

/**
 * This component manages the access policy tab of resource details modals
 */
const ResourceDetailsAccessPolicyTab = ({
	resourceId,
	header,
	policies,
	fetchHasActiveTransactions,
	fetchAccessPolicies,
	saveNewAccessPolicies,
	descriptionText,
	buttonText,
	saveButtonText,
	editAccessRole,
	policyChanged,
	setPolicyChanged,
}: {
	resourceId: string,
	header: string,
	policies: TransformedAcl[],
	fetchHasActiveTransactions?: (id: string) => Promise<any>,
	fetchAccessPolicies: (id: string) => void,
	saveNewAccessPolicies: (id: string, policies: { acl: { ace: Ace[] } }) => Promise<any>,
	descriptionText: string,
	buttonText: string,
	saveButtonText: string,
	editAccessRole: string,
	policyChanged: boolean,
	setPolicyChanged: (value: boolean) => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const baseAclId = "";

	// list of policy templates
	const [aclTemplates, setAclTemplates] = useState<{ id: string, value: string }[]>([]);

	// list of possible additional actions
	const [aclActions, setAclActions] = useState<{ id: string, value: string }[]>([]);

	// shows, whether a resource has additional actions on top of normal read and write rights
	const [hasActions, setHasActions] = useState(false);

	// list of possible roles
	const [roles, setRoles] = useState<Role[]>([]);

	// this state is used, because the policies should be read-only, if a transaction is currently being performed on a resource
	const [transactions, setTransactions] = useState({ read_only: false });

	// this state tracks, whether data is currently being fetched
	const [loading, setLoading] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	/* fetch initial values from backend */
	useEffect(() => {
		dispatch(removeNotificationWizardForm());
		async function fetchData() {
			setLoading(true);
			const responseTemplates = await fetchAclTemplates();
			await setAclTemplates(responseTemplates);
			const responseActions = await fetchAclActions();
			setAclActions(responseActions);
			setHasActions(responseActions.length > 0);
			await fetchAccessPolicies(resourceId);
			fetchRolesWithTarget("ACL").then((roles) => setRoles(roles));
			if (fetchHasActiveTransactions) {
				const fetchTransactionResult = await fetchHasActiveTransactions(
					resourceId
				);
				fetchTransactionResult.active !== undefined
					? setTransactions({ read_only: fetchTransactionResult.active })
					: setTransactions({ read_only: true });
				if (
					fetchTransactionResult.active === undefined ||
					fetchTransactionResult.active
				) {
					dispatch(addNotification({
						type: "warning",
						key: "ACTIVE_TRANSACTION",
						duration: -1,
						parameter: null,
						context: NOTIFICATION_CONTEXT
					}));
				}
			}
			setLoading(false);
		}

		fetchData().then((r) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* resets the formik form and hides the save and cancel buttons */
	const resetPolicies = (resetFormik: () => void) => {
		setPolicyChanged(false);
		resetFormik();
	};

	/* transforms rules into proper format for saving and checks validity
	 * if the policies are valid, the new policies are saved in the backend */
	const saveAccess = (values: { policies: TransformedAcl[] }) => {
		dispatch(removeNotificationWizardForm());
		const { roleWithFullRightsExists, allRulesValid } = validatePolicies(
			values
		);
		const access = prepareAccessPolicyRulesForPost(values.policies);

		if (!allRulesValid) {
			dispatch(addNotification({
				type: "warning",
				key: "INVALID_ACL_RULES",
				duration: -1,
				parameter: null,
				context: NOTIFICATION_CONTEXT
			}));
		}

		if (!roleWithFullRightsExists) {
			dispatch(addNotification({
				type: "warning",
				key: "MISSING_ACL_RULES",
				duration: -1,
				parameter: null,
				context: NOTIFICATION_CONTEXT
			}));
		}

		if (allRulesValid && roleWithFullRightsExists) {
			saveNewAccessPolicies(resourceId, access).then((success) => {
				// fetch new policies from the backend, if save successful
				if (success) {
					setPolicyChanged(false);
					fetchAccessPolicies(resourceId);
				}
			});
		}
	};

	/* validates the policies in the formik form */
	const validateFormik = (values: { policies: TransformedAcl[] }) => {
		const errors: FormikErrors<{ emptyRole: string }> = {};
		setPolicyChanged(isPolicyChanged(values.policies));

		// each policy needs a role
		if (values.policies.find((policy) => !policy.role || policy.role === "")) {
			errors.emptyRole = "Empty role!";
		}

		return errors;
	};

	/* checks validity of the policies
	 * each policy needs a role and at least one of: read-rights, write-rights, additional action
	 * if not admin, there needs to be at least one role, which has both read and write rights */
	const validatePolicies = (values: { policies: TransformedAcl[] }) => {
		let roleWithFullRightsExists = false;
		let allRulesValid = true;

		values.policies.forEach((policy) => {
			if (policy.read && policy.write || user.isAdmin) {
				roleWithFullRightsExists = true;
			}

			if (
				(!policy.read && !policy.write && policy.actions.length === 0) ||
				!policy.role ||
				policy.role === ""
			) {
				allRulesValid = false;
			}
		});

		return { roleWithFullRightsExists, allRulesValid };
	};

	/* checks whether the current state of the policies from the formik is different form the
	 * initial policies or equal to them */
	const isPolicyChanged = (newPolicies: TransformedAcl[]) => {
		if (newPolicies.length !== policies.length) {
			return true;
		}
		const sortSchema = (pol1: TransformedAcl, pol2: TransformedAcl) => {
			return pol1.role > pol2.role ? 1 : -1;
		};
		const sortedNewPolicies = [...newPolicies].sort(sortSchema);
		const sortedInitialPolicies = [...policies].sort(sortSchema);
		for (let i = 0; i < sortedNewPolicies.length; i++) {
			if (
				sortedNewPolicies[i].role !== sortedInitialPolicies[i].role ||
				sortedNewPolicies[i].read !== sortedInitialPolicies[i].read ||
				sortedNewPolicies[i].write !== sortedInitialPolicies[i].write ||
				sortedNewPolicies[i].actions.length !==
					sortedInitialPolicies[i].actions.length
			) {
				return true;
			}
			if (
				sortedNewPolicies[i].actions.length > 0 &&
				sortedNewPolicies[i].actions.length ===
					sortedInitialPolicies[i].actions.length
			) {
				for (let j = 0; j < sortedNewPolicies[i].actions.length; j++) {
					if (
						sortedNewPolicies[i].actions[j] !==
						sortedInitialPolicies[i].actions[j]
					) {
						return true;
					}
				}
			}
		}
		return false;
	};

	/* fetches the policies for the chosen template and sets the policies in the formik form to those policies */
	const handleTemplateChange = async (templateId: string, setFormikFieldValue: (field: string, value: any) => Promise<any>) => {
		// fetch information about chosen template from backend
		let template = await fetchAclTemplateById(templateId);

		// always add current user to acl since template could lock the user out
		template = template.concat({
			role: user.userRole,
			read: true,
			write: true,
			actions: [],
		});

		setFormikFieldValue("policies", template);
		setFormikFieldValue("template", templateId);
	};

	return (
		<div className="modal-content">
			<div className="modal-body">
				<div className="full-col">
					{/* Notifications */}
					<Notifications context="not_corner" />

					{!loading && !!policies && (
						<ul>
							<li>
								<Formik
									initialValues={{
										policies: policies.length > 0 ? [...policies] : [],
										template: "",
									}}
									enableReinitialize
									validate={(values) => validateFormik(values)}
									onSubmit={(values) =>
										saveAccess(values)
									}
								>
									{(formik) => (
										<div className="obj list-obj">
											<header>{t(header) /* Access Policy */}</header>

											{/* policy templates */}
											{hasAccess(editAccessRole, user) && (
												<div className="obj-container">
													<div className="obj tbl-list">
														<table className="main-tbl">
															<thead>
																<tr>
																	<th>
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.ACCESS.TEMPLATES.TITLE"
																			) /* Templates */
																		}
																	</th>
																</tr>
															</thead>

															<tbody>
																<tr>
																	<td className="editable">
																		<p>
																			{
																				descriptionText /* Description text for policies*/
																			}
																		</p>
																		{!transactions.read_only ? (
																			/* dropdown for selecting a policy template */
																			<DropDown
																				value={formik.values.template}
																				text={getAclTemplateText(
																					aclTemplates,
																					formik.values.template
																				)}
																				options={
																					!!aclTemplates ? aclTemplates : []
																				}
																				type={"aclTemplate"}
																				required={true}
																				handleChange={(element) => {
																						if (element) {
																						handleTemplateChange(
																							element.value,
																							formik.setFieldValue
																						)
																					}
																				}}
																				placeholder={
																					!!aclTemplates &&
																					aclTemplates.length > 0
																						? t(buttonText)
																						: t(
																								"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.EMPTY"
																						  )
																				}
																			/>
																		) : (
																			baseAclId
																		)}
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											)}

											{/* list of policy details and interface for changing them */}
											<div className="obj-container">
												<div className="obj tbl-list">
													<header>
														{
															t(
																"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.DETAILS"
															) /*Details*/
														}
													</header>

													<div className="obj-container">
														<table className="main-tbl">
															{/* column headers */}
															<thead>
																<tr>
																	<th>
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.ROLE"
																			) /* <!-- Role --> */
																		}
																	</th>
																	<th className="fit">
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.READ"
																			) /* <!-- Read --> */
																		}
																	</th>
																	<th className="fit">
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.WRITE"
																			) /* <!-- Write --> */
																		}
																	</th>
																	{hasActions && (
																		<th className="fit">
																			{
																				t(
																					"EVENTS.SERIES.DETAILS.ACCESS.ACCESS_POLICY.ADDITIONAL_ACTIONS"
																				) /* <!-- Additional Actions --> */
																			}
																		</th>
																	)}
																	{hasAccess(editAccessRole, user) && (
																		<th className="fit">
																			{
																				t(
																					"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.ACTION"
																				) /* <!-- Action --> */
																			}
																		</th>
																	)}
																</tr>
															</thead>

															<tbody>
																{/* list of policies */}
																<FieldArray name="policies">
																	{({ replace, remove, push }) => (
																		<>
																			{formik.values.policies.length > 0 &&
																				formik.values.policies.map(
																					(policy, index) => (
																						<tr key={index}>
																							{/* dropdown for policy.role */}
																							<td className="editable">
																								{!transactions.read_only ? (
																									<DropDown
																										value={policy.role}
																										text={policy.role}
																										options={
																											roles.length > 0
																												? filterRoles(
																														roles,
																														formik.values
																															.policies
																												  )
																												: []
																										}
																										type={"aclRole"}
																										required={true}
																										handleChange={(element) => {
																											if (element) {
																												replace(index, {
																													...policy,
																													role: element.value,
																												})
																											}
																										}}
																										placeholder={
																											roles.length > 0
																												? t(
																														"EVENTS.EVENTS.DETAILS.ACCESS.ROLES.LABEL"
																												  )
																												: t(
																														"EVENTS.EVENTS.DETAILS.ACCESS.ROLES.EMPTY"
																												  )
																										}
																										disabled={
																											!hasAccess(
																												editAccessRole,
																												user
																											)
																										}
																									/>
																								) : (
																									<p>{policy.role}</p>
																								)}
																							</td>

																							{/* Checkboxes for policy.read and policy.write */}
																							<td className="fit text-center">
																								<Field
																									type="checkbox"
																									name={`policies.${index}.read`}
																									disabled={
																										transactions.read_only ||
																										!hasAccess(
																											editAccessRole,
																											user
																										)
																									}
																									className={`${
																										transactions.read_only
																											? "disabled"
																											: "false"
																									}`}
																									onChange={(read: React.ChangeEvent<HTMLInputElement>) =>
																										replace(index, {
																											...policy,
																											read: read.target.checked,
																										})
																									}
																								/>
																							</td>
																							<td className="fit text-center">
																								<Field
																									type="checkbox"
																									name={`policies.${index}.write`}
																									disabled={
																										transactions.read_only ||
																										!hasAccess(
																											editAccessRole,
																											user
																										)
																									}
																									className={`${
																										transactions.read_only
																											? "disabled"
																											: "false"
																									}`}
																									onChange={(write: React.ChangeEvent<HTMLInputElement>) =>
																										replace(index, {
																											...policy,
																											write:
																												write.target.checked,
																										})
																									}
																								/>
																							</td>

																							{/* Multi value field for policy.actions (additional actions) */}
																							{hasActions && (
																								<td className="fit editable">
																									{!transactions.read_only &&
																										hasAccess(
																											editAccessRole,
																											user
																										) && (
																											<div>
																												<Field
																													fieldInfo={{
																														id: `policies.${index}.actions`,
																														type: "mixed_text",
																														collection: aclActions,
																													}}
																													onlyCollectionValues
																													name={`policies.${index}.actions`}
																													component={
																														RenderMultiField
																													}
																												/>
																											</div>
																										)}
																									{(transactions.read_only ||
																										!hasAccess(
																											editAccessRole,
																											user
																										)) &&
																										policy.actions.map(
																											(
																												customAction,
																												actionKey
																											) => (
																												<div key={actionKey}>
																													{customAction}
																												</div>
																											)
																										)}
																								</td>
																							)}

																							{/* Remove policy */}
																							{hasAccess(
																								editAccessRole,
																								user
																							) && (
																								<td>
																									{!transactions.read_only && (
																										<button
																											onClick={() =>
																												remove(index)
																											}
																											className="button-like-anchor remove"
																										/>
																									)}
																								</td>
																							)}
																						</tr>
																					)
																				)}

																			{/* create additional policy */}
																			{!transactions.read_only &&
																				hasAccess(editAccessRole, user) && (
																					<tr>
																						<td colSpan={5}>
																							<button
																								onClick={() =>
																									push(createPolicy(""))
																								}
                                                className="button-like-anchor"
																							>
																								+{" "}
																								{t(
																									"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.NEW"
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

											{/* Save and cancel buttons */}
											{!transactions.read_only && (
												<footer style={{ padding: "0 15px" }}>
													{policyChanged &&
														formik.dirty && (
														<div className="pull-left">
															<button
																type="reset"
																onClick={() => resetPolicies(formik.resetForm)}
																className="cancel"
															>
																{t("CANCEL") /* Cancel */}
															</button>
														</div>
													)}
													<div className="pull-right">
														<button
															onClick={() => saveAccess(formik.values)}
															disabled={!formik.isValid || !(policyChanged && formik.dirty)}
															className={`save green  ${
																!formik.isValid || !(policyChanged && formik.dirty) ? "disabled" : ""
															}`}
														>
															{t(saveButtonText) /* Save */}
														</button>
													</div>
												</footer>
												)}
										</div>
									)}
								</Formik>
							</li>
						</ul>
					)}
				</div>

				<div className="full-col" />
			</div>
		</div>
	);
};

export default ResourceDetailsAccessPolicyTab;
