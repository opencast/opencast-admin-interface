import moment from "moment";
import { makeTwoDigits } from "./utils";

/**
 * This File contains methods concerning dates
 */

// check if date can be parsed
export const renderValidDate = (date: string) => {
  return !isNaN(Date.parse(date)) ? new Date(date) : ""
}

// transform relative date to an absolute date
export const relativeToAbsoluteDate = (relative: any, type: any, from: any) => {
	let localMoment = moment();

	let absolute;
	if (from) {
		absolute = localMoment.startOf(type);
	} else {
		absolute = localMoment.endOf(type);
	}

	absolute = absolute.add(relative, type);

	return absolute.toDate();
};

// transform from relative date span to filter value containing absolute dates
export const relativeDateSpanToFilterValue = (
// @ts-expect-error TS(7006): Parameter 'fromRelativeDate' implicitly has an 'an... Remove this comment to see the full error message
	fromRelativeDate,
// @ts-expect-error TS(7006): Parameter 'toRelativeDate' implicitly has an 'any'... Remove this comment to see the full error message
	toRelativeDate,
// @ts-expect-error TS(7006): Parameter 'type' implicitly has an 'any' type.
	type
) => {
	let fromAbsoluteDate = relativeToAbsoluteDate(fromRelativeDate, type, true);
	let toAbsoluteDate = relativeToAbsoluteDate(toRelativeDate, type, false);

	return (
		fromAbsoluteDate.toISOString() +
		"/" +
		toAbsoluteDate.toISOString()
	).toString();
};

// creates a date object from a date, hour and minute
// @ts-expect-error TS(7006): Parameter 'date' implicitly has an 'any' type.
export const makeDate = (date, hour, minute) => {
	const madeDate = new Date(date);
	madeDate.setHours(hour);
	madeDate.setMinutes(minute);

	return madeDate;
};

// calculates the duration between a start and end date in hours and minutes
// @ts-expect-error TS(7006): Parameter 'startDate' implicitly has an 'any' type... Remove this comment to see the full error message
export const calculateDuration = (startDate, endDate) => {
	const duration = (endDate - startDate) / 1000;
	const durationHours = (duration - (duration % 3600)) / 3600;
	const durationMinutes = (duration % 3600) / 60;

	return { durationHours, durationMinutes };
};

// sets the duration in the formik
// @ts-expect-error TS(7006): Parameter 'startDate' implicitly has an 'any' type... Remove this comment to see the full error message
const setDuration = (startDate, endDate, setFieldValue) => {
	const { durationHours, durationMinutes } = calculateDuration(
		startDate,
		endDate
	);

	setFieldValue("scheduleDurationHours", makeTwoDigits(durationHours));
	setFieldValue("scheduleDurationMinutes", makeTwoDigits(durationMinutes));
};

// checks if the time of the endDate is before the time of the startDate
// @ts-expect-error TS(7006): Parameter 'startDate' implicitly has an 'any' type... Remove this comment to see the full error message
const isEndBeforeStart = (startDate, endDate) => {
	return startDate > endDate;
};

// changes the start in the formik
const changeStart = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'start' implicitly has an 'any' type.
	start,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
// @ts-expect-error TS(7006): Parameter 'checkConflicts' implicitly has an 'any'... Remove this comment to see the full error message
	checkConflicts
) => {
	const startDate = makeDate(start.date, start.hour, start.minute);
	let endDate = makeDate(
		start.date,
		formikValues.scheduleEndHour,
		formikValues.scheduleEndMinute
	);

	if (isEndBeforeStart(startDate, endDate)) {
		endDate.setDate(startDate.getDate() + 1);
	}

	setDuration(startDate, endDate, setFieldValue);
	setFieldValue(
		"scheduleEndDate",
		new Date(endDate.setHours(0, 0, 0)).toISOString()
	);
	setFieldValue(
		"scheduleStartDate",
		new Date(startDate.setHours(0, 0, 0)).toISOString()
	);

	if (!!checkConflicts) {
		checkConflicts(
			eventId,
			startDate,
			endDate,
			formikValues.captureAgent
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		).then((r) => {});
	}
};

export const changeStartDate = (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeStart(
		eventId,
		{
			date: value,
			hour: formikValues.scheduleStartHour,
			minute: formikValues.scheduleStartMinute,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);
};

export const changeStartHour = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeStart(
		eventId,
		{
			date: formikValues.scheduleStartDate,
			hour: value,
			minute: formikValues.scheduleStartMinute,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleStartHour", value);
};

export const changeStartMinute = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeStart(
		eventId,
		{
			date: formikValues.scheduleStartDate,
			hour: formikValues.scheduleStartHour,
			minute: value,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleStartMinute", value);
};

// changes the end in the formik
const changeEnd = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'end' implicitly has an 'any' type.
	end,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
// @ts-expect-error TS(7006): Parameter 'checkConflicts' implicitly has an 'any'... Remove this comment to see the full error message
	checkConflicts
) => {
	const endDate = makeDate(
		formikValues.scheduleStartDate,
		end.hour,
		end.minute
	);
	const startDate = makeDate(
		formikValues.scheduleStartDate,
		formikValues.scheduleStartHour,
		formikValues.scheduleStartMinute
	);

	if (isEndBeforeStart(startDate, endDate)) {
		endDate.setDate(startDate.getDate() + 1);
	}

	setDuration(startDate, endDate, setFieldValue);
	setFieldValue(
		"scheduleEndDate",
		new Date(endDate.setHours(0, 0, 0)).toISOString()
	);

	if (!!checkConflicts) {
		checkConflicts(
			eventId,
			startDate,
			endDate,
			formikValues.captureAgent
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		).then((r) => {});
	}
};

export const changeEndHour = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeEnd(
		eventId,
		{
			hour: value,
			minute: formikValues.scheduleEndMinute,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleEndHour", value);
};

export const changeEndMinute = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeEnd(
		eventId,
		{
			hour: formikValues.scheduleEndHour,
			minute: value,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleEndMinute", value);
};

// changes the duration in the formik
const changeDuration = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'duration' implicitly has an 'any' type.
	duration,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
// @ts-expect-error TS(7006): Parameter 'checkConflicts' implicitly has an 'any'... Remove this comment to see the full error message
	checkConflicts
) => {
	const startDate = makeDate(
		formikValues.scheduleStartDate,
		formikValues.scheduleStartHour,
		formikValues.scheduleStartMinute
	);
	const endDate = new Date(startDate.toISOString());

	endDate.setHours(endDate.getHours() + parseInt(duration.hours));
	endDate.setMinutes(endDate.getMinutes() + parseInt(duration.minutes));

	setFieldValue("scheduleEndHour", makeTwoDigits(endDate.getHours()));
	setFieldValue("scheduleEndMinute", makeTwoDigits(endDate.getMinutes()));
	setFieldValue(
		"scheduleEndDate",
		new Date(endDate.setHours(0, 0, 0)).toISOString()
	);

	if (!!checkConflicts) {
		checkConflicts(
			eventId,
			startDate,
			endDate,
			formikValues.captureAgent
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		).then((r) => {});
	}
};

export const changeDurationHour = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeDuration(
		eventId,
		{
			hours: value,
			minutes: formikValues.scheduleDurationMinutes,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleDurationHours", value);
};

export const changeDurationMinute = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeDuration(
		eventId,
		{
			hours: formikValues.scheduleDurationHours,
			minutes: value,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleDurationMinutes", value);
};

// changes the start in the formik
const changeStartMultiple = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'start' implicitly has an 'any' type.
	start,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
// @ts-expect-error TS(7006): Parameter 'checkConflicts' implicitly has an 'any'... Remove this comment to see the full error message
	checkConflicts
) => {
	const startDate = makeDate(start.date, start.hour, start.minute);
	let endDate = makeDate(
		start.date,
		formikValues.scheduleEndHour,
		formikValues.scheduleEndMinute
	);

	if (isEndBeforeStart(startDate, endDate)) {
		endDate.setDate(startDate.getDate() + 1);
	}

	setDuration(startDate, endDate, setFieldValue);

	endDate = makeDate(
		formikValues.scheduleEndDate,
		formikValues.scheduleEndHour,
		formikValues.scheduleEndMinute
	);

	if (isEndBeforeStart(startDate, endDate)) {
		endDate.setDate(startDate.getDate() + 1);
	}

	setFieldValue(
		"scheduleEndDate",
		new Date(endDate.setHours(0, 0, 0)).toISOString()
	);
	setFieldValue(
		"scheduleStartDate",
		new Date(startDate.setHours(0, 0, 0)).toISOString()
	);

	if (isEndBeforeStart(startDate, endDate)) {
		endDate.setDate(startDate.getDate() + 1);
	}

	if (!!checkConflicts) {
		checkConflicts(
			eventId,
			startDate,
			endDate,
			formikValues.captureAgent
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		).then((r) => {});
	}
};

export const changeStartDateMultiple = (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeStartMultiple(
		eventId,
		{
			date: value,
			hour: formikValues.scheduleStartHour,
			minute: formikValues.scheduleStartMinute,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);
};

export const changeStartHourMultiple = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeStartMultiple(
		eventId,
		{
			date: formikValues.scheduleStartDate,
			hour: value,
			minute: formikValues.scheduleStartMinute,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleStartHour", value);
};

export const changeStartMinuteMultiple = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeStartMultiple(
		eventId,
		{
			date: formikValues.scheduleStartDate,
			hour: formikValues.scheduleStartHour,
			minute: value,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleStartMinute", value);
};

// changes the end in the formik
export const changeEndDateMultiple = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	const endDate = makeDate(
		value,
		formikValues.scheduleEndHour,
		formikValues.scheduleEndMinute
	);
	const startDate = makeDate(
		formikValues.scheduleStartDate,
		formikValues.scheduleStartHour,
		formikValues.scheduleStartMinute
	);

	if (isEndBeforeStart(startDate, endDate)) {
		startDate.setDate(endDate.getDate());
		if (isEndBeforeStart(startDate, endDate)) {
			startDate.setDate(endDate.getDate() - 1);
		}
	}

	setFieldValue(
		"scheduleEndDate",
		new Date(endDate.setHours(0, 0, 0)).toISOString()
	);
	setFieldValue(
		"scheduleStartDate",
		new Date(startDate.setHours(0, 0, 0)).toISOString()
	);

	if (!!checkConflicts) {
// @ts-expect-error TS(2349): This expression is not callable.
		checkConflicts(
			eventId,
			startDate,
			endDate,
			formikValues.captureAgent
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		).then((r) => {});
	}
};

// changes the end in the formik
const changeEndMultiple = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'end' implicitly has an 'any' type.
	end,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
// @ts-expect-error TS(7006): Parameter 'checkConflicts' implicitly has an 'any'... Remove this comment to see the full error message
	checkConflicts
) => {
	let endDate = makeDate(formikValues.scheduleStartDate, end.hour, end.minute);
	const startDate = makeDate(
		formikValues.scheduleStartDate,
		formikValues.scheduleStartHour,
		formikValues.scheduleStartMinute
	);

	if (isEndBeforeStart(startDate, endDate)) {
		endDate.setDate(startDate.getDate() + 1);
	}

	setDuration(startDate, endDate, setFieldValue);

	endDate = makeDate(formikValues.scheduleEndDate, end.hour, end.minute);

	if (isEndBeforeStart(startDate, endDate)) {
		endDate.setDate(startDate.getDate() + 1);
		setFieldValue(
			"scheduleEndDate",
			new Date(endDate.setHours(0, 0, 0)).toISOString()
		);
	}

	if (!!checkConflicts) {
		checkConflicts(
			eventId,
			startDate,
			endDate,
			formikValues.captureAgent
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		).then((r) => {});
	}
};

export const changeEndHourMultiple = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeEndMultiple(
		eventId,
		{
			hour: value,
			minute: formikValues.scheduleEndMinute,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleEndHour", value);
};

export const changeEndMinuteMultiple = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeEndMultiple(
		eventId,
		{
			hour: formikValues.scheduleEndHour,
			minute: value,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleEndMinute", value);
};

// changes the duration in the formik
const changeDurationMultiple = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'duration' implicitly has an 'any' type.
	duration,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
// @ts-expect-error TS(7006): Parameter 'checkConflicts' implicitly has an 'any'... Remove this comment to see the full error message
	checkConflicts
) => {
	const startDate = makeDate(
		formikValues.scheduleStartDate,
		formikValues.scheduleStartHour,
		formikValues.scheduleStartMinute
	);
	const endDate = makeDate(
		formikValues.scheduleEndDate,
		formikValues.scheduleStartHour,
		formikValues.scheduleStartMinute
	);

	endDate.setHours(endDate.getHours() + parseInt(duration.hours));
	endDate.setMinutes(endDate.getMinutes() + parseInt(duration.minutes));

	setFieldValue("scheduleEndHour", makeTwoDigits(endDate.getHours()));
	setFieldValue("scheduleEndMinute", makeTwoDigits(endDate.getMinutes()));
	setFieldValue(
		"scheduleEndDate",
		new Date(endDate.setHours(0, 0, 0)).toISOString()
	);

	if (!!checkConflicts) {
		checkConflicts(
			eventId,
			startDate,
			endDate,
			formikValues.captureAgent
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		).then((r) => {});
	}
};

export const changeDurationHourMultiple = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeDurationMultiple(
		eventId,
		{
			hours: value,
			minutes: formikValues.scheduleDurationMinutes,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleDurationHours", value);
};

export const changeDurationMinuteMultiple = async (
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	value,
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setFieldValue' implicitly has an 'any' ... Remove this comment to see the full error message
	setFieldValue,
	eventId = "",
	checkConflicts = null
) => {
	changeDurationMultiple(
		eventId,
		{
			hours: formikValues.scheduleDurationHours,
			minutes: value,
		},
		formikValues,
		setFieldValue,
		checkConflicts
	);

	setFieldValue("scheduleDurationMinutes", value);
};

// get localized time
// @ts-expect-error TS(7006): Parameter 'm' implicitly has an 'any' type.
export const localizedMoment = (m, currentLanguage) => {
	return moment(m).locale(currentLanguage.dateLocale.code);
};
