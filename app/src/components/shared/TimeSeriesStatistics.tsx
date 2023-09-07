import React from "react";
import moment from "moment";
import { getCurrentLanguageInformation } from "../../utils/utils";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker } from "@material-ui/pickers";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { Field, Formik } from "formik";
// @ts-expect-error TS(6142): Module './BarChart' was resolved to '/home/arnewil... Remove this comment to see the full error message
import BarChart from "./BarChart";
import {
	availableCustomStatisticDataResolutions,
	fixedStatisticDataResolutions,
	statisticDateFormatStrings,
	statisticTimeModes,
} from "../../configs/statisticsConfig";
import { localizedMoment } from "../../utils/dateUtils";

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
	// Style to bring date picker pop up to front
	const theme = createTheme({
		props: {
			MuiDialog: {
				style: {
					zIndex: "2147483550",
				},
			},
		},
	});

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
// @ts-expect-error TS(2554): Expected 5 arguments, but got 6.
		change(setFormikValue, timeMode, newFrom, to, dataResolution: any);
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<MuiPickersUtilsProvider
			utils={DateFnsUtils}
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
			locale={currentLanguage.dateLocale}
		>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="statistics-graph">
						{/* download link for a statistic file */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="download">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<a
								className="download-icon"
								href={exportUrl}
								download={exportFileName(statTitle)}
							/>
						</div>

						{/* radio buttons for selecting the mode of choosing the timeframe of statistic */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="mode">
							{timeModes.map((mode, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<label
									htmlFor={providerId + "-mode-" + key}
									style={
										formik.values.timeMode === mode.value
											? radioButtonStyle
											: {}
									}
									key={key}
								>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="total">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span>{t("STATISTICS.TOTAL") /* Total */}</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span>{": " + totalValue}</span>
						</div>

						{/* timeframe selection */}

						{(formik.values.timeMode === "year" ||
							formik.values.timeMode === "month") && (
							/* year/month selection for statistic via previous and next buttons */
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span className="preset">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div>
									{formatSelectedTimeframeName(
										formik.values.fromDate,
										formik.values.timeMode
									)}
								</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<span className="custom">
								{/* time range selection */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="range">
									{/* date picker for selecting start date of the statistic */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<span>{t("STATISTICS.FROM") /* From */}</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="chosen-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<ThemeProvider theme={theme}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<DatePicker
												name="fromDate"
												style={datePickerStyle}
												value={formik.values.fromDate}
												placeholder={t(
													"EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.START_DATE"
												)}
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
										</ThemeProvider>
									</div>

									{/* date picker for selecting end date of the statistic */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<span>{t("STATISTICS.TO") /* To */}</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="chosen-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<ThemeProvider theme={theme}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<DatePicker
												name="toDate"
												style={datePickerStyle}
												value={formik.values.toDate}
												placeholder={t(
													"EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.END_DATE"
												)}
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
										</ThemeProvider>
									</div>
								</div>

								{/* time granularity selection */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<span>
										{t("STATISTICS.GRANULARITY") + " " /* Granularity */}
									</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="chosen-container chosen-container-single">
										{/* drop-down for selecting the time granularity of the statistic */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<option value="" hidden />
											{availableCustomDataResolutions.map((option, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<option value={option.value} key={key}>
													{t("STATISTICS.TIME_GRANULARITIES." + option.label)}
												</option>
											))}
										</Field>
									</div>
								</div>
							</span>
						)}

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<br />
						{/* bar chart with visualization of statistic data */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<BarChart
							values={sourceData}
							axisLabels={chartLabels}
							options={chartOptions}
						/>

						{/* statistic description */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<p>{t(statDescription)}</p>
					</div>
				)}
			</Formik>
		</MuiPickersUtilsProvider>
	);
};

export default TimeSeriesStatistics;
