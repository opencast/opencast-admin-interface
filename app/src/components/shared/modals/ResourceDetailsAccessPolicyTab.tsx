import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../wizard/RenderMultiField' was resolved t... Remove this comment to see the full error message
import RenderMultiField from "../wizard/RenderMultiField";
import {
	fetchAclActions,
	fetchAclTemplateById,
	fetchAclTemplates,
	fetchRolesWithTarget,
} from "../../../thunks/aclThunks";
// @ts-expect-error TS(6142): Module '../Notifications' was resolved to '/home/a... Remove this comment to see the full error message
import Notifications from "../Notifications";
import { Formik, Field, FieldArray } from "formik";
import { addNotification } from "../../../thunks/notificationThunks";
import { NOTIFICATION_CONTEXT } from "../../../configs/modalConfig";
import { removeNotificationWizardForm } from "../../../actions/notificationActions";
import {
	createPolicy,
	prepareAccessPolicyRulesForPost,
} from "../../../utils/resourceUtils";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
// @ts-expect-error TS(6142): Module '../DropDown' was resolved to '/home/arnewi... Remove this comment to see the full error message
import DropDown from "../DropDown";
import { filterRoles, getAclTemplateText } from "../../../utils/aclUtils";

/**
 * This component manages the access policy tab of resource details modals
 */
const ResourceDetailsAccessPolicyTab = ({
// @ts-expect-error TS(7031): Binding element 'resourceId' implicitly has an 'an... Remove this comment to see the full error message
	resourceId,
// @ts-expect-error TS(7031): Binding element 'header' implicitly has an 'any' t... Remove this comment to see the full error message
	header,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'policies' implicitly has an 'any'... Remove this comment to see the full error message
	policies,
// @ts-expect-error TS(7031): Binding element 'fetchHasActiveTransactions' impli... Remove this comment to see the full error message
	fetchHasActiveTransactions,
// @ts-expect-error TS(7031): Binding element 'fetchAccessPolicies' implicitly h... Remove this comment to see the full error message
	fetchAccessPolicies,
// @ts-expect-error TS(7031): Binding element 'saveNewAccessPolicies' implicitly... Remove this comment to see the full error message
	saveNewAccessPolicies,
// @ts-expect-error TS(7031): Binding element 'descriptionText' implicitly has a... Remove this comment to see the full error message
	descriptionText,
// @ts-expect-error TS(7031): Binding element 'addNotification' implicitly has a... Remove this comment to see the full error message
	addNotification,
// @ts-expect-error TS(7031): Binding element 'fetchAclTemplates' implicitly has... Remove this comment to see the full error message
	fetchAclTemplates,
// @ts-expect-error TS(7031): Binding element 'fetchRoles' implicitly has an 'an... Remove this comment to see the full error message
	fetchRoles,
// @ts-expect-error TS(7031): Binding element 'removeNotificationWizardForm' imp... Remove this comment to see the full error message
	removeNotificationWizardForm,
// @ts-expect-error TS(7031): Binding element 'buttonText' implicitly has an 'an... Remove this comment to see the full error message
	buttonText,
// @ts-expect-error TS(7031): Binding element 'saveButtonText' implicitly has an... Remove this comment to see the full error message
	saveButtonText,
// @ts-expect-error TS(7031): Binding element 'editAccessRole' implicitly has an... Remove this comment to see the full error message
	editAccessRole,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'policyChanged' implicitly has an ... Remove this comment to see the full error message
	policyChanged,
// @ts-expect-error TS(7031): Binding element 'setPolicyChanged' implicitly has ... Remove this comment to see the full error message
	setPolicyChanged,
}) => {
	const baseAclId = "";

	// list of policy templates
	const [aclTemplates, setAclTemplates] = useState([]);

	// list of possible additional actions
	const [aclActions, setAclActions] = useState([]);

	// shows, whether a resource has additional actions on top of normal read and write rights
	const [hasActions, setHasActions] = useState(false);

	// list of possible roles
	const [roles, setRoles] = useState(false);

	// this state is used, because the policies should be read-only, if a transaction is currently being performed on a resource
	const [transactions, setTransactions] = useState({ read_only: false });

	// this state tracks, whether data is currently being fetched
	const [loading, setLoading] = useState(false);

	/* fetch initial values from backend */
	useEffect(() => {
		removeNotificationWizardForm();
		async function fetchData() {
			setLoading(true);
			const responseTemplates = await fetchAclTemplates();
			await setAclTemplates(responseTemplates);
			const responseActions = await fetchAclActions();
// @ts-expect-error TS(2345): Argument of type '{ id: string; value: any; }[]' i... Remove this comment to see the full error message
			setAclActions(responseActions);
			setHasActions(responseActions.length > 0);
			await fetchAccessPolicies(resourceId);
// @ts-expect-error TS(7006): Parameter 'roles' implicitly has an 'any' type.
			fetchRoles().then((roles) => setRoles(roles));
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
					addNotification(
						"warning",
						"ACTIVE_TRANSACTION",
						-1,
						null,
						NOTIFICATION_CONTEXT
					);
				}
			}
			setLoading(false);
		}

		fetchData().then((r) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* resets the formik form and hides the save and cancel buttons */
// @ts-expect-error TS(7006): Parameter 'resetFormik' implicitly has an 'any' ty... Remove this comment to see the full error message
	const resetPolicies = (resetFormik) => {
		setPolicyChanged(false);
		resetFormik();
	};

	/* transforms rules into proper format for saving and checks validity
	 * if the policies are valid, the new policies are saved in the backend */
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const saveAccess = (values) => {
		removeNotificationWizardForm();
		const { roleWithFullRightsExists, allRulesValid } = validatePolicies(
			values
		);
		const access = prepareAccessPolicyRulesForPost(values.policies);

		if (!allRulesValid) {
			addNotification(
				"warning",
				"INVALID_ACL_RULES",
				-1,
				null,
				NOTIFICATION_CONTEXT
			);
		}

		if (!roleWithFullRightsExists) {
			addNotification(
				"warning",
				"MISSING_ACL_RULES",
				-1,
				null,
				NOTIFICATION_CONTEXT
			);
		}

		if (allRulesValid && roleWithFullRightsExists) {
// @ts-expect-error TS(2693): 'any' only refers to a type, but is being used as ... Remove this comment to see the full error message
			saveNewAccessPolicies(resourceId, access: any).then((success) => {
				// fetch new policies from the backend, if save successful
				if (success) {
					setPolicyChanged(false);
					fetchAccessPolicies(resourceId);
				}
			});
		}
	};

	/* validates the policies in the formik form */
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const validateFormik = (values) => {
		const errors = {};
		setPolicyChanged(isPolicyChanged(values.policies));

		// each policy needs a role
// @ts-expect-error TS(7006): Parameter 'policy' implicitly has an 'any' type.
		if (values.policies.find((policy) => !policy.role || policy.role === "")) {
// @ts-expect-error TS(2339): Property 'emptyRole' does not exist on type '{}'.
			errors.emptyRole = "Empty role!";
		}

		return errors;
	};

	/* checks validity of the policies
	 * each policy needs a role and at least one of: read-rights, write-rights, additional action
	 * there needs to be at least one role, which has both read and write rights */
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const validatePolicies = (values) => {
		let roleWithFullRightsExists = false;
		let allRulesValid = true;

// @ts-expect-error TS(7006): Parameter 'policy' implicitly has an 'any' type.
		values.policies.forEach((policy) => {
			if (policy.read && policy.write) {
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
// @ts-expect-error TS(7006): Parameter 'newPolicies' implicitly has an 'any' ty... Remove this comment to see the full error message
	const isPolicyChanged = (newPolicies) => {
		if (newPolicies.length !== policies.length) {
			return true;
		}
// @ts-expect-error TS(7006): Parameter 'pol1' implicitly has an 'any' type.
		const sortSchema = (pol1, pol2) => {
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
// @ts-expect-error TS(7006): Parameter 'templateId' implicitly has an 'any' typ... Remove this comment to see the full error message
	const handleTemplateChange = async (templateId, setFormikFieldValue) => {
		// fetch information about chosen template from backend
		const template = await fetchAclTemplateById(templateId);

		setFormikFieldValue("policies", template);
		setFormikFieldValue("template", templateId);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
					{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<Notifications context="not_corner" />

					{!loading && !!policies && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<ul>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<Formik
									initialValues={{
										policies: policies.length > 0 ? [...policies] : [],
										template: "",
									}}
									enableReinitialize
									validate={(values) => validateFormik(values)}
									onSubmit={(values, actions) =>
// @ts-expect-error TS(2339): Property 'then' does not exist on type 'void'.
										saveAccess(values).then((r) => {})
									}
								>
									{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="obj list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<header>{t(header) /* Access Policy */}</header>

											{/* policy templates */}
											{hasAccess(editAccessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="obj-container">
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
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.ACCESS.TEMPLATES.TITLE"
																			) /* Templates */
																		}
																	</th>
																</tr>
															</thead>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<td className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<p>
																			{
																				descriptionText /* Description text for policies*/
																			}
																		</p>
																		{!transactions.read_only ? (
																			/* dropdown for selecting a policy template */
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																				handleChange={(element) =>
																					handleTemplateChange(
																						element.value,
																						formik.setFieldValue
																					)
																				}
																				placeholder={
																					!!aclTemplates &&
																					aclTemplates.length > 0
																						? t(buttonText)
																						: t(
																								"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.EMPTY"
																						  )
																				}
																				tabIndex={"1"}
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<header>
														{
															t(
																"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.DETAILS"
															) /*Details*/
														}
													</header>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<table className="main-tbl">
															{/* column headers */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th>
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.ROLE"
																			) /* <!-- Role --> */
																		}
																	</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th className="fit">
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.READ"
																			) /* <!-- Read --> */
																		}
																	</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th className="fit">
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.WRITE"
																			) /* <!-- Write --> */
																		}
																	</th>
																	{hasActions && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<th className="fit">
																			{
																				t(
																					"EVENTS.SERIES.DETAILS.ACCESS.ACCESS_POLICY.ADDITIONAL_ACTIONS"
																				) /* <!-- Additional Actions --> */
																			}
																		</th>
																	)}
																	{hasAccess(editAccessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tbody>
																{/* list of policies */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<FieldArray name="policies">
																	{({ replace, remove, push }) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<>
																			{formik.values.policies.length > 0 &&
																				formik.values.policies.map(
																					(policy, index) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<tr key={index}>
																							{/* dropdown for policy.role */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<td className="editable">
																								{!transactions.read_only ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																									<DropDown
																										value={policy.role}
																										text={policy.role}
																										options={
																											!!roles &&
// @ts-expect-error TS(2339): Property 'length' does not exist on type 'true'.
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
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																										handleChange={(element) =>
																											replace(index, {
																												...policy,
																												role: element.value,
																											})
																										}
																										placeholder={
																											!!roles &&
// @ts-expect-error TS(2339): Property 'length' does not exist on type 'true'.
																											roles.length > 0
																												? t(
																														"EVENTS.EVENTS.DETAILS.ACCESS.ROLES.LABEL"
																												  )
																												: t(
																														"EVENTS.EVENTS.DETAILS.ACCESS.ROLES.EMPTY"
																												  )
																										}
																										tabIndex={index + 1}
																										disabled={
																											!hasAccess(
																												editAccessRole,
																												user
																											)
																										}
																									/>
																								) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																									<p>{policy.role}</p>
																								)}
																							</td>

																							{/* Checkboxes for policy.read and policy.write */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<td className="fit text-center">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(7006): Parameter 'read' implicitly has an 'any' type.
																									onChange={(read) =>
																										replace(index, {
																											...policy,
																											read: read.target.checked,
																										})
																									}
																								/>
																							</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																							<td className="fit text-center">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(7006): Parameter 'write' implicitly has an 'any' type.
																									onChange={(write) =>
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																								<td className="fit editable">
																									{!transactions.read_only &&
																										hasAccess(
																											editAccessRole,
																											user
																										) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																											<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(7006): Parameter 'customAction' implicitly has an 'any' t... Remove this comment to see the full error message
																												customAction,
// @ts-expect-error TS(7006): Parameter 'actionKey' implicitly has an 'any' type... Remove this comment to see the full error message
																												actionKey
																											) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																								<td>
																									{!transactions.read_only && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																					<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<td colSpan="5">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
											{!transactions.read_only &&
												policyChanged &&
												formik.dirty && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<footer style={{ padding: "15px" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="pull-left">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<button
																type="reset"
																onClick={() => resetPolicies(formik.resetForm)}
																className="cancel"
															>
																{t("CANCEL") /* Cancel */}
															</button>
														</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="pull-right">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<button
																onClick={() => saveAccess(formik.values)}
																disabled={!formik.isValid}
																className={`save green  ${
																	!formik.isValid ? "disabled" : ""
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

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col" />
			</div>
		</div>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'type' implicitly has an 'any' type.
	addNotification: (type, key, duration, parameter, context) =>
		dispatch(addNotification(type, key, duration, parameter, context)),
	fetchRoles: () => fetchRolesWithTarget("ACL"),
	fetchAclTemplates: () => fetchAclTemplates(),
	removeNotificationWizardForm: () => dispatch(removeNotificationWizardForm()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ResourceDetailsAccessPolicyTab);
