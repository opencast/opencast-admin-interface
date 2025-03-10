import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	dropDownSpacingTheme,
	dropDownStyle,
} from "../../utils/componentStyles";
import Select, { createFilter, GroupBase, MenuListProps, Props, SelectInstance } from "react-select";
import CreatableSelect from "react-select/creatable";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { isJson } from "../../utils/utils";

export type DropDownOption = {
	label: string,
	value: string | number,
	order?: number
}

/**
 * This component provides a bar chart for visualising (statistics) data
 */
const DropDown = <T,>({
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
	improvePerformanceExperimental = false,
}: {
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
	customCSS?: {
		width?: number | string,
		optionPaddingTop?: number,
		optionLineHeight?: string
	},
	improvePerformanceExperimental?: boolean,
}) => {
	const { t } = useTranslation();

	const selectRef = React.useRef<SelectInstance<any, boolean, GroupBase<any>>>(null);

	const style = dropDownStyle(customCSS ?? {});

	useEffect(() => {
		// Ensure menu has focus when opened programmatically
		if (menuIsOpen) {
			selectRef.current?.focus();
		}
	}, [menuIsOpen, selectRef]);

	const openMenu = (open: boolean) => {
		if (handleMenuIsOpen !== undefined && menuIsOpen !== undefined) {
			handleMenuIsOpen(open);
		}
	}

	const formatOptions = (
		unformattedOptions: DropDownOption[],//any[],
		required: boolean,
	) => {
		// Translate?
		unformattedOptions = unformattedOptions.map(option => ({...option, label: t(option.label)}));

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
		tabIndex: tabIndex,
		theme: (theme) => (dropDownSpacingTheme(theme)),
		styles: style,
		defaultMenuIsOpen: defaultOpen,
		autoFocus: autoFocus,
		isSearchable: true,
		value: { value: value, label: text === "" ? placeholder : text },
		options: formatOptions(
			options,
			required,
		),
		placeholder: placeholder,
		onChange: (element) => handleChange(element as {value: T, label: string}),
		menuIsOpen: menuIsOpen,
		onMenuOpen: () => openMenu(true),
		onMenuClose: () => openMenu(false),
		isDisabled: disabled,
		openMenuOnFocus: openMenuOnFocus,
	};

	if (improvePerformanceExperimental) {
		// @ts-ignore Typing problem in library
		commonProps.components = { MenuList }
		commonProps.filterOption = createFilter({
			ignoreAccents: false, // To improve performance on filtering
		})
	}

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

type OptionType = {
	label: string
	value: string
}

/**
 * Use react-window to improve performance for Dropdowns with many options
 */
const MenuList = (props: MenuListProps<OptionType, false, GroupBase<OptionType>>) => {
	// TODO: make itemHeight dynamic
	const itemHeight = 35
	const { options, children, maxHeight, getValue } = props
	const [value] = getValue()
	const initialOffset = options.indexOf(value) * itemHeight

	return Array.isArray(children) ? (
		<div style={{ paddingTop: 4 }}>
			<FixedSizeList
				height={maxHeight}
				itemCount={children.length}
				itemSize={itemHeight}
				initialScrollOffset={initialOffset}
				width="100%"
			>
				{({ index, style }: ListChildComponentProps) => <div style={{ ...style }}>{children[index]}</div>}
			</FixedSizeList>
		</div>
	) : null
}
