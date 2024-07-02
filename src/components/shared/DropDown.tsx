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
import Select from "react-select";

/**
 * TODO: Ideally, we would remove "type", and just type the "options" array properly.
 * However, typing options is hard because
 * 	- Creating reasonable generic typing is difficult, as different utility functions handle types for "options" differently
 *  - Creating typescript types for each "type" is moot atm, as a lot of them (i.e. capture agents) are not properly typed yet
 * I would suggest waiting with typing options until all of its inputs are properly typed
 */
export type DropDownType = "language" | "isPartOf" | "license" | "captureAgent" | "aclRole" | "workflow" | "aclTemplate" | "newTheme" | "comment" | "theme" | "time";

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
	disabled = false,
	ariaLabel,
	ariaRequired = false
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
	disabled?: boolean,
	ariaLabel?: string
	ariaRequired?: boolean
}) => {
	const { t } = useTranslation();

	const [searchText, setSearch] = useState("");

	const style = dropDownStyle(type);

	return (
		<Select
			tabIndex={tabIndex}
			theme={dropDownSpacingTheme}
			styles={style}
			defaultMenuIsOpen={defaultOpen}
			autoFocus={autoFocus}
			isSearchable
			value={{ value: value, label: text === "" ? placeholder : text }}
			inputValue={searchText}
			options={formatDropDownOptions(
				filterBySearch(searchText.toLowerCase(), type, options, t),
				type,
				required,
				t
			)}
			placeholder={placeholder}
			noOptionsMessage={() => "No matching results."}
			onInputChange={(value) => setSearch(value)}
			onChange={(element) => handleChange(element)}
			isDisabled={disabled}
			aria-label={ariaLabel}
			aria-required={ariaRequired}
		/>
	);
};

export default DropDown;
