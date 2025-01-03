import moment from "moment";
import "moment/min/locales.min";
import { getCurrentLanguageInformation } from "./utils";
import {
	statisticDateFormatStrings,
} from "../configs/statisticsConfig";

/**
 * This file contains functions that are needed for thunks for statistics
 */

/* creates callback function for formatting the labels of the xAxis in a statistics diagram */
const createXAxisTickCallback = (
	timeMode: "year" | "month",
	dataResolution: "yearly" | "monthly" | "daily" | "hourly",
	language: string
) => {
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

	return (value: moment.MomentInput) => {
		return moment(value).locale(language).format(formatString);
	};
};

/* creates callback function for the displayed label when hovering over a data point in a statistics diagram */
const createTooltipCallback = (
	timeMode: "year" | "month",
	dataResolution: "yearly" | "monthly" | "daily",
	language: string
) => {
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

	return (tooltipItem: { label: Date | string; value: string; }) => {
		const date = tooltipItem.label;
		const finalDate = moment(date).locale(language).format(formatString);
		return finalDate + ": " + tooltipItem.value;
	};
};

/* creates options for statistics chart */
export const createChartOptions = (
	timeMode: keyof typeof statisticDateFormatStrings,
	dataResolution: "yearly" | "monthly" | "daily"
) => {
	// Get info about the current language and its date locale
	const currentLanguageInfo = getCurrentLanguageInformation();
	let currentLanguage = "";
	if (currentLanguageInfo) {
		currentLanguage = currentLanguageInfo.dateLocale.code
	}

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
	resourceId: string,
	resourceType: string,
	providerId: string,
	from: Date | string,
	to: Date | string,
	dataResolution: string
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
