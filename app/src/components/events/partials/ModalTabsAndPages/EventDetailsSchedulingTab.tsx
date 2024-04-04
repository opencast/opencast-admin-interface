import React, { useEffect } from "react";
import cn from "classnames";
import _ from "lodash";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Field, Formik } from "formik";
import Notifications from "../../../shared/Notifications";
import {
	getSchedulingConflicts,
	getSchedulingProperties,
	getSchedulingSource,
	isCheckingConflicts,
} from "../../../../selectors/eventDetailsSelectors";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { getRecordings } from "../../../../selectors/recordingSelectors";
import {
	getCurrentLanguageInformation,
	getTimezoneOffset,
	getTimezoneString,
	hasAccess,
	makeTwoDigits,
} from "../../../../utils/utils";
import {
	changeDurationHour,
	changeDurationMinute,
	changeEndHour,
	changeEndMinute,
	changeStartDate,
	changeStartHour,
	changeStartMinute,
	makeDate,
} from "../../../../utils/dateUtils";
import { hours, minutes } from "../../../../configs/modalConfig";
import {
	filterDevicesForAccess,
	hasDeviceAccess,
} from "../../../../utils/resourceUtils";
import { NOTIFICATION_CONTEXT } from "../../../../configs/modalConfig";
import DropDown from "../../../shared/DropDown";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	checkConflicts,
	saveSchedulingInfo,
} from "../../../../slices/eventDetailsSlice";
import {
	removeNotificationWizardForm,
	addNotification,
} from "../../../../slices/notificationSlice";

/**
 * This component manages the main assets tab of event details modal
 */
const EventDetailsSchedulingTab = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
}) => {
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));
	const conflicts = useAppSelector(state => getSchedulingConflicts(state));
	const hasSchedulingProperties = useAppSelector(state => getSchedulingProperties(state));
	const source = useAppSelector(state => getSchedulingSource(state));
	const checkingConflicts = useAppSelector(state => isCheckingConflicts(state));
	const captureAgents = useAppSelector(state => getRecordings(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const checkConflictsWrapper = (eventId: any, startDate: any, endDate: any, deviceId: any) => {
		dispatch(checkConflicts({eventId, startDate, endDate, deviceId}));
	}

	const sourceStartDate = new Date(source.start.date);
	const endStartDate = new Date(source.start.date);

	useEffect(() => {
		dispatch(removeNotificationWizardForm());
		dispatch(checkConflicts({
			eventId,
			startDate: sourceStartDate,
			endDate: endStartDate,
			deviceId: source.device.id
		})).then();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Get info about the current language and its date locale
	const currentLanguage = getCurrentLanguageInformation();

	// Get timezone offset; Checks should be performed on UTC times
	const offset = getTimezoneOffset();

	// Set timezone
	const tz = getTimezoneString(offset);

	// Variable and function for checking access rights
	const hasAccessRole = hasAccess(
		"ROLE_UI_EVENTS_DETAILS_SCHEDULING_EDIT",
		user
	);
// @ts-expect-error TS(7006): Parameter 'agentId' implicitly has an 'any' type.
	const accessAllowed = (agentId) => {
		return !checkingConflicts && hasDeviceAccess(user, agentId);
	};

	// finds the inputs to be displayed in the formik
// @ts-expect-error TS(7006): Parameter 'deviceId' implicitly has an 'any' type.
	const getInputs = (deviceId) => {
		if (deviceId === source.device.id) {
			return !!source.device.inputs ? source.device.inputs : [];
		} else {
			for (const agent of filterDevicesForAccess(user, captureAgents)) {
				if (agent.id === deviceId) {
					return !!agent.inputs ? agent.inputs : [];
				}
			}
			return [];
		}
	};

	// changes the inputs in the formik
// @ts-expect-error TS(7006): Parameter 'deviceId' implicitly has an 'any' type.
	const changeInputs = (deviceId, setFieldValue) => {
		setFieldValue("captureAgent", deviceId);
		setFieldValue("inputs", []);
	};
// @ts-expect-error TS(7006): Parameter 'agent' implicitly has an 'any' type.
	const filterCaptureAgents = (agent) => {
		return agent.id === source.agentId || hasDeviceAccess(user, agent.id);
	};

	// checks validity of the formik form
// @ts-expect-error TS(7006): Parameter 'formik' implicitly has an 'any' type.
	const checkValidity = (formik) => {
		if (
			formik.dirty &&
			formik.isValid &&
			hasAccessRole &&
			accessAllowed(formik.values.captureAgent) &&
			!(conflicts.length > 0)
		) {
			// check if user provided values differ from initial ones
			if (!_.isEqual(formik.values, formik.initialValues)) {
				if (!_.isEqual(formik.values.inputs, formik.initialValues.inputs)) {
					return !_.isEqual(
						formik.values.inputs.sort(),
						formik.initialValues.inputs.sort()
					);
				} else {
					return true;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	// submits the formik form
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const submitForm = async (values) => {
		dispatch(removeNotificationWizardForm());
		const startDate = makeDate(
			values.scheduleStartDate,
			values.scheduleStartHour,
			values.scheduleStartMinute
		);
		const endDate = makeDate(
			values.scheduleEndDate,
			values.scheduleEndHour,
			values.scheduleEndMinute
		);
		dispatch(checkConflicts({eventId, startDate, endDate, deviceId: values.captureAgent})).then(
			(r) => {
				if (r) {
					dispatch(saveSchedulingInfo({eventId, values, startDate, endDate})).then();
				} else {
					dispatch(addNotification({
						type: "error",
						key: "EVENTS_NOT_UPDATED",
						duration: -1,
						parameter: null,
						context: NOTIFICATION_CONTEXT
					}));
				}
			}
		);
	};

	// initial values of the formik form
	const getInitialValues = () => {
		const startDate = new Date(source.start.date);
		const endDate = new Date(source.end.date);

		const inputs = !!source.device.inputMethods
			? Array.from(source.device.inputMethods)
			: [];

		return {
			scheduleStartDate: startDate.setHours(0, 0, 0),
			scheduleStartHour: source.start.hour ? makeTwoDigits(source.start.hour) : "",
			scheduleStartMinute: source.start.minute ? makeTwoDigits(source.start.minute) : "",
			scheduleDurationHours: source.duration.hour ? makeTwoDigits(source.duration.hour) : "",
			scheduleDurationMinutes: source.duration.minute ? makeTwoDigits(source.duration.minute): "",
			scheduleEndDate: endDate.setHours(0, 0, 0),
			scheduleEndHour: source.end.hour ? makeTwoDigits(source.end.hour): "",
			scheduleEndMinute: source.end.minute ? makeTwoDigits(source.end.minute): "",
			captureAgent: source.device.name,
			inputs: inputs.filter((input) => input !== ""),
		};
	};

	return (
		<div className="modal-content">
			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				<div className="full-col">
					{
						/*list of scheduling conflicts*/
						conflicts.length > 0 && (
							<table className="main-tbl scheduling-conflict">
								<tbody>
									{conflicts.map((conflict, key) => (
										<tr key={key}>
											<td>{conflict.title}</td>
											<td>
												{t("dateFormats.dateTime.medium", {
													dateTime: new Date(conflict.start),
												})}
											</td>
											<td>
												{t("dateFormats.dateTime.medium", {
													dateTime: new Date(conflict.end),
												})}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)
					}

					{
						/* Scheduling configuration */
						hasSchedulingProperties && (
						/* Initialize form */
							<Formik
								enableReinitialize
								initialValues={getInitialValues()}
								onSubmit={(values) => submitForm(values).then((r) => {})}
							>
								{(formik) => (
									<div className="obj tbl-details">
										<header>
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.SCHEDULING.CAPTION"
													) /* Scheduling configuration */
												}
											</span>
										</header>
										<div className="obj-container">
											<table className="main-tbl">
												<tbody>
													{/* time zone */}
													<tr>
														<td>
															{t(
																"EVENTS.EVENTS.DETAILS.SOURCE.DATE_TIME.TIMEZONE"
															)}
														</td>
														<td>{tz}</td>
													</tr>

													{/* start date */}
													<tr>
														<td>
															{t(
																"EVENTS.EVENTS.DETAILS.SOURCE.DATE_TIME.START_DATE"
															)}
														</td>
														<td>
															{hasAccessRole &&
															accessAllowed(formik.values.captureAgent) ? (
																/* date picker for start date */
																<DatePicker
																	name="scheduleStartDate"
																	tabIndex={1}
																	value={new Date(formik.values.scheduleStartDate)}
																	onChange={(value: Date) =>
																		changeStartDate(
																			value,
																			formik.values,
																			formik.setFieldValue,
																			eventId,
																			checkConflictsWrapper
																		)
																	}
																/>
															) : (
																<>
																	{sourceStartDate.toLocaleDateString(
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
																		currentLanguage.dateLocale.code
																	)}
																</>
															)}
														</td>
													</tr>

													{/* start time */}
													<tr>
														<td>
															{t(
																"EVENTS.EVENTS.DETAILS.SOURCE.DATE_TIME.START_TIME"
															)}
														</td>
														{hasAccessRole && (
															<td className="editable">
																{/* drop-down for hour
																	*
																	* This is the second input field.
																	*/}
																<DropDown
																	value={formik.values.scheduleStartHour}
																	text={formik.values.scheduleStartHour}
																	options={hours}
																	type={"time"}
																	required={true}
																	handleChange={(element) => {
																		if (element) {
																			changeStartHour(
																				element.value,
																				formik.values,
																				formik.setFieldValue,
																				eventId,
																				checkConflictsWrapper
																			)
																		}
																	}}
																	placeholder={t(
																		"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.HOUR"
																	)}
																	tabIndex={2}
																	disabled={
																		!accessAllowed(formik.values.captureAgent)
																	}
																/>

																{/* drop-down for minute
																	*
																	* This is the third input field.
																	*/}
																<DropDown
																	value={formik.values.scheduleStartMinute}
																	text={formik.values.scheduleStartMinute}
																	options={minutes}
																	type={"time"}
																	required={true}
																	handleChange={(element) => {
																		if (element) {
																			changeStartMinute(
																				element.value,
																				formik.values,
																				formik.setFieldValue,
																				eventId,
																				checkConflictsWrapper
																			)
																		}
																	}}
																	placeholder={t(
																		"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.MINUTE"
																	)}
																	tabIndex={3}
																	disabled={
																		!accessAllowed(formik.values.captureAgent)
																	}
																/>
															</td>
														)}
														{!hasAccessRole && (
															<td>
																{source.start.hour ? makeTwoDigits(source.start.hour) : ""}:
																{source.start.minute ? makeTwoDigits(source.start.minute) : ""}
															</td>
														)}
													</tr>

													{/* duration */}
													<tr>
														<td>
															{t(
																"EVENTS.EVENTS.DETAILS.SOURCE.DATE_TIME.DURATION"
															)}
														</td>
														{hasAccessRole && (
															<td className="editable">
																{/* drop-down for hour
																	*
																	* This is the fourth input field.
																	*/}
																<DropDown
																	value={formik.values.scheduleDurationHours}
																	text={formik.values.scheduleDurationHours}
																	options={hours}
																	type={"time"}
																	required={true}
																	handleChange={(element) => {
																		if (element) {
																			changeDurationHour(
																				element.value,
																				formik.values,
																				formik.setFieldValue,
																				eventId,
																				checkConflictsWrapper
																			)
																		}
																	}}
																	placeholder={t("WIZARD.DURATION.HOURS")}
																	tabIndex={4}
																	disabled={
																		!accessAllowed(formik.values.captureAgent)
																	}
																/>

																{/* drop-down for minute
																	*
																	* This is the fifth input field.
																	*/}
																<DropDown
																	value={
																		formik.values.scheduleDurationMinutes
																	}
																	text={formik.values.scheduleDurationMinutes}
																	options={minutes}
																	type={"time"}
																	required={true}
																	handleChange={(element) => {
																		if (element) {
																			changeDurationMinute(
																				element.value,
																				formik.values,
																				formik.setFieldValue,
																				eventId,
																				checkConflictsWrapper
																			)
																		}
																	}}
																	placeholder={t("WIZARD.DURATION.MINUTES")}
																	tabIndex={5}
																	disabled={
																		!accessAllowed(formik.values.captureAgent)
																	}
																/>
															</td>
														)}
														{!hasAccessRole && (
															<td>
																{source.duration.hour ? makeTwoDigits(source.duration.hour) : ""}:
																{source.duration.minute ? makeTwoDigits(source.duration.minute) : ""}
															</td>
														)}
													</tr>

													{/* end time */}
													<tr>
														<td>
															{t(
																"EVENTS.EVENTS.DETAILS.SOURCE.DATE_TIME.END_TIME"
															)}
														</td>
														{hasAccessRole && (
															<td className="editable">
																{/* drop-down for hour
																	*
																	* This is the sixth input field.
																	*/}
																<DropDown
																	value={formik.values.scheduleEndHour}
																	text={formik.values.scheduleEndHour}
																	options={hours}
																	type={"time"}
																	required={true}
																	handleChange={(element) => {
																		if (element) {
																			changeEndHour(
																				element.value,
																				formik.values,
																				formik.setFieldValue,
																				eventId,
																				checkConflictsWrapper
																			)
																		}
																	}}
																	placeholder={t(
																		"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.HOUR"
																	)}
																	tabIndex={6}
																	disabled={
																		!accessAllowed(formik.values.captureAgent)
																	}
																/>

																{/* drop-down for minute
																	*
																	* This is the seventh input field.
																	*/}
																<DropDown
																	value={formik.values.scheduleEndMinute}
																	text={formik.values.scheduleEndMinute}
																	options={minutes}
																	type={"time"}
																	required={true}
																	handleChange={(element) => {
																		if (element) {
																			changeEndMinute(
																				element.value,
																				formik.values,
																				formik.setFieldValue,
																				eventId,
																				checkConflictsWrapper
																			)
																		}
																	}}
																	placeholder={t(
																		"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.MINUTE"
																	)}
																	tabIndex={7}
																	disabled={
																		!accessAllowed(formik.values.captureAgent)
																	}
																/>

																{/* display end date if on different day to start date */}
																{formik.values.scheduleEndDate.toString() !==
																	formik.values.scheduleStartDate.toString() && (
																	<span style={{ marginLeft: "10px" }}>
																		{new Date(
																			formik.values.scheduleEndDate
																		).toLocaleDateString(
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
																			currentLanguage.dateLocale.code
																		)}
																	</span>
																)}
															</td>
														)}
														{!hasAccessRole && (
															<td>
																{source.end.hour ? makeTwoDigits(source.end.hour) : ""}:
																{source.end.minute ? makeTwoDigits(source.end.minute) : ""}
																{formik.values.scheduleEndDate.toString() !==
																	formik.values.scheduleStartDate.toString() && (
																	<span>
																		{new Date(
																			formik.values.scheduleEndDate
																		).toLocaleDateString(
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
																			currentLanguage.dateLocale.code
																		)}
																	</span>
																)}
															</td>
														)}
													</tr>

													{/* capture agent (aka. room or location) */}
													<tr>
														<td>
															{t(
																"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.LOCATION"
															)}
														</td>
														{hasAccessRole && (
															<td className="editable">
																{/* drop-down for capture agents (aka. rooms or locations)
																	*
																	* This is the eighth input field.
																	*/}
																<DropDown
																	value={formik.values.captureAgent}
																	text={formik.values.captureAgent}
																	options={filterDevicesForAccess(
																		user,
																		captureAgents
// @ts-expect-error TS(7006): Parameter 'a' implicitly has an 'any' type.
																	).filter((a) => filterCaptureAgents(a))}
																	type={"captureAgent"}
																	required={true}
																	handleChange={(element) => {
																		if (element) {
																			changeInputs(
																				element.value,
																				formik.setFieldValue
																			)
																		}
																	}}
																	placeholder={t(
																		"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.LOCATION"
																	)}
																	tabIndex={8}
																	disabled={
																		!accessAllowed(formik.values.captureAgent)
																	}
																/>
															</td>
														)}
														{!hasAccessRole && <td>{source.device.name}</td>}
													</tr>

													{/* inputs */}
													<tr>
														<td>
															{t(
																"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.INPUTS"
															)}
														</td>
														<td>
															{!!formik.values.captureAgent &&
																!!getInputs(formik.values.captureAgent) &&
																getInputs(formik.values.captureAgent).length >
																	0 &&
																(hasAccessRole &&
																accessAllowed(formik.values.captureAgent)
																	? /* checkboxes for available inputs
																			*
																			* These are the input fields starting at 8.
																			*/
																		getInputs(formik.values.captureAgent).map(
// @ts-expect-error TS(7006): Parameter 'inputMethod' implicitly has an 'any' ty... Remove this comment to see the full error message
																			(inputMethod, key) => (
																				<label key={key}>
																					<Field
																						name="inputs"
																						type="checkbox"
																						tabIndex={8 + key}
																						value={inputMethod.id}
																					/>
																					{t(inputMethod.value)}
																				</label>
																			)
																		)
																	: formik.values.inputs.map((input, key) => (
																			<span key={key}>
																				{t(
																					getInputs(
																						formik.values.captureAgent
																					).find(
// @ts-expect-error TS(7006): Parameter 'agent' implicitly has an 'any' type.
																						(agent) => agent.id === input
																					).value
																				)}
																				<br />
																			</span>
																		)))}
														</td>
													</tr>
												</tbody>
											</table>
										</div>

										{/* Save and cancel buttons */}
										{formik.dirty && (
											<>
												{/* Render buttons for updating scheduling */}
												<footer style={{ padding: "15px" }}>
													<button
														type="submit"
														onClick={() => formik.handleSubmit()}
														disabled={!checkValidity(formik)}
														className={cn("submit", {
															active: checkValidity(formik),
															inactive: !checkValidity(formik),
														})}
													>
														{t("SAVE") /* Save */}
													</button>
													<button
														className="cancel"
														onClick={() => {
															formik.resetForm({
																values: getInitialValues(),
															});
														}}
													>
														{t("CANCEL") /* Cancel */}
													</button>
												</footer>

												<div className="btm-spacer" />
											</>
										)}
									</div>
								)}
							</Formik>
						)
					}
				</div>
			</div>
		</div>
	);
};

export default EventDetailsSchedulingTab;
