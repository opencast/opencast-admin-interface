import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	dropDownSpacingTheme,
	dropDownStyle,
} from "../../utils/componentStyles";
import {
	filterBySearch,
	formatDropDownOptions,
} from "../../utils/dropDownUtils";
import Select, { Props } from "react-select";
import CreatableSelect from "react-select/creatable";

/**
 * TODO: Ideally, we would remove "type", and just type the "options" array properly.
 * However, typing options is hard because
 *  - Creating reasonable generic typing is difficult, as different utility functions handle types for "options" differently
 *  - Creating typescript types for each "type" is moot atm, as a lot of them (i.e. capture agents) are not properly typed yet
 * I would suggest waiting with typing options until all of its inputs are properly typed
 */
export type DropDownType = "language" | "isPartOf" | "license" | "captureAgent" | "aclRole" | "workflow" | "aclTemplate" | "newTheme" | "comment" | "theme" | "time" | "filter";

/**
 * This component provides a bar chart for visualising (statistics) data
 */
const DropDown = <T,>({
	value,
	text,
	options,
	type,
	required,
	handleChange,
	placeholder,
	tabIndex = 0,
	autoFocus = false,
	defaultOpen = false,
	creatable = false,
	disabled = false,
}: {
	value: T
	text: string,
	options: any[],
	type: DropDownType
	required: boolean,
	handleChange: (option: {value: T, label: string} | null) => void
	placeholder: string
	tabIndex?: number,
	autoFocus?: boolean,
	defaultOpen?: boolean,
	creatable?: boolean,
	disabled?: boolean,
}) => {
	const { t } = useTranslation();

	const [searchText, setSearch] = useState("");

	const style = dropDownStyle(type);

	const commonProps: Props = {
		tabIndex: tabIndex,
		theme: (theme) => (dropDownSpacingTheme(theme)),
		styles: style,
		defaultMenuIsOpen: defaultOpen,
		autoFocus: autoFocus,
		isSearchable: true,
		value: { value: value, label: text === "" ? placeholder : text },
		inputValue: searchText,
		options: formatDropDownOptions(
			filterBySearch(searchText.toLowerCase(), type, options, t),
			type,
			required,
			t
		),
		placeholder: placeholder,
		onInputChange: (value: string) => setSearch(value),
		onChange: (element) => handleChange(element as {value: T, label: string}),
		isDisabled: disabled,
	};

	return creatable ? (
		<CreatableSelect
			{...commonProps}
		/>
	) : (
		<Select
			{...commonProps}
			noOptionsMessage={() => t("SELECT_NO_MATCHING_RESULTS")}
		/>
	);
};

export default DropDown;
