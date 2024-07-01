import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import Notifications from "../../../shared/Notifications";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
	getCurrentLanguageInformation,
	getTimezoneOffset,
	translateOverrideFallback,
} from "../../../../utils/utils";
import { Field, FieldArray, FormikProps } from "formik";
import RenderField from "../../../shared/wizard/RenderField";
import { getRecordings } from "../../../../selectors/recordingSelectors";
import { sourceMetadata } from "../../../../configs/sourceConfig";
import { hours, minutes, weekdays } from "../../../../configs/modalConfig";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import {
	filterDevicesForAccess,
	hasAnyDeviceAccess,
} from "../../../../utils/resourceUtils";
import DropDown from "../../../shared/DropDown";
import {
	changeDurationHour,
	changeDurationHourMultiple,
	changeDurationMinute,
	changeDurationMinuteMultiple,
	changeEndDateMultiple,
	changeEndHour,
	changeEndHourMultiple,
	changeEndMinute,
	changeEndMinuteMultiple,
	changeStartDate,
	changeStartDateMultiple,
	changeStartHour,
	changeStartHourMultiple,
	changeStartMinute,
	changeStartMinuteMultiple,
	renderValidDate,
} from "../../../../utils/dateUtils";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Recording, fetchRecordings } from "../../../../slices/recordingSlice";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { parseISO } from "date-fns";
import { checkConflicts } from "../../../../slices/eventSlice";

/**
 * This component renders the source page for new events in the new event wizard.
 */
interface RequiredFormProps {
	scheduleStartDate: string,
	sourceMode: string,
	// Schedule
	location: string
	scheduleEndDate: string
	scheduleStartHour: string
	scheduleEndHour: string
	scheduleStartMinute: string
	scheduleEndMinute: string
	scheduleDurationHours: string
	scheduleDurationMinutes: string
	// checkConflicts
	repeatOn: string[],
}

const NewSourcePage = <T extends RequiredFormProps>({
	formik,
	nextPage,
	previousPage,
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
	previousPage: (values: T, twoPagesBack?: boolean) => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));
	const inputDevices = useAppSelector(state => getRecordings(state));

	const [conflicts, setConflicts] = useState<{title: string, start: string, end: string}[]>([]);

	useEffect(() => {
		// Load recordings that can be used for input
		dispatch(fetchRecordings("inputs"));

		// validate form because dependent default values need to be checked
		formik.validateForm().then((r) => console.info(r));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Remove old notifications of context event-form
	// Helps to prevent multiple notifications for same problem
	const removeOldNotifications = () => {
		dispatch(removeNotificationWizardForm());
	};

	const scheduleOptionAvailable = () => {
		return inputDevices.length > 0 && hasAnyDeviceAccess(user, inputDevices);
	};

	return (
		<>
			<div className="modal-content">
				<div className="modal-body">
					<div className="full-col">
						{/*Show notifications with context events-form*/}
						<Notifications context="not_corner" />

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

						<div className="obj list-obj">
							<header className="no-expand">
								{t("EVENTS.EVENTS.NEW.SOURCE.SELECT_SOURCE")}
							</header>
							{/* Radio buttons for choosing source mode */}
							<div className="obj-container">
								<ul>
									{scheduleOptionAvailable() ? (
										<li>
											<label>
												<Field
													type="radio"
													name="sourceMode"
													className="source-toggle"
													value="UPLOAD"
												/>
												<span>
													{t("EVENTS.EVENTS.NEW.SOURCE.UPLOAD.CAPTION")}
												</span>
											</label>
										</li>
									) : (
										<li>
											<label>
												<span>
													{t("EVENTS.EVENTS.NEW.SOURCE.UPLOAD.CAPTION")}
												</span>
											</label>
										</li>
									)}
									{scheduleOptionAvailable() && (
										<>
											<li>
												<label>
													<Field
														type="radio"
														name="sourceMode"
														className="source-toggle"
														onClick={() =>
															changeStartDate(
																new Date(formik.values.scheduleStartDate),
																formik.values,
																formik.setFieldValue
															)
														}
														value="SCHEDULE_SINGLE"
													/>
													<span>
														{t(
															"EVENTS.EVENTS.NEW.SOURCE.SCHEDULE_SINGLE.CAPTION"
														)}
													</span>
												</label>
											</li>
											<li>
												<label>
													<Field
														type="radio"
														name="sourceMode"
														className="source-toggle"
														value="SCHEDULE_MULTIPLE"
													/>
													<span>
														{t(
															"EVENTS.EVENTS.NEW.SOURCE.SCHEDULE_MULTIPLE.CAPTION"
														)}
													</span>
												</label>
											</li>
										</>
									)}
								</ul>
							</div>
						</div>

						{/* Render rest of page depending on which source mode is chosen */}
						{formik.values.sourceMode === "UPLOAD" && (
							<Upload formik={formik} />
						)}
						{scheduleOptionAvailable() &&
							(formik.values.sourceMode === "SCHEDULE_SINGLE" ||
								formik.values.sourceMode === "SCHEDULE_MULTIPLE") && (
								<Schedule
									formik={formik}
									inputDevices={filterDevicesForAccess(user, inputDevices)}
								/>
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
						removeOldNotifications();
						const noConflicts = await dispatch(checkConflicts(formik.values));
						if (Array.isArray(noConflicts)) {
							setConflicts(noConflicts);
						}
						if ((typeof noConflicts == "boolean" && noConflicts)
							|| (Array.isArray(noConflicts) && noConflicts.length === 0)) {
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

/*
 * Renders buttons for uploading files and fields for additional metadata
 */
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
const Upload = ({ formik }) => {
	const { t } = useTranslation();

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const handleChange = (e, assetId) => {
		if (e.target.files.length === 0) {
			formik.setFieldValue(assetId, null);
		} else {
			formik.setFieldValue(assetId, e.target.files);
		}
	};

	return (
		<>
			<div className="obj tbl-details">
				<header>
					{t("EVENTS.EVENTS.NEW.SOURCE.UPLOAD.RECORDING_ELEMENTS")}
				</header>
				<div className="obj-container">
					<table className="main-tbl">
						<tbody>
							<FieldArray name="uploadAssetsTrack">
								{/*File upload button for each upload asset*/}
								{({ insert, remove, push }) =>
									formik.values.uploadAssetsTrack.length > 0 &&
// @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
									formik.values.uploadAssetsTrack.map((asset, key) => (
										<tr key={key}>
											<td>
												<span style={{ fontWeight: "bold" }}>
													{translateOverrideFallback(asset, t, "SHORT")}
												</span>
												<p>
													{translateOverrideFallback(asset, t, "DETAIL")}
												</p>
											</td>
											<td>
												<div className="file-upload">
													<input
														id={asset.id}
														className="blue-btn file-select-btn"
														accept={asset.accept}
														onChange={(e) =>
															handleChange(e, `uploadAssetsTrack.${key}.file`)
														}
														type="file"
														multiple={asset.multiple}
														name={`uploadAssetsTrack.${key}.file`}
														tabIndex={0}
													/>
												</div>
											</td>
											<td className="fit">
												<button
													className="button-like-anchor remove"
													onClick={(e) => {
														formik.setFieldValue(
															`uploadAssetsTrack.${key}.file`,
															null
														);
														(document.getElementById(asset.id) as HTMLInputElement).value = '';
													}}
												/>
											</td>
										</tr>
									))
								}
							</FieldArray>
						</tbody>
					</table>
				</div>
			</div>
			<div className="obj list-obj">
				<header className="no-expand">
					{t("EVENTS.EVENTS.NEW.SOURCE.UPLOAD.RECORDING_METADATA")}
				</header>
				<div className="obj-container">
					<table className="main-tbl">
						<tbody>
							{/* One row for each metadata field*/}
							{sourceMetadata.UPLOAD && sourceMetadata.UPLOAD.metadata.map((field, key) => (
								<tr key={key}>
									<td>
										<span>{t(field.label)}</span>
										{field.required && <i className="required">*</i>}
									</td>
									<td className="editable">
										<Field
											name={field.id}
											metadataField={field}
											component={RenderField}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

/*
 * Renders fields for providing information for schedule of event
 */
const Schedule = <T extends {
	location: string
	scheduleStartDate: string
	scheduleEndDate: string
	sourceMode: string
	scheduleStartHour: string
	scheduleEndHour: string
	scheduleStartMinute: string
	scheduleEndMinute: string
	scheduleDurationHours: string
	scheduleDurationMinutes: string
}>({
	formik,
	inputDevices
}: {
	formik: FormikProps<T>,
	inputDevices: Recording[]
}) => {
	const { t } = useTranslation();

	const currentLanguage = getCurrentLanguageInformation();

	const renderInputDeviceOptions = () => {
		if (!!formik.values.location) {
			let inputDevice = inputDevices.find(
				({ name }) => name === formik.values.location
			);
// @ts-expect-error TS(7006): Parameter 'input' implicitly has an 'any' type.
			return inputDevice.inputs.map((input, key) => (
				<label key={key}>
					<Field
						type="checkbox"
						name="deviceInputs"
						value={input.id}
						tabIndex={12}
					/>
					{t(input.value)}
				</label>
			));
		}
	};

	return (
		<div className="obj">
			<header>{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.CAPTION")}</header>
			<div className="obj-container">
				<table className="main-tbl">
					<tbody>
						<tr>
							<td>{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.TIMEZONE")}</td>
							<td>{"UTC" + getTimezoneOffset()}</td>
						</tr>
						<tr>
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_DATE")}{" "}
								<i className="required">*</i>
							</td>
							<td>
								<DatePicker
									name="scheduleStartDate"
									value={typeof formik.values.scheduleStartDate === "string" ? parseISO(formik.values.scheduleStartDate): formik.values.scheduleStartDate}
									onChange={(value) => {
										if (formik.values.sourceMode === "SCHEDULE_MULTIPLE") {
											changeStartDateMultiple(
												value,
												formik.values,
												formik.setFieldValue
											);
										} else {
											value && changeStartDate(
												value,
												formik.values,
												formik.setFieldValue
											);
										}
									}}
									// @ts-expect-error TS(2322):
									tabIndex={4}
								/>
							</td>
						</tr>
						{/* Render fields specific for multiple schedule (Only if this is current source mode)*/}
						{formik.values.sourceMode === "SCHEDULE_MULTIPLE" && (
							<>
								<tr>
									<td>
										{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.END_DATE")}{" "}
										<i className="required">*</i>
									</td>
									<td>
										<DatePicker
											name="scheduleEndDate"
											value={typeof formik.values.scheduleEndDate === "string" ? parseISO(formik.values.scheduleEndDate) : formik.values.scheduleEndDate}
											onChange={(value) =>
												changeEndDateMultiple(
													value,
													formik.values,
													formik.setFieldValue
												)
											}
											// @ts-expect-error TS(2322):
											tabIndex={5}
										/>
									</td>
								</tr>
								<tr>
									<td>
										{t("EVENTS.EVENTS.NEW.SOURCE.SCHEDULE_MULTIPLE.REPEAT_ON")}{" "}
										<i className="required">*</i>
									</td>
									<td>
										{/* Repeat checkbox for each week day*/}
										{weekdays.map((day, key) => (
											<div key={key} className="day-check-container">
												{t(day.label)}
												<br />
												<Field
													type="checkbox"
													name="repeatOn"
													value={day.name}
													tabIndex={6 + key}
												/>
											</div>
										))}
									</td>
								</tr>
							</>
						)}
						<tr>
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_TIME")}{" "}
								<i className="required">*</i>
							</td>
							<td className="editable ng-isolated-scope">
								{/* drop-down for hour
								 *
								 * This is the 13th input field.
								 */}
								<DropDown
									value={formik.values.scheduleStartHour}
									text={formik.values.scheduleStartHour.toString()}
									options={hours}
									type={"time"}
									required={true}
									handleChange={(element) => {
										if (element) {
											if (formik.values.sourceMode === "SCHEDULE_MULTIPLE") {
												changeStartHourMultiple(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											} else {
												changeStartHour(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											}
										}
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.HOUR")}
								/>

								{/* drop-down for minute
								 *
								 * This is the 14th input field.
								 */}
								<DropDown
									value={formik.values.scheduleStartMinute}
									text={formik.values.scheduleStartMinute.toString()}
									options={minutes}
									type={"time"}
									required={true}
									handleChange={(element) => {
										if (element) {
											if (formik.values.sourceMode === "SCHEDULE_MULTIPLE") {
												changeStartMinuteMultiple(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											} else {
												changeStartMinute(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											}
										}
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.MINUTE")}
								/>
							</td>
						</tr>
						<tr>
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.DURATION")}{" "}
								<i className="required">*</i>
							</td>
							<td className="editable ng-isolated-scope">
								{/* drop-down for hour
								 *
								 * This is the 15th input field.
								 */}
								<DropDown
									value={formik.values.scheduleDurationHours}
									text={formik.values.scheduleDurationHours.toString()}
									options={hours}
									type={"time"}
									required={true}
									handleChange={(element) => {
										if (element) {
											if (formik.values.sourceMode === "SCHEDULE_MULTIPLE") {
												changeDurationHourMultiple(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											} else {
												changeDurationHour(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											}
										}
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.HOUR")}
								/>

								{/* drop-down for minute
								 *
								 * This is the 16th input field.
								 */}
								<DropDown
									value={formik.values.scheduleDurationMinutes}
									text={formik.values.scheduleDurationMinutes.toString()}
									options={minutes}
									type={"time"}
									required={true}
									handleChange={(element) => {
										if (element) {
											if (formik.values.sourceMode === "SCHEDULE_MULTIPLE") {
												changeDurationMinuteMultiple(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											} else {
												changeDurationMinute(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											}
										}
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.MINUTE")}
								/>
							</td>
						</tr>
						<tr>
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.END_TIME")}{" "}
								<i className="required">*</i>
							</td>
							<td className="editable ng-isolated-scope">
								{/* drop-down for hour
								 *
								 * This is the 17th input field.
								 */}
								<DropDown
									value={formik.values.scheduleEndHour}
									text={formik.values.scheduleEndHour.toString()}
									options={hours}
									type={"time"}
									required={true}
									handleChange={(element) => {
										if (element) {
											if (formik.values.sourceMode === "SCHEDULE_MULTIPLE") {
												changeEndHourMultiple(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											} else {
												changeEndHour(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											}
										}
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.HOUR")}
								/>

								{/* drop-down for minute
								 *
								 * This is the 18th input field.
								 */}
								<DropDown
									value={formik.values.scheduleEndMinute}
									text={formik.values.scheduleEndMinute.toString()}
									options={minutes}
									type={"time"}
									required={true}
									handleChange={(element) => {
										if (element) {
											if (formik.values.sourceMode === "SCHEDULE_MULTIPLE") {
												changeEndMinuteMultiple(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											} else {
												changeEndMinute(
													element.value,
													formik.values,
													formik.setFieldValue
												).then();
											}
										}
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.MINUTE")}
								/>

								{/* display end date if on different day to start date, only if this is current source mode */}
								{formik.values.sourceMode === "SCHEDULE_SINGLE" &&
									formik.values.scheduleEndDate.toString() !==
										formik.values.scheduleStartDate.toString() && (
										<span style={{ marginLeft: "10px" }}>
											{new Date(
												formik.values.scheduleEndDate
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
											).toLocaleDateString(currentLanguage.dateLocale.code)}
										</span>
									)}
							</td>
						</tr>
						<tr>
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.LOCATION")}{" "}
								<i className="required">*</i>
							</td>
							{/* one options for each capture agents that has input options
							 *
							 * This is the 19th input field.
							 */}
							<td className="editable ng-isolated-scope">
								<DropDown
									value={formik.values.location}
									text={formik.values.location}
									options={inputDevices}
									type={"captureAgent"}
									required={true}
									handleChange={(element) => {
										if (element) {
											formik.setFieldValue("location", element.value)
										}
									}}
									placeholder={t(
										"EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.LOCATION"
									)}
								/>
							</td>
						</tr>
						<tr>
							<td>{t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.INPUTS")}</td>
							<td>
								{/* Render checkbox for each input option of the selected input device*/}
								{renderInputDeviceOptions()}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default NewSourcePage;
