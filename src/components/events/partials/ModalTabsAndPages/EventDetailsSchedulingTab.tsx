import React, { useEffect } from "react";
import cn from "classnames";
import _ from "lodash";
import DatePicker from "react-datepicker";
import { Formik, FormikErrors, FormikProps } from "formik";
import { Field } from "../../../shared/Field";
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
	renderValidDate,
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
	SchedulingInfo,
} from "../../../../slices/eventDetailsSlice";
import {
	removeNotificationWizardForm,
	addNotification,
} from "../../../../slices/notificationSlice";
import { Recording } from "../../../../slices/recordingSlice";
import { useTranslation } from "react-i18next";

/**
 * This component manages the main assets tab of event details modal
 */
const EventDetailsSchedulingTab = ({
	eventId,
}: {
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));
	const conflicts = useAppSelector(state => getSchedulingConflicts(state));
	const hasSchedulingProperties = useAppSelector(state => getSchedulingProperties(state));
	const source = useAppSelector(state => getSchedulingSource(state));
	const checkingConflicts = useAppSelector(state => isCheckingConflicts(state));
	const captureAgents = useAppSelector(state => getRecordings(state));

	const checkConflictsWrapper = (eventId: string, startDate: Date, endDate: Date, deviceId: string) => {
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
	const accessAllowed = (agentId: Recording["id"]) => {
		return !checkingConflicts && hasDeviceAccess(user, agentId);
	};

	// finds the inputs to be displayed in the formik
	const getInputs = (deviceId: Recording["id"]) => {
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
	const changeInputs = (deviceId: Recording["id"], setFieldValue: (field: string, value: any) => Promise<void | FormikErrors<any>>) => {
		setFieldValue("captureAgent", deviceId);
		setFieldValue("inputs", []);
	};
	const filterCaptureAgents = (agent: Recording) => {
		return agent.id === source.agentId || hasDeviceAccess(user, agent.id);
	};

	// checks validity of the formik form
	const checkValidity = (formik: FormikProps<any>) => {
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
	const submitForm = async (values: SchedulingInfo) => {
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
						parameter: undefined,
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
			scheduleStartDate: startDate.toString(),
			scheduleStartHour: source.start.hour != null ? makeTwoDigits(source.start.hour) : "",
			scheduleStartMinute: source.start.minute != null ? makeTwoDigits(source.start.minute) : "",
			scheduleDurationHours: source.duration.hour != null ? makeTwoDigits(source.duration.hour) : "",
			scheduleDurationMinutes: source.duration.minute != null ? makeTwoDigits(source.duration.minute): "",
			scheduleEndDate: endDate.toString(),
			scheduleEndHour: source.end.hour != null ? makeTwoDigits(source.end.hour): "",
			scheduleEndMinute: source.end.minute != null ? makeTwoDigits(source.end.minute): "",
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
													dateTime: renderValidDate(conflict.start),
												})}
											</td>
											<td>
												{t("dateFormats.dateTime.medium", {
													dateTime: renderValidDate(conflict.end),
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
																	selected={new Date(formik.values.scheduleStartDate)}
																	onChange={(value: Date | null) =>
																		value && changeStartDate(
																			value,
																			formik.values,
																			formik.setFieldValue,
																			eventId,
																			checkConflictsWrapper
																		)
																	}
																	dateFormat="P"
																	popperClassName="datepicker-custom"
																	className="datepicker-custom-input"
																	portalId="root"
																	locale={currentLanguage?.dateLocale}
																/>
															) : (
																<>
																	{sourceStartDate.toLocaleDateString(
																		currentLanguage ? currentLanguage.dateLocale.code : undefined
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
																			currentLanguage ? currentLanguage.dateLocale.code : undefined
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
																			currentLanguage ? currentLanguage.dateLocale.code : undefined
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
																						(agent) => agent.id === input
																					)?.value ?? ""
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
												<footer>
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
