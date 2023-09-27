/*
 * this file contains functions, which are needed for the searchable drop-down selections
 */

export const filterBySearch = (filterText: any, type: any, options: any, t: any) => {
	if (type === "language") {
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
		return options.filter((item) =>
			t(item.name).toLowerCase().includes(filterText)
		);
	} else if (
		type === "isPartOf" ||
		type === "captureAgent" ||
		type === "aclRole" ||
		type === "newTheme"
	) {
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
		return options.filter((item) =>
			item.name.toLowerCase().includes(filterText)
		);
	} else if (type === "workflow") {
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
		return options.filter((item) =>
			item.title.toLowerCase().includes(filterText)
		);
	} else if (type === "comment") {
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
		return options.filter((item) =>
			t(item[0]).toLowerCase().includes(filterText)
		);
	} else {
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
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
// @ts-expect-error TS(7006): Parameter 'unformattedOptions' implicitly has an '... Remove this comment to see the full error message
	unformattedOptions,
// @ts-expect-error TS(7006): Parameter 'type' implicitly has an 'any' type.
	type,
// @ts-expect-error TS(7006): Parameter 'currentValue' implicitly has an 'any' t... Remove this comment to see the full error message
	currentValue,
// @ts-expect-error TS(7006): Parameter 'required' implicitly has an 'any' type.
	required,
// @ts-expect-error TS(7006): Parameter 't' implicitly has an 'any' type.
	t
) => {
	const formattedOptions = [];
	if (!required) {
		formattedOptions.push({
			value: "",
			label: `-- ${t("SELECT_NO_OPTION_SELECTED")} --`,
		});
	}
	if (type === "language") {
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
	} else if (type === "captureAgent" || type === "aclRole") {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.name,
				label: item.name,
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
	} else {
		for (const item of unformattedOptions) {
			formattedOptions.push({
				value: item.value,
				label: item.value,
			});
		}
	}

	return formattedOptions;
};
