import moment from "moment";
import "moment/min/locales.min";
import { getCurrentLanguageInformation } from "./utils";

/**
 * This file contains functions that are needed for thunks for statistics
 */

/* creates callback function for formatting the labels of the xAxis in a statistics diagram */
const createXAxisTickCallback = (timeMode: any, dataResolution: any, language: any) => {
	let formatString = "L";
	if (timeMode === "year") {
		formatString = "MMMM";
	} else if (timeMode === "month") {
		formatString = "dddd, Do";
	} else {
		if (dataResolution === "yearly") {
			formatString = "YYYY";
		} else if (dataResolution === "monthly") {
			formatString = "MMMM";
		} else if (dataResolution === "daily") {
			if (language === "en-US" || language === "en-GB") {
				formatString = "MMMM Do, YYYY";
			} else {
				formatString = "Do MMMM YYYY";
			}
		} else if (dataResolution === "hourly") {
			formatString = "LLL";
		}
	}

// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	return (value, index, ticks) => {
		return moment(value).locale(language).format(formatString);
	};
};

/* creates callback function for the displayed label when hovering over a data point in a statistics diagram */
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
const createTooltipCallback = (timeMode, dataResolution, language) => {
	let formatString;
	if (timeMode === "year") {
		formatString = "MMMM YYYY";
	} else if (timeMode === "month") {
		if (language === "en-US" || language === "en-GB") {
			formatString = "dddd, MMMM Do, YYYY";
		} else {
			formatString = "dddd, Do MMMM YYYY";
		}
	} else {
		if (dataResolution === "yearly") {
			formatString = "YYYY";
		} else if (dataResolution === "monthly") {
			formatString = "MMMM YYYY";
		} else if (dataResolution === "daily") {
			if (language === "en-US" || language === "en-GB") {
				formatString = "dddd, MMMM Do, YYYY";
			} else {
				formatString = "dddd, Do MMMM YYYY";
			}
		} else {
			if (language === "en-US" || language === "en-GB") {
				formatString = "dddd, MMMM Do, YYYY HH:mm";
			} else {
				formatString = "dddd, Do MMMM YYYY, HH:mm";
			}
		}
	}

// @ts-expect-error TS(7006): Parameter 'tooltipItem' implicitly has an 'any' ty... Remove this comment to see the full error message
	return (tooltipItem) => {
		const date = tooltipItem.label;
		const finalDate = moment(date).locale(language).format(formatString);
		return finalDate + ": " + tooltipItem.value;
	};
};

/* creates options for statistics chart */
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
export const createChartOptions = (timeMode, dataResolution) => {
	// Get info about the current language and its date locale
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
	const currentLanguage = getCurrentLanguageInformation().dateLocale.code;

	return {
		responsive: true,
		legend: {
			display: false,
		},
		layout: {
			padding: {
				top: 20,
				left: 20,
				right: 20,
			},
		},
		scales: {
			xAxes: [
				{
					ticks: {
						callback: createXAxisTickCallback(
							timeMode,
							dataResolution,
							currentLanguage
						),
					},
				},
			],
			y: {
				suggestedMin: 0,
			},
		},
		tooltips: {
			callbacks: {
				label: createTooltipCallback(timeMode, dataResolution, currentLanguage),
			},
		},
	};
};

/* creates the url for downloading a csv file with current statistics */
export const createDownloadUrl = (
// @ts-expect-error TS(7006): Parameter 'resourceId' implicitly has an 'any' typ... Remove this comment to see the full error message
	resourceId,
// @ts-expect-error TS(7006): Parameter 'resourceType' implicitly has an 'any' t... Remove this comment to see the full error message
	resourceType,
// @ts-expect-error TS(7006): Parameter 'providerId' implicitly has an 'any' typ... Remove this comment to see the full error message
	providerId,
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
	from,
// @ts-expect-error TS(7006): Parameter 'to' implicitly has an 'any' type.
	to,
// @ts-expect-error TS(7006): Parameter 'dataResolution' implicitly has an 'any'... Remove this comment to see the full error message
	dataResolution
) => {
	const csvUrlSearchParams = new URLSearchParams({
		dataResolution: dataResolution,
		providerId: providerId,
		resourceId: resourceId,
		resourceType: resourceType,
		from: moment(from).toJSON(),
		to: moment(to).endOf("day").toJSON(),
	});

	return "/admin-ng/statistics/export.csv?" + csvUrlSearchParams;
};
