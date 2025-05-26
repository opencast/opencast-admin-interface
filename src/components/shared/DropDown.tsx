import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	dropDownSpacingTheme,
	dropDownStyle,
} from "../../utils/componentStyles";
import Select, { GroupBase, Props, SelectInstance } from "react-select";
import CreatableSelect from "react-select/creatable";
import { isJson } from "../../utils/utils";
import { ParseKeys } from "i18next";

export type DropDownOption = {
	label: string,
	value: string | number,
	order?: number
}

/**
 * This component provides a bar chart for visualising (statistics) data
 */
const DropDown = <T, >({
	ref = React.createRef<SelectInstance<any, boolean, GroupBase<any>>>(),
	value,
	text,
	options,
	required,
	handleChange,
	placeholder,
	tabIndex = 0,
	autoFocus = false,
	defaultOpen = false,
	openMenuOnFocus = false,
	creatable = false,
	disabled = false,
	menuIsOpen = undefined,
	handleMenuIsOpen = undefined,
	customCSS,
}: {
	ref?: React.RefObject<SelectInstance<any, boolean, GroupBase<any>> | null>
	value: T
	text: string,
	options: DropDownOption[],
	required: boolean,
	handleChange: (option: {value: T, label: string} | null) => void
	placeholder: string
	tabIndex?: number,
	autoFocus?: boolean,
	defaultOpen?: boolean,
	openMenuOnFocus?: boolean,
	creatable?: boolean,
	disabled?: boolean,
	menuIsOpen?: boolean,
	handleMenuIsOpen?: (open: boolean) => void,
	menuPlacement?: 'auto' | 'top' | 'bottom',
	customCSS?: {
		isMetadataStyle?: boolean,
		width?: number | string,
		optionPaddingTop?: number,
		optionLineHeight?: string
	}
}) => {
	const { t } = useTranslation();

	const selectRef = ref;

	const [searchText, setSearch] = useState("");

	const style = dropDownStyle(customCSS ?? {});

	useEffect(() => {
		// Ensure menu has focus when opened programmatically
		if (menuIsOpen) {
			selectRef.current?.focus();
		}
	}, [menuIsOpen, selectRef]);

	const openMenu = (open: boolean) => {
		if (handleMenuIsOpen !== undefined) {
			handleMenuIsOpen(open);
		}
	}

	const formatOptions = (
		unformattedOptions: DropDownOption[],
		filterText: string,
		required: boolean,
	) => {
		// Translate?
		unformattedOptions = unformattedOptions.map(option => ({...option, label: t(option.label as ParseKeys)}))

		// Filter
		filterText = filterText.toLowerCase();
		unformattedOptions = unformattedOptions.filter(option => option.label.toLowerCase().includes(filterText));

		// Add "No value" option
		if (!required) {
			unformattedOptions.push({
				value: "",
				label: `-- ${t("SELECT_NO_OPTION_SELECTED")} --`,
			});
		}

		// Sort
		/**
		 * This is used to determine whether any entry of the passed `unformattedOptions`
		 * contains an `order` field, indicating that a custom ordering for that list
		 * exists and the list therefore should not be ordered alphabetically.
		 */
		const hasCustomOrder = unformattedOptions.every((item) =>
			isJson(item.label) && JSON.parse(item.label).order !== undefined);

		if (hasCustomOrder) {
			// Apply custom ordering.
			unformattedOptions.sort((a, b) => JSON.parse(a.label).order - JSON.parse(b.label).order);
		} else {
			// Apply alphabetical ordering.
			unformattedOptions.sort((a, b) => a.label.localeCompare(b.label))
		}

		return unformattedOptions;
	};


  let commonProps: Props = {
	  	menuPlacement: 'auto',
		tabIndex: tabIndex,
		theme: (theme) => (dropDownSpacingTheme(theme)),
		styles: style,
		defaultMenuIsOpen: defaultOpen,
		autoFocus: autoFocus,
		isSearchable: true,
		value: { value: value, label: text === "" ? placeholder : text },
		inputValue: searchText,
		options: formatOptions(
			options,
			searchText,
			required,
		),
		placeholder: placeholder,
		onInputChange: (value: string) => setSearch(value),
		onChange: (element) => handleChange(element as {value: T, label: string}),
		menuIsOpen: menuIsOpen,
		onMenuOpen: () => openMenu(true),
		onMenuClose: () => openMenu(false),
		isDisabled: disabled,
		openMenuOnFocus: openMenuOnFocus,
	};

	return creatable ? (
		<CreatableSelect
			ref={selectRef}
			{...commonProps}
		/>
	) : (
		<Select
			ref={selectRef}
			{...commonProps}
			noOptionsMessage={() => t("SELECT_NO_MATCHING_RESULTS")}
		/>
	);
};

export default DropDown;
