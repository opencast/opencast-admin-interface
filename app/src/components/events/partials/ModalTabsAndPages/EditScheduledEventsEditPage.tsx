import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { connect } from "react-redux";
import { Field, FieldArray } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderField' was re... Remove this comment to see the full error message
import RenderField from "../../../shared/wizard/RenderField";
import { getTimezoneOffset, hasAccess } from "../../../../utils/utils";
import { hours, minutes, weekdays } from "../../../../configs/modalConfig";
import {
	checkForSchedulingConflicts,
	fetchScheduling,
} from "../../../../thunks/eventThunks";
import { addNotification } from "../../../../thunks/notificationThunks";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import {
	getSchedulingSeriesOptions,
	isLoadingScheduling,
} from "../../../../selectors/eventSelectors";
import { checkSchedulingConflicts } from "../../../../utils/bulkActionUtils";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
import DropDown from "../../../shared/DropDown";

/**
 * This component renders the edit page for scheduled events of the corresponding bulk action
 */
const EditScheduledEventsEditPage = ({
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'inputDevices' implicitly has an '... Remove this comment to see the full error message
	inputDevices,
// @ts-expect-error TS(7031): Binding element 'conflicts' implicitly has an 'any... Remove this comment to see the full error message
	conflictState: { conflicts, setConflicts },
// @ts-expect-error TS(7031): Binding element 'setPageCompleted' implicitly has ... Remove this comment to see the full error message
	setPageCompleted,
// @ts-expect-error TS(7031): Binding element 'checkForSchedulingConflicts' impl... Remove this comment to see the full error message
	checkForSchedulingConflicts,
// @ts-expect-error TS(7031): Binding element 'addNotification' implicitly has a... Remove this comment to see the full error message
	addNotification,
// @ts-expect-error TS(7031): Binding element 'removeNotificationWizardForm' imp... Remove this comment to see the full error message
	removeNotificationWizardForm,
// @ts-expect-error TS(7031): Binding element 'fetchSchedulingData' implicitly h... Remove this comment to see the full error message
	fetchSchedulingData,
// @ts-expect-error TS(7031): Binding element 'loading' implicitly has an 'any' ... Remove this comment to see the full error message
	loading,
// @ts-expect-error TS(7031): Binding element 'seriesOptions' implicitly has an ... Remove this comment to see the full error message
	seriesOptions,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();

	useEffect(() => {
		const fetchEventInfos =
			formik.values.editedEvents.length !== formik.values.events ||
			formik.values.events.some(
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
				(event) =>
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
					!formik.values.editedEvents.find((e) => e.eventId === event.id)
			);

		// Fetch data about series and schedule info of chosen events from backend
		fetchSchedulingData(
			formik.values.events,
			fetchEventInfos,
			formik.setFieldValue
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.events]);

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content active">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Notifications context="not_corner" />

						{/* Table that shows conflicts with other events*/}
						{conflicts.length > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<table className="main-tbl scheduling-conflict">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<th>
											{t(
												"BULK_ACTIONS.EDIT_EVENTS.GENERAL.CONFLICT_FIRST_EVENT"
											)}
										</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<th>
											{t(
												"BULK_ACTIONS.EDIT_EVENTS.GENERAL.CONFLICT_SECOND_EVENT"
											)}
										</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<th>{t("EVENTS.EVENTS.TABLE.START")}</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<th>{t("EVENTS.EVENTS.TABLE.END")}</th>
									</tr>
// @ts-expect-error TS(7006): Parameter 'conflict' implicitly has an 'any' type.
									{conflicts.map((conflict) =>
// @ts-expect-error TS(7006): Parameter 'c' implicitly has an 'any' type.
										conflict.conflicts.map((c, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{conflict.eventId}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{c.title}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{c.start}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{c.end}</td>
											</tr>
										))
									)}
								</table>
							</div>
						)}

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj header-description">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span>{t("BULK_ACTIONS.EDIT_EVENTS.EDIT.HEADER")}</span>
						</div>

						{/* Repeat table for each selected event */}
						{!loading && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<FieldArray name="editedEvents">
								{({ insert, remove, push }) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<>
										{
											/*todo: in old UI this was grouped by weekday, which is also stated in the description in the div above
                                        now there isn't any grouping and there is one div per event -> find out, if that is okay and adapt again if necessary */
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
											formik.values.editedEvents.map((event, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="obj tbl-details">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<header>{event.title}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tbody>
																{/* Repeat for all metadata rows*/}
																{hasAccess(
																	"ROLE_UI_EVENTS_DETAILS_METADATA_EDIT",
																	user
																) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<span>
																					{t(
																						"EVENTS.EVENTS.DETAILS.METADATA.TITLE"
																					)}
																				</span>
																			</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td className="editable ng-isolated-scope">
																				{/*
																				 * Per event there are 14 input fields, so with 'key * 14', the right
																				 * event is reached. After the '+' comes the number of the input field.
																				 * This is the first input field for this event.
																				 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<Field
																					tabIndex={key * 14 + 1}
																					name={`editedEvents.${key}.changedTitle`}
																					metadataField={{
																						type: "text",
																					}}
																					component={RenderField}
																				/>
																			</td>
																		</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<span>
																					{t(
																						"EVENTS.EVENTS.DETAILS.METADATA.SERIES"
																					)}
																				</span>
																			</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td className="editable ng-isolated-scope">
																				{/*
																				 * Per event there are 14 input fields, so with 'key * 14', the right
																				 * event is reached. After the '+' comes the number of the input field.
																				 * This is the second input field for this event.
																				 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<Field
																					tabIndex={key * 14 + 2}
																					name={`editedEvents.${key}.changedSeries`}
																					metadataField={{
																						type: "text",
																						collection: seriesOptions,
																						id: "isPartOf",
																						required:
																							formik.values.editedEvents[key]
																								.series !== "",
																					}}
																					component={RenderField}
																				/>
																			</td>
																		</tr>
																	</>
																)}
																{hasAccess(
																	"ROLE_UI_EVENTS_DETAILS_SCHEDULING_EDIT",
																	user
																) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td>
																				{t(
																					"EVENTS.EVENTS.DETAILS.SOURCE.DATE_TIME.TIMEZONE"
																				)}
																			</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td>{"UTC" + getTimezoneOffset()}</td>
																		</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td>
																				{t(
																					"EVENTS.EVENTS.DETAILS.SOURCE.DATE_TIME.START_TIME"
																				)}
																			</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td className="editable ng-isolated-scope">
																				{/* drop-down for hour
																				 *
																				 * Per event there are 14 input fields, so with 'key * 14', the right
																				 * event is reached. After the '+' comes the number of the input field.
																				 * This is the third input field for this event.
																				 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<DropDown
																					value={
																						formik.values.editedEvents[key]
																							.changedStartTimeHour
																					}
																					text={
																						formik.values.editedEvents[key]
																							.changedStartTimeHour
																					}
																					options={hours}
																					type={"time"}
																					required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																					handleChange={(element) =>
																						formik.setFieldValue(
																							`editedEvents.${key}.changedStartTimeHour`,
																							element.value
																						)
																					}
																					placeholder={t(
																						"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.HOUR"
																					)}
																					tabIndex={key * 14 + 3}
																				/>

																				{/* drop-down for minute
																				 *
																				 * Per event there are 14 input fields, so with 'key * 14', the right
																				 * event is reached. After the '+' comes the number of the input field.
																				 * This is the fourth input field for this event.
																				 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<DropDown
																					value={
																						formik.values.editedEvents[key]
																							.changedStartTimeMinutes
																					}
																					text={
																						formik.values.editedEvents[key]
																							.changedStartTimeMinutes
																					}
																					options={minutes}
																					type={"time"}
																					required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																					handleChange={(element) =>
																						formik.setFieldValue(
																							`editedEvents.${key}.changedStartTimeMinutes`,
																							element.value
																						)
																					}
																					placeholder={t(
																						"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.MINUTE"
																					)}
																					tabIndex={key * 14 + 4}
																				/>
																			</td>
																		</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td>
																				{t(
																					"EVENTS.EVENTS.DETAILS.SOURCE.DATE_TIME.END_TIME"
																				)}
																			</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td className="editable ng-isolated-scope">
																				{/* drop-down for hour
																				 *
																				 * Per event there are 14 input fields, so with 'key * 14', the right
																				 * event is reached. After the '+' comes the number of the input field.
																				 * This is the fifth input field for this event.
																				 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<DropDown
																					value={
																						formik.values.editedEvents[key]
																							.changedEndTimeHour
																					}
																					text={
																						formik.values.editedEvents[key]
																							.changedEndTimeHour
																					}
																					options={hours}
																					type={"time"}
																					required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																					handleChange={(element) =>
																						formik.setFieldValue(
																							`editedEvents.${key}.changedEndTimeHour`,
																							element.value
																						)
																					}
																					placeholder={t(
																						"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.HOUR"
																					)}
																					tabIndex={key * 14 + 5}
																				/>

																				{/* drop-down for minute
																				 *
																				 * Per event there are 14 input fields, so with 'key * 14', the right
																				 * event is reached. After the '+' comes the number of the input field.
																				 * This is the sixth input field for this event.
																				 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<DropDown
																					value={
																						formik.values.editedEvents[key]
																							.changedEndTimeMinutes
																					}
																					text={
																						formik.values.editedEvents[key]
																							.changedEndTimeMinutes
																					}
																					options={minutes}
																					type={"time"}
																					required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																					handleChange={(element) =>
																						formik.setFieldValue(
																							`editedEvents.${key}.changedEndTimeMinutes`,
																							element.value
																						)
																					}
																					placeholder={t(
																						"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.MINUTE"
																					)}
																					tabIndex={key * 14 + 6}
																				/>
																			</td>
																		</tr>

																		{/* Dropdown for location/input device
																		 *
																		 * Per event there are 14 input fields, so with 'key * 14', the right
																		 * event is reached. After the '+' comes the number of the input field.
																		 * This is the seventh input field for this event.
																		 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td>
																				{t(
																					"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.LOCATION"
																				)}
																			</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td className="editable ng-isolated-scope">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<DropDown
																					value={
																						formik.values.editedEvents[key]
																							.changedLocation
																					}
																					text={
																						formik.values.editedEvents[key]
																							.changedLocation
																					}
																					options={inputDevices}
																					type={"captureAgent"}
																					required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																					handleChange={(element) => {
																						formik.setFieldValue(
																							`editedEvents.${key}.changedLocation`,
																							element.value
																						);
																						formik.setFieldValue(
																							`editedEvents.${key}.changedDeviceInputs`,
																							[]
																						);
																					}}
																					placeholder={`-- ${t(
																						"SELECT_NO_OPTION_SELECTED"
																					)} --`}
																					tabIndex={key * 14 + 7}
																				/>
																			</td>
																		</tr>

																		{/* the following seven lines can be commented in, when the possibility of a selection of individual inputs is desired and the backend has been adapted to support it
                                                                    <tr>
                                                                        <td>{t('EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.INPUTS')}</td>
                                                                        <td>
                                                                            {/* Render checkbox for each input option of the selected input device*/
																		/*}
                                                                            {renderInputDeviceOptions(key)}
                                                                        </td>
                                                                    </tr>
                                                                    */}

																		{/* Radio buttons for weekdays
																		 *
																		 * Per event there are 14 input fields, so with 'key * 14', the right
																		 * event is reached. After the '+' comes the number of the input field.
																		 * These radio buttons are input fields 8 to 14 for this event.
																		 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td>
																				{t(
																					"EVENTS.EVENTS.NEW.SOURCE.SCHEDULE_MULTIPLE.WEEKDAY"
																				)}
																			</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<td className="weekdays">
																				{weekdays.map((day, index) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																					<label key={index}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<Field
																							tabIndex={key * 14 + 8 + index}
																							type="radio"
																							name={`editedEvents.${key}.changedWeekday`}
																							value={day.name}
																						/>
																						{t(day.label)}
																					</label>
																				))}
																			</td>
																		</tr>
																	</>
																)}
															</tbody>
														</table>
													</div>
												</div>
											))
										}
									</>
								)}
							</FieldArray>
						)}
					</div>
				</div>
			</div>

			{/* Navigation buttons */}
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
						removeNotificationWizardForm();
						if (
							await checkSchedulingConflicts(
								formik.values,
								setConflicts,
								checkForSchedulingConflicts,
								addNotification
							)
						) {
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
					onClick={() => {
						previousPage(formik.values, false);
						if (!formik.isValid) {
							// set page as not filled out
							setPageCompleted([]);
						}
					}}
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
	loading: isLoadingScheduling(state),
	seriesOptions: getSchedulingSeriesOptions(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'events' implicitly has an 'any' type.
	checkForSchedulingConflicts: (events) =>
		dispatch(checkForSchedulingConflicts(events)),
// @ts-expect-error TS(7006): Parameter 'type' implicitly has an 'any' type.
	addNotification: (type, key, duration, parameter, context) =>
		dispatch(addNotification(type, key, duration, parameter, context)),
	removeNotificationWizardForm: () => dispatch(removeNotificationWizardForm()),
// @ts-expect-error TS(7006): Parameter 'events' implicitly has an 'any' type.
	fetchSchedulingData: (events, fetchNewScheduling, setFieldValue) =>
		dispatch(fetchScheduling(events, fetchNewScheduling, setFieldValue)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditScheduledEventsEditPage);
