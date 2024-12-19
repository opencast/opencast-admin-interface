import { TFunction } from "i18next";
import { DropDownType } from './../components/shared/DropDown';
import { isJson } from "./utils";
import { createPolicyLabel } from "../components/shared/modals/ResourceDetailsAccessPolicyTab";
/*
 * this file contains functions, which are needed for the searchable drop-down selections
 */

export const filterBySearch = (filterText: string, type: DropDownType, options: any[], t: TFunction) => {
	if (type === "language") {
		return options.filter((item) =>
			t(item.name).toLowerCase().includes(filterText)
		);
	} else if (
		type === "isPartOf" ||
		type === "captureAgent" ||
		type === "aclRole" ||
		type === "newTheme"
	) {
		return options.filter((item) =>
			item.name.toLowerCase().includes(filterText)
		);
	} else if (type === "workflow") {
		return options.filter((item) =>
			item.title.toLowerCase().includes(filterText)
		);
	} else if (type === "comment") {
		return options.filter((item) =>
			t(item[0]).toLowerCase().includes(filterText)
		);
	} else if (type === "filter") {
		return options.filter((item) =>
			t(item.label).toLowerCase().includes(filterText)
		);
	} else {
		return options.filter((item) =>
			item.value.toLowerCase().includes(filterText)
		);
	}
};

/*
 * the Select component needs options to have an internal value and a displayed label
 * this function formats selection options as provided by the backend into that scheme
 * it takes the options and provides the correct label to display for this kind of metadata,
 * as well as adding an empty option, if available
 */
export const formatDropDownOptions = (
	unformattedOptions: any[],
	type: DropDownType,
	required: boolean,
	t: TFunction
) => {
	/**
	 * This is used to determine whether any entry of the passed `unformattedOptions`
	 * contains an `order` field, indicating that a custom ordering for that list
	 * exists and the list therefore should not be ordered alphabetically.
	 */
	const hasCustomOrder = unformattedOptions.every((item: any) =>
		isJson(item.name) && JSON.parse(item.name).order !== undefined);

	if (hasCustomOrder) {
		// Apply custom ordering. Needs to be done here because the order field isn't carried over
		// to the `formattedOptions`.
		unformattedOptions.sort((a: any, b: any) => JSON.parse(a.name).order - JSON.parse(b.name).order);
	}

	const formattedOptions = [];
	if (!required) {
		formattedOptions.push({
			value: "",
			label: `-- ${t("SELECT_NO_OPTION_SELECTED")} --`,
		});
	}
	if (type === "language" || type === "license") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.value,
				label: t(item.name),
			});
		}
	} else if (type === "isPartOf") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.value,
				label: item.name,
			});
		}
	} else if (type === "captureAgent") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.name,
				label: item.name,
			});
		}
	} else if (type === "aclRole") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.name,
				label: createPolicyLabel(item) ? createPolicyLabel(item) : item.name,
			});
		}
	} else if (type === "workflow") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.id,
				label: item.title,
			});
		}
	} else if (type === "aclTemplate") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.id,
				label: item.value,
			});
		}
	} else if (type === "newTheme") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.id,
				label: item.name,
			});
		}
	} else if (type === "comment") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item[0],
				label: t(item[1]),
			});
		}
	} else if (type === "filter") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.value,
				label: item.label,
			});
		}
	} else {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.value,
				label: item.value,
			});
		}
	}

	return hasCustomOrder
		? formattedOptions
		: formattedOptions.sort((a, b) => a.label.localeCompare(b.label));
};
