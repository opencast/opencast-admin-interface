import React from "react";
import moment from "moment";
import { getCurrentLanguageInformation } from "../../utils/utils";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Formik, FormikErrors } from "formik";
import { Field } from "./Field";
import BarChart from "./BarChart";
import {
	availableCustomStatisticDataResolutions,
	fixedStatisticDataResolutions,
	statisticDateFormatStrings,
	statisticTimeModes,
} from "../../configs/statisticsConfig";
import { localizedMoment } from "../../utils/dateUtils";
import { parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import type { ChartOptions } from 'chart.js';
import { AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../store";
import { DataResolution, TimeMode } from "../../slices/statisticsSlice";


/**
 * This component visualizes statistics with data of type time series
 */
const TimeSeriesStatistics = ({
	resourceId,
	statTitle,
	providerId,
	fromDate,
	toDate,
	timeMode,
	dataResolution,
	statDescription,
	onChange,
	exportUrl,
	exportFileName,
	totalValue,
	sourceData,
	chartLabels,
	chartOptions,
}: {
	resourceId: string,
	statTitle: string,
	providerId: string,
	fromDate: string,
	toDate: string,
	timeMode: TimeMode,
	dataResolution: DataResolution,
	statDescription: string,
	onChange: AsyncThunk<undefined, { id: string, providerId: string, from: string | Date, to: string | Date, dataResolution: DataResolution, timeMode: TimeMode, }, any>,
	exportUrl: string,
	exportFileName: (statsTitle: string) => string,
	totalValue: number,
	sourceData: number[],
	chartLabels: string[],
	chartOptions: ChartOptions<'bar'>,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

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
	const change = (
		setFormikValue: (field: string, value: any) => Promise<void | FormikErrors<any>>,
		timeMode: TimeMode,
		from: string | Date,
		to: string | Date,
		dataResolution: DataResolution
	) => {
		if (timeMode === "year" || timeMode === "month") {
			from = moment(from).clone().startOf(timeMode).format("YYYY-MM-DD");
			to = moment(from).clone().endOf(timeMode).format("YYYY-MM-DD");
			setFormikValue("fromDat0e", from);
			setFormikValue("toDate", to);
			setFormikValue("dataResolution", fixedDataResolutions(timeMode));
			dataResolution = fixedStatisticDataResolutions(timeMode);
		}

		dispatch(onChange({id: resourceId, providerId, from, to, dataResolution, timeMode}));
	};

	// change time mode in formik and get new values from API
	const changeTimeMode = async (
		newTimeMode: TimeMode,
		setFormikValue: (field: string, value: any) => Promise<void | FormikErrors<any>>,
		from: string,
		to: string,
		dataResolution: DataResolution
	) => {
		setFormikValue("timeMode", newTimeMode);
		change(setFormikValue, newTimeMode, from, to, dataResolution);
	};

	// change custom from date in formik and get new values from API
	const changeFrom = async (
		newFrom: Date,
		setFormikValue: (field: string, value: any) => Promise<void | FormikErrors<any>>,
		timeMode: TimeMode,
		to: string,
		dataResolution: DataResolution,
	) => {
		setFormikValue("fromDate", newFrom);
		change(setFormikValue, timeMode, newFrom, to, dataResolution);
	};

	// change custom to date in formik and get new values from API
	const changeTo = async (
		newTo: Date,
		setFormikValue: (field: string, value: any) => Promise<void | FormikErrors<any>>,
		timeMode: TimeMode,
		from: string,
		dataResolution: DataResolution
	) => {
		setFormikValue("toDate", newTo);
		change(setFormikValue, timeMode, from, newTo, dataResolution);
	};

	// change custom time granularity in formik and get new values from API
	const changeGranularity = async (
		granularity: DataResolution,
		setFormikValue: (field: string, value: any) => Promise<void | FormikErrors<any>>,
		timeMode: TimeMode,
		from: string,
		to: string,
	) => {
		setFormikValue("dataResolution", granularity);
		change(setFormikValue, timeMode, from, to, granularity);
	};

	// format selected time to display as name of timeframe
	const formatSelectedTimeframeName = (
		from: string,
		timeMode: keyof typeof formatStrings
	) => {
		return localizedMoment(from, currentLanguage ? currentLanguage.dateLocale.code : "en").format(
			formatStrings[timeMode]
		);
	};

	// change to and from dates in formik to previous timeframe and get new values from API
	const selectPrevious = (
		setFormikValue: (field: string, value: any) => Promise<void | FormikErrors<any>>,
		from: string,
		timeMode: TimeMode,
		dataResolution: DataResolution,
	) => {
		const newFrom = moment(from)
			// According to the moment.js docs, string is supported as a second argument here
			.subtract(1, timeMode + "s" as moment.unitOfTime.DurationConstructor)
			.format("YYYY-MM-DD");
		const to = newFrom;
		change(setFormikValue, timeMode, newFrom, to, dataResolution);
	};

	// change to and from dates in formik to next timeframe and get new values from API
	const selectNext = (
		setFormikValue: (field: string, value: any) => Promise<void | FormikErrors<any>>,
		from: string,
		timeMode: TimeMode,
		dataResolution: DataResolution,
	) => {
		const newFrom = moment(from)
			// According to the moment.js docs, string is supported as a second argument here
			.add(1, timeMode + "s" as moment.unitOfTime.DurationConstructor)
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
				// Typescript complains that the method "startOf" cannot take "custom" as a parameter, but in practice
				// this does not seem to be a problem
				//@ts-ignore
				fromDate: moment(fromDate).startOf(timeMode).format("YYYY-MM-DD"),
				//@ts-ignore
				toDate: moment(toDate).endOf(timeMode).format("YYYY-MM-DD"),
			}}
			onSubmit={(values) => {}}
		>
			{(formik) => (
				<div className="statistics-graph">
					{/* download link for a statistic file */}
					<div className="download">
						{/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
						<a
							className="download-icon"
							href={exportUrl}
							download={exportFileName(statTitle)}
						/>
					</div>

					{/* statistics total value */}
					<div className="total">
						<span>{t("STATISTICS.TOTAL") /* Total */}</span>
						<span>{": " + totalValue}</span>
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

					{/* timeframe selection */}

					{(formik.values.timeMode === "year" ||
						formik.values.timeMode === "month") && (
						/* year/month selection for statistic via previous and next buttons */
						<span className="preset">
							{/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */}
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
							{/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */}
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
										onChange={(value) => {
											if (value) {
												changeFrom(
													value,
													formik.setFieldValue,
													formik.values.timeMode,
													formik.values.toDate,
													formik.values.dataResolution
												)
											}
										}}
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
										onChange={(value) => {
											if (value) {
												changeTo(
													value,
													formik.setFieldValue,
													formik.values.timeMode,
													formik.values.fromDate,
													formik.values.dataResolution
												)
											}
										}}
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
