import languages from "../i18n/languages";
import i18n from "../i18n/i18n";
import { TFunction } from "i18next";
import { UserInfoState } from "../slices/userInfoSlice";

/**
 * This File contains methods that are needed in more than one places
 */

export const getTimezoneOffset = () => {
	let d = new Date();
	let offset = d.getTimezoneOffset() * -1;

	return offset / 60;
};

export const getTimezoneString = (offset: number) => {
	return "UTC" + (offset < 0 ? "-" : "+") + offset;
};

export const getCurrentLanguageInformation = () => {
	// Get code, flag, name and date locale of the current language
	let currentLang = languages.find(({ code }) => code === i18n.language);
	if (typeof currentLang === "undefined") {
		currentLang = languages.find(({ code }) => code === "en-US");
	}

	return currentLang;
};

// fills an array from 00 to number of elements specified
export const initArray = (numberOfElements: number) => {
	let i,
		result = [];
	for (i = 0; i < numberOfElements; i++) {
		result.push({
			index: i,
			value: makeTwoDigits(i),
		});
	}
	return result;
};

// insert leading 0 for numbers smaller 10
export const makeTwoDigits = (number: number) => {
	if (number < 10) {
		return "0" + number;
	} else {
		return "" + number;
	}
};

/*
 * transforms an object of form { id1: value1, id2: value2 }
 * to [{id: id1, value: value1},{id: id2, value: value2}]
 */
export const transformToIdValueArray = (data: {[key: string | number]: string}) => {
	return Object.keys(data).map((key) => {
		return {
			id: key,
			value: data[key],
		};
	});
};

/*
 * transforms an object of form { id1: object1, id2: object2 }
 * to [
   {
      "id":id1,
      "objectValue":value1,
      "otherObjectValue":otherValue1
   },
   {
      "id":id2,
      "objectValue":value2,
      "otherObjectValue":otherValue2
   }
]
 */
export const transformToObjectArray = (data: {[key: string | number]: any}) => {
	return Object.keys(data).map((key) => {
		return {
			id: key,
			...data[key],
		};
	});
};

/*
 * iterates trough all attributes in an object and switches 'true'- and 'false'-Strings
 * to their corresponding boolean value. All other values stay the same.
 */
export const parseBooleanInObject = (baseObject: {[key: string]: any}) => {
	let parsedObject: {[key: string]: any} = {};

	Object.keys(baseObject).forEach((config) => {
		parsedObject[config] = parseValueForBooleanStrings(baseObject[config]);
	});

	return parsedObject;
};

/*
 * switches 'true'- and 'false'-Strings
 * to their corresponding boolean value. All other kinds of values stay the same.
 */
export const parseValueForBooleanStrings = (value: any) => {
	let parsedValue = value;
	if (parsedValue === "true") {
		parsedValue = true;
	} else if (parsedValue === "false") {
		parsedValue = false;
	}

	return parsedValue;
};

/*
 * checks if a user is admin or has the required role to access an ui element
 */
export const hasAccess = (role: string, userInfo: UserInfoState) => {
	return !!(userInfo.isAdmin || userInfo.roles.includes(role));
};

// checks, if a String is proper JSON
export const isJson = (text: string) => {
	try {
		const json = JSON.parse(text);
		const type = Object.prototype.toString.call(json);
		return type === "[object Object]" || type === "[object Array]";
	} catch (e) {
		return false;
	}
};

/**
 * Handles translation for assets with overrides or fallbacks in their
 * translation as defined in Opencast documentation under
 * /docs/guides/admin/docs/configuration/admin-ui/asset-upload.md
 *
 * Asset is expected to have a field "title" that contains a translation string
 * t is the hook returned by i18next.useTranslation
 * suffix further specifies the asset value if necessary, e.g. "SHORT" for "displayOverride.SHORT"
 */
export const translateOverrideFallback = (asset: any, t: TFunction, suffix?: string) => {
	let result = undefined;
	const sub = !!suffix ? "." + suffix : "";
	const translatable = asset["title"] + sub;

	if (asset['displayOverride' + sub]) {
		result = asset['displayOverride' + sub];

	} else if (i18n.exists(translatable)) {
		result = t(translatable);

	} else if (asset['displayFallback' + sub]) {
		result = asset['displayFallback' + sub];

	} else {
		// no translate, override, or fallback, use what is given
		result = translatable;
	}

	return result;
}
