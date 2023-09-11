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
 * This component provides a bar chart for visualising (statistics) data
 */
const DropDown = ({
// @ts-expect-error TS(7031): Binding element 'value' implicitly has an 'any' ty... Remove this comment to see the full error message
	value,
// @ts-expect-error TS(7031): Binding element 'text' implicitly has an 'any' typ... Remove this comment to see the full error message
	text,
// @ts-expect-error TS(7031): Binding element 'options' implicitly has an 'any' ... Remove this comment to see the full error message
	options,
// @ts-expect-error TS(7031): Binding element 'type' implicitly has an 'any' typ... Remove this comment to see the full error message
	type,
// @ts-expect-error TS(7031): Binding element 'required' implicitly has an 'any'... Remove this comment to see the full error message
	required,
// @ts-expect-error TS(7031): Binding element 'handleChange' implicitly has an '... Remove this comment to see the full error message
	handleChange,
// @ts-expect-error TS(7031): Binding element 'placeholder' implicitly has an 'a... Remove this comment to see the full error message
	placeholder,
// @ts-expect-error TS(7031): Binding element 'tabIndex' implicitly has an 'any'... Remove this comment to see the full error message
	tabIndex,
	autoFocus = false,
	defaultOpen = false,
	disabled = false,
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
