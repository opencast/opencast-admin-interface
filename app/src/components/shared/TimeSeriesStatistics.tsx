import React from "react";
import moment from "moment";
import { getCurrentLanguageInformation } from "../../utils/utils";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Field, Formik } from "formik";
import BarChart from "./BarChart";
import {
	availableCustomStatisticDataResolutions,
	fixedStatisticDataResolutions,
	statisticDateFormatStrings,
	statisticTimeModes,
} from "../../configs/statisticsConfig";
import { localizedMoment } from "../../utils/dateUtils";
import { parseISO } from "date-fns";

/**
 * This component visualizes statistics with data of type time series
 */
const TimeSeriesStatistics = ({
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'resourceId' implicitly has an 'an... Remove this comment to see the full error message
	resourceId,
// @ts-expect-error TS(7031): Binding element 'statTitle' implicitly has an 'any... Remove this comment to see the full error message
	statTitle,
// @ts-expect-error TS(7031): Binding element 'providerId' implicitly has an 'an... Remove this comment to see the full error message
	providerId,
// @ts-expect-error TS(7031): Binding element 'fromDate' implicitly has an 'any'... Remove this comment to see the full error message
	fromDate,
// @ts-expect-error TS(7031): Binding element 'toDate' implicitly has an 'any' t... Remove this comment to see the full error message
	toDate,
// @ts-expect-error TS(7031): Binding element 'timeMode' implicitly has an 'any'... Remove this comment to see the full error message
	timeMode,
// @ts-expect-error TS(7031): Binding element 'dataResolution' implicitly has an... Remove this comment to see the full error message
	dataResolution,
// @ts-expect-error TS(7031): Binding element 'statDescription' implicitly has a... Remove this comment to see the full error message
	statDescription,
// @ts-expect-error TS(7031): Binding element 'onChange' implicitly has an 'any'... Remove this comment to see the full error message
	onChange,
// @ts-expect-error TS(7031): Binding element 'exportUrl' implicitly has an 'any... Remove this comment to see the full error message
	exportUrl,
// @ts-expect-error TS(7031): Binding element 'exportFileName' implicitly has an... Remove this comment to see the full error message
	exportFileName,
// @ts-expect-error TS(7031): Binding element 'totalValue' implicitly has an 'an... Remove this comment to see the full error message
	totalValue,
// @ts-expect-error TS(7031): Binding element 'sourceData' implicitly has an 'an... Remove this comment to see the full error message
	sourceData,
// @ts-expect-error TS(7031): Binding element 'chartLabels' implicitly has an 'a... Remove this comment to see the full error message
	chartLabels,
// @ts-expect-error TS(7031): Binding element 'chartOptions' implicitly has an '... Remove this comment to see the full error message
	chartOptions,
}) => {
	// Style for date picker
	const datePickerStyle = {
		border: "1px solid #dedddd",
		borderRadius: "4px",
		marginLeft: "3px",
		marginRight: "5px",
	};

	// Style for radio buttons
	const radioButtonStyle = {
		backgroundColor: "whitesmoke",
		backgroundImage: "linear-gradient(whitesmoke, #dedddd)",
		color: "#666666",
	};

	// available modes of choosing statistic timeframe
	const timeModes = statisticTimeModes;

	// data resolutions (or time granularity) for statistics with year or month timeframe
	const fixedDataResolutions = fixedStatisticDataResolutions;

	// available data resolutions (or time granularity) for statistics with custom timeframe
	const availableCustomDataResolutions = availableCustomStatisticDataResolutions;

	// date format strings
	const formatStrings = statisticDateFormatStrings;

	// Get info about the current language and its date locale
	const currentLanguage = getCurrentLanguageInformation();

	// change formik values and get new statistic values from API
// @ts-expect-error TS(7006): Parameter 'setFormikValue' implicitly has an 'any'... Remove this comment to see the full error message
	const change = (setFormikValue, timeMode, from, to, dataResolution) => {
		if (timeMode === "year" || timeMode === "month") {
			from = moment(from).clone().startOf(timeMode).format("YYYY-MM-DD");
			to = moment(from).clone().endOf(timeMode).format("YYYY-MM-DD");
			setFormikValue("fromDate", from);
			setFormikValue("toDate", to);
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			setFormikValue("dataResolution", fixedDataResolutions[timeMode]);
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			dataResolution = fixedDataResolutions[timeMode];
		}

		onChange(resourceId, providerId, from, to, dataResolution, timeMode);
	};

	// change time mode in formik and get new values from API
	const changeTimeMode = async (
// @ts-expect-error TS(7006): Parameter 'newTimeMode' implicitly has an 'any' ty... Remove this comment to see the full error message
		newTimeMode,
// @ts-expect-error TS(7006): Parameter 'setFormikValue' implicitly has an 'any'... Remove this comment to see the full error message
		setFormikValue,
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
		from,
// @ts-expect-error TS(7006): Parameter 'to' implicitly has an 'any' type.
		to,
// @ts-expect-error TS(7006): Parameter 'dataResolution' implicitly has an 'any'... Remove this comment to see the full error message
		dataResolution
	) => {
		setFormikValue("timeMode", newTimeMode);
		change(setFormikValue, newTimeMode, from, to, dataResolution);
	};

	// change custom from date in formik and get new values from API
	const changeFrom = async (
// @ts-expect-error TS(7006): Parameter 'newFrom' implicitly has an 'any' type.
		newFrom,
// @ts-expect-error TS(7006): Parameter 'setFormikValue' implicitly has an 'any'... Remove this comment to see the full error message
		setFormikValue,
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
		timeMode,
// @ts-expect-error TS(7006): Parameter 'to' implicitly has an 'any' type.
		to,
// @ts-expect-error TS(7006): Parameter 'dataResolution' implicitly has an 'any'... Remove this comment to see the full error message
		dataResolution
	) => {
		setFormikValue("fromDate", newFrom);
		change(setFormikValue, timeMode, newFrom, to, dataResolution);
	};

	// change custom to date in formik and get new values from API
	const changeTo = async (
// @ts-expect-error TS(7006): Parameter 'newTo' implicitly has an 'any' type.
		newTo,
// @ts-expect-error TS(7006): Parameter 'setFormikValue' implicitly has an 'any'... Remove this comment to see the full error message
		setFormikValue,
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
		timeMode,
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
		from,
// @ts-expect-error TS(7006): Parameter 'dataResolution' implicitly has an 'any'... Remove this comment to see the full error message
		dataResolution
	) => {
		setFormikValue("toDate", newTo);
		change(setFormikValue, timeMode, from, newTo, dataResolution);
	};

	// change custom time granularity in formik and get new values from API
	const changeGranularity = async (
// @ts-expect-error TS(7006): Parameter 'granularity' implicitly has an 'any' ty... Remove this comment to see the full error message
		granularity,
// @ts-expect-error TS(7006): Parameter 'setFormikValue' implicitly has an 'any'... Remove this comment to see the full error message
		setFormikValue,
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
		timeMode,
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
		from,
// @ts-expect-error TS(7006): Parameter 'to' implicitly has an 'any' type.
		to
	) => {
		setFormikValue("dataResolution", granularity);
		change(setFormikValue, timeMode, from, to, granularity);
	};

	// format selected time to display as name of timeframe
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
	const formatSelectedTimeframeName = (from, timeMode) => {
		return localizedMoment(from, currentLanguage).format(
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			formatStrings[timeMode]
		);
	};

	// change to and from dates in formik to previous timeframe and get new values from API
// @ts-expect-error TS(7006): Parameter 'setFormikValue' implicitly has an 'any'... Remove this comment to see the full error message
	const selectPrevious = (setFormikValue, from, timeMode, dataResolution) => {
// @ts-expect-error TS(2769): No overload matches this call.
		const newFrom = moment(from)
			.subtract(1, timeMode + "s")
			.format("YYYY-MM-DD");
		const to = newFrom;
		change(setFormikValue, timeMode, newFrom, to, dataResolution);
	};

	// change to and from dates in formik to next timeframe and get new values from API
// @ts-expect-error TS(7006): Parameter 'setFormikValue' implicitly has an 'any'... Remove this comment to see the full error message
	const selectNext = (setFormikValue, from, timeMode, dataResolution) => {
// @ts-expect-error TS(2769): No overload matches this call.
		const newFrom = moment(from)
			.add(1, timeMode + "s")
			.format("YYYY-MM-DD");
		const to = newFrom;
		change(setFormikValue, timeMode, newFrom, to, dataResolution);
	};

	return (
		/* Initialize form */
		<Formik
			enableReinitialize
			initialValues={{
				timeMode: timeMode,
				dataResolution: dataResolution,
				fromDate: moment(fromDate).startOf(timeMode).format("YYYY-MM-DD"),
				toDate: moment(toDate).endOf(timeMode).format("YYYY-MM-DD"),
			}}
			onSubmit={(values) => {}}
		>
			{(formik) => (
				<div className="statistics-graph">
					{/* download link for a statistic file */}
					<div className="download">
						<a
							className="download-icon"
							href={exportUrl}
							download={exportFileName(statTitle)}
						/>
					</div>

					{/* radio buttons for selecting the mode of choosing the timeframe of statistic */}
					<div className="mode">
						{timeModes.map((mode, key) => (
							<label
								htmlFor={providerId + "-mode-" + key}
								style={
									formik.values.timeMode === mode.value
										? radioButtonStyle
										: {}
								}
								key={key}
							>
								<Field
									type="radio"
									style={{ display: "none" }}
									name="timeMode"
									value={mode.value}
									id={providerId + "-mode-" + key}
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
									onChange={(event) =>
										changeTimeMode(
											event.target.value,
											formik.setFieldValue,
											formik.values.fromDate,
											formik.values.toDate,
											formik.values.dataResolution
										)
									}
								/>
								{t("STATISTICS.TIME_MODES." + mode.translation)}
							</label>
						))}
					</div>

					{/* statistics total value */}
					<div className="total">
						<span>{t("STATISTICS.TOTAL") /* Total */}</span>
						<span>{": " + totalValue}</span>
					</div>

					{/* timeframe selection */}

					{(formik.values.timeMode === "year" ||
						formik.values.timeMode === "month") && (
						/* year/month selection for statistic via previous and next buttons */
						<span className="preset">
							<a
								className="navigation prev"
								onClick={() =>
									selectPrevious(
										formik.setFieldValue,
										formik.values.fromDate,
										formik.values.timeMode,
										formik.values.dataResolution
									)
								}
							/>
							<div>
								{formatSelectedTimeframeName(
									formik.values.fromDate,
									formik.values.timeMode
								)}
							</div>
							<a
								className="navigation next"
								onClick={() =>
									selectNext(
										formik.setFieldValue,
										formik.values.fromDate,
										formik.values.timeMode,
										formik.values.dataResolution
									)
								}
							/>
						</span>
					)}

					{formik.values.timeMode === "custom" && (
						/* custom timeframe selection for statistic */
						<span className="custom">
							{/* time range selection */}
							<div className="range">
								{/* date picker for selecting start date of the statistic */}
								<span>{t("STATISTICS.FROM") /* From */}</span>
								<div className="chosen-container">
									<DatePicker
										name="fromDate"
										value={typeof formik.values.fromDate === "string" ? parseISO(formik.values.fromDate) : formik.values.fromDate}
										slotProps={{ textField: { placeholder: t(
											"EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.START_DATE"
										) } }}
										onChange={(value) =>
											changeFrom(
												value,
												formik.setFieldValue,
												formik.values.timeMode,
												formik.values.toDate,
												formik.values.dataResolution
											)
										}
									/>
								</div>

								{/* date picker for selecting end date of the statistic */}
								<span>{t("STATISTICS.TO") /* To */}</span>
								<div className="chosen-container">
									<DatePicker
										name="toDate"
										value={typeof formik.values.toDate === "string" ? parseISO(formik.values.toDate) : formik.values.toDate}
										slotProps={{ textField: { placeholder: t(
											"EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.END_DATE"
										) } }}
										onChange={(value) =>
											changeTo(
												value,
												formik.setFieldValue,
												formik.values.timeMode,
												formik.values.fromDate,
												formik.values.dataResolution
											)
										}
									/>
								</div>
							</div>

							{/* time granularity selection */}
							<div>
								<span>
									{t("STATISTICS.GRANULARITY") + " " /* Granularity */}
								</span>
								<div className="chosen-container chosen-container-single">
									{/* drop-down for selecting the time granularity of the statistic */}
									<Field
										className="chosen-single"
										name="dataResolution"
										as="select"
										data-width="'100px'"
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
										onChange={(event) =>
											changeGranularity(
												event.target.value,
												formik.setFieldValue,
												formik.values.timeMode,
												formik.values.fromDate,
												formik.values.toDate
											)
										}
										placeholder={t(
											"EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.MINUTE"
										)}
									>
										<option value="" hidden />
										{availableCustomDataResolutions.map((option, key) => (
											<option value={option.value} key={key}>
												{t("STATISTICS.TIME_GRANULARITIES." + option.label)}
											</option>
										))}
									</Field>
								</div>
							</div>
						</span>
					)}

					<br />
					{/* bar chart with visualization of statistic data */}
					<BarChart
						values={sourceData}
						axisLabels={chartLabels}
						options={chartOptions}
					/>

					{/* statistic description */}
					<p>{t(statDescription)}</p>
				</div>
			)}
		</Formik>
	);
};

export default TimeSeriesStatistics;
