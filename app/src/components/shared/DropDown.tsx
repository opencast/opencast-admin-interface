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

export type DropDownType = "language" | "isPartOf" | "captureAgent" | "aclRole" | "workflow" | "aclTemplate" | "newTheme" | "comment" | "theme" | "time";

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
	tabIndex,
	autoFocus = false,
	defaultOpen = false,
	disabled = false,
}: {
	value: T
	text: string,
	options: any[],
	type: DropDownType
	required: boolean,
	handleChange: (option: {value: T, label: string} | null) => void
	placeholder: string
	tabIndex: number,
	autoFocus?: boolean,
	defaultOpen?: boolean,
	disabled?: boolean,
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
				value,
				required,
				t
			)}
			placeholder={placeholder}
			noOptionsMessage={() => "No matching results."}
			onInputChange={(value) => setSearch(value)}
			onChange={(element) => handleChange(element)}
			isDisabled={disabled}
		/>
	);
};

export default DropDown;
