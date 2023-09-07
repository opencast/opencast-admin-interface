import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import {
	getCurrentLanguageInformation,
	getTimezoneOffset,
} from "../../../../utils/utils";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { Field, FieldArray } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderField' was re... Remove this comment to see the full error message
import RenderField from "../../../shared/wizard/RenderField";
import { getRecordings } from "../../../../selectors/recordingSelectors";
import { fetchRecordings } from "../../../../thunks/recordingThunks";
import { connect } from "react-redux";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
import { checkConflicts } from "../../../../thunks/eventThunks";
import { sourceMetadata } from "../../../../configs/sourceConfig";
import { hours, minutes, weekdays } from "../../../../configs/modalConfig";
import DateFnsUtils from "@date-io/date-fns";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import {
	filterDevicesForAccess,
	hasAnyDeviceAccess,
} from "../../../../utils/resourceUtils";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
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
} from "../../../../utils/dateUtils";

// Style to bring date picker pop up to front
const theme = createMuiTheme({
	props: {
		MuiDialog: {
			style: {
				zIndex: "2147483550",
			},
		},
	},
});

/**
 * This component renders the source page for new events in the new event wizard.
 */
const NewSourcePage = ({
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'loadingInputDevices' implicitly h... Remove this comment to see the full error message
	loadingInputDevices,
// @ts-expect-error TS(7031): Binding element 'inputDevices' implicitly has an '... Remove this comment to see the full error message
	inputDevices,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'removeNotificationWizardForm' imp... Remove this comment to see the full error message
	removeNotificationWizardForm,
// @ts-expect-error TS(7031): Binding element 'checkConflicts' implicitly has an... Remove this comment to see the full error message
	checkConflicts,
}) => {
	const { t } = useTranslation();

	useEffect(() => {
		// Load recordings that can be used for input
		loadingInputDevices();

		// validate form because dependent default values need to be checked
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		formik.validateForm().then((r) => console.info(r));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Remove old notifications of context event-form
	// Helps to prevent multiple notifications for same problem
	const removeOldNotifications = () => {
		removeNotificationWizardForm();
	};

	const scheduleOptionAvailable = () => {
		return inputDevices.length > 0 && hasAnyDeviceAccess(user, inputDevices);
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
						{/*Show notifications with context events-form*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Notifications context="not_corner" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header className="no-expand">
								{t("EVENTS.EVENTS.NEW.SOURCE.SELECT_SOURCE")}
							</header>
							{/* Radio buttons for choosing source mode */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<ul>
									{scheduleOptionAvailable() ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<Field
													type="radio"
													name="sourceMode"
													className="source-toggle"
													value="UPLOAD"
												/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<span>
													{t("EVENTS.EVENTS.NEW.SOURCE.UPLOAD.CAPTION")}
												</span>
											</label>
										</li>
									) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<span>
													{t("EVENTS.EVENTS.NEW.SOURCE.UPLOAD.CAPTION")}
												</span>
											</label>
										</li>
									)}
									{scheduleOptionAvailable() && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<Field
														type="radio"
														name="sourceMode"
														className="source-toggle"
														onClick={() =>
															changeStartDate(
																formik.values.scheduleStartDate,
																formik.values,
																formik.setFieldValue
															)
														}
														value="SCHEDULE_SINGLE"
													/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<span>
														{t(
															"EVENTS.EVENTS.NEW.SOURCE.SCHEDULE_SINGLE.CAPTION"
														)}
													</span>
												</label>
											</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<Field
														type="radio"
														name="sourceMode"
														className="source-toggle"
														value="SCHEDULE_MULTIPLE"
													/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<Upload formik={formik} />
						)}
						{scheduleOptionAvailable() &&
							(formik.values.sourceMode === "SCHEDULE_SINGLE" ||
								formik.values.sourceMode === "SCHEDULE_MULTIPLE") && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<Schedule
									formik={formik}
									inputDevices={filterDevicesForAccess(user, inputDevices)}
								/>
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
						removeOldNotifications();
						const noConflicts = await checkConflicts(formik.values);
						if (noConflicts) {
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="obj tbl-details">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
					{t("EVENTS.EVENTS.NEW.SOURCE.UPLOAD.RECORDING_ELEMENTS")}
				</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<FieldArray name="uploadAssetsTrack">
								{/*File upload button for each upload asset*/}
								{({ insert, remove, push }) =>
									formik.values.uploadAssetsTrack.length > 0 &&
// @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
									formik.values.uploadAssetsTrack.map((asset, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<span style={{ fontWeight: "bold" }}>
													{t(
														asset.title + ".SHORT",
														asset["displayOverride.SHORT"]
													)}
												</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<span className="ui-helper-hidden">
													({asset.type} "{asset.flavorType}/
													{asset.flavorSubType}")
												</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<p>
													{t(
														asset.title + ".DETAIL",
														asset["displayOverride.DETAIL"]
													)}
												</p>
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="file-upload">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
														tabIndex=""
													/>
													{/* Show name of file that is uploaded */}
													{formik.values.uploadAssetsTrack[key].file && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<span className="ui-helper">
															{formik.values.uploadAssetsTrack[
																key
															].file[0].name.substr(0, 50)}
														</span>
													)}
												</div>
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td className="fit">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<button
													className="button-like-anchor remove"
													onClick={() => {
														formik.setFieldValue(
															`uploadAssetsTrack.${key}.file`,
															null
														);
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="obj list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header className="no-expand">
					{t("EVENTS.EVENTS.NEW.SOURCE.UPLOAD.RECORDING_METADATA")}
				</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tbody>
							{/* One row for each metadata field*/}
							{sourceMetadata.UPLOAD.metadata.map((field, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span>{t(field.label)}</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										{field.required && <i className="required">*</i>}
									</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<td className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
const Schedule = ({ formik, inputDevices }) => {
	const { t } = useTranslation();

	const currentLanguage = getCurrentLanguageInformation();

	const renderInputDeviceOptions = () => {
		if (!!formik.values.location) {
			let inputDevice = inputDevices.find(
// @ts-expect-error TS(7031): Binding element 'name' implicitly has an 'any' typ... Remove this comment to see the full error message
				({ name }) => name === formik.values.location
			);
// @ts-expect-error TS(7006): Parameter 'input' implicitly has an 'any' type.
			return inputDevice.inputs.map((input, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<label key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<Field
						type="checkbox"
						name="deviceInputs"
						value={input.id}
						tabIndex="12"
					/>
					{t(input.value)}
				</label>
			));
		}
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<header>{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.CAPTION")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.TIMEZONE")}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>{"UTC" + getTimezoneOffset()}</td>
						</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_DATE")}{" "}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i className="required">*</i>
							</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<ThemeProvider theme={theme}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
										locale={currentLanguage.dateLocale}
									>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<DatePicker
											name="scheduleStartDate"
											value={formik.values.scheduleStartDate}
											onChange={(value) => {
												if (formik.values.sourceMode === "SCHEDULE_MULTIPLE") {
													changeStartDateMultiple(
														value,
														formik.values,
														formik.setFieldValue
													);
												} else {
													changeStartDate(
														value,
														formik.values,
														formik.setFieldValue
													);
												}
											}}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
											tabIndex="4"
										/>
									</MuiPickersUtilsProvider>
								</ThemeProvider>
							</td>
						</tr>
						{/* Render fields specific for multiple schedule (Only if this is current source mode)*/}
						{formik.values.sourceMode === "SCHEDULE_MULTIPLE" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<td>
										{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.END_DATE")}{" "}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<i className="required">*</i>
									</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<ThemeProvider theme={theme}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<DatePicker
												name="scheduleEndDate"
												value={formik.values.scheduleEndDate}
												onChange={(value) =>
													changeEndDateMultiple(
														value,
														formik.values,
														formik.setFieldValue
													)
												}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
												tabIndex="5"
											/>
										</ThemeProvider>
									</td>
								</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<td>
										{t("EVENTS.EVENTS.NEW.SOURCE.SCHEDULE_MULTIPLE.REPEAT_ON")}{" "}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<i className="required">*</i>
									</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<td>
										{/* Repeat checkbox for each week day*/}
										{weekdays.map((day, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div key={key} className="day-check-container">
												{t(day.label)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<br />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_TIME")}{" "}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i className="required">*</i>
							</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td className="editable ng-isolated-scope">
								{/* drop-down for hour
								 *
								 * This is the 13th input field.
								 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<DropDown
									value={formik.values.scheduleStartHour}
									text={formik.values.scheduleStartHour}
									options={hours}
									type={"time"}
									required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
									handleChange={(element) => {
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
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.HOUR")}
									tabIndex={"13"}
								/>

								{/* drop-down for minute
								 *
								 * This is the 14th input field.
								 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<DropDown
									value={formik.values.scheduleStartMinute}
									text={formik.values.scheduleStartMinute}
									options={minutes}
									type={"time"}
									required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
									handleChange={(element) => {
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
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.MINUTE")}
									tabIndex={"14"}
								/>
							</td>
						</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.DURATION")}{" "}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i className="required">*</i>
							</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td className="editable ng-isolated-scope">
								{/* drop-down for hour
								 *
								 * This is the 15th input field.
								 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<DropDown
									value={formik.values.scheduleDurationHours}
									text={formik.values.scheduleDurationHours}
									options={hours}
									type={"time"}
									required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
									handleChange={(element) => {
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
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.HOUR")}
									tabIndex={"15"}
								/>

								{/* drop-down for minute
								 *
								 * This is the 16th input field.
								 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<DropDown
									value={formik.values.scheduleDurationMinutes}
									text={formik.values.scheduleDurationMinutes}
									options={minutes}
									type={"time"}
									required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
									handleChange={(element) => {
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
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.MINUTE")}
									tabIndex={"16"}
								/>
							</td>
						</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.END_TIME")}{" "}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i className="required">*</i>
							</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td className="editable ng-isolated-scope">
								{/* drop-down for hour
								 *
								 * This is the 17th input field.
								 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<DropDown
									value={formik.values.scheduleEndHour}
									text={formik.values.scheduleEndHour}
									options={hours}
									type={"time"}
									required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
									handleChange={(element) => {
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
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.HOUR")}
									tabIndex={"17"}
								/>

								{/* drop-down for minute
								 *
								 * This is the 18th input field.
								 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<DropDown
									value={formik.values.scheduleEndMinute}
									text={formik.values.scheduleEndMinute}
									options={minutes}
									type={"time"}
									required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
									handleChange={(element) => {
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
									}}
									placeholder={t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.MINUTE")}
									tabIndex={"18"}
								/>

								{/* display end date if on different day to start date, only if this is current source mode */}
								{formik.values.sourceMode === "SCHEDULE_SINGLE" &&
									formik.values.scheduleEndDate.toString() !==
										formik.values.scheduleStartDate.toString() && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span style={{ marginLeft: "10px" }}>
											{new Date(
												formik.values.scheduleEndDate
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
											).toLocaleDateString(currentLanguage.dateLocale.code)}
										</span>
									)}
							</td>
						</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>
								{t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.LOCATION")}{" "}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i className="required">*</i>
							</td>
							{/* one options for each capture agents that has input options
							 *
							 * This is the 19th input field.
							 */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td className="editable ng-isolated-scope">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<DropDown
									value={formik.values.location}
									text={formik.values.location}
									options={inputDevices}
									type={"captureAgent"}
									required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
									handleChange={(element) =>
										formik.setFieldValue("location", element.value)
									}
									placeholder={t(
										"EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.LOCATION"
									)}
									tabIndex={"19"}
								/>
							</td>
						</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>{t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.INPUTS")}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	inputDevices: getRecordings(state),
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingInputDevices: () => dispatch(fetchRecordings("inputs")),
	removeNotificationWizardForm: () => dispatch(removeNotificationWizardForm()),
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	checkConflicts: (values) => dispatch(checkConflicts(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewSourcePage);
