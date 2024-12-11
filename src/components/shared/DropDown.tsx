import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	dropDownSpacingTheme,
	dropDownStyle,
} from "../../utils/componentStyles";
import {
	filterBySearch,
	formatDropDownOptions,
} from "../../utils/dropDownUtils";
import Select, { createFilter, GroupBase, MenuListProps, Props, SelectInstance } from "react-select";
import CreatableSelect from "react-select/creatable";
import { FixedSizeList, ListChildComponentProps } from "react-window";


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
	openMenuOnFocus = false,
	creatable = false,
	disabled = false,
	menuIsOpen = undefined,
	handleMenuIsOpen = undefined,
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
	openMenuOnFocus?: boolean,
	creatable?: boolean,
	disabled?: boolean,
	menuIsOpen?: boolean,
	handleMenuIsOpen?: (open: boolean) => void,
}) => {
	const { t } = useTranslation();

	const selectRef = React.useRef<SelectInstance<any, boolean, GroupBase<any>>>(null);

	const [searchText, setSearch] = useState("");

	const style = dropDownStyle(type);

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

  let commonProps: Props = {
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
		menuIsOpen: menuIsOpen,
		onMenuOpen: () => openMenu(true),
		onMenuClose: () => openMenu(false),
		isDisabled: disabled,
		openMenuOnFocus: openMenuOnFocus,
	};

	if (type === "aclRole") {
		// @ts-ignore Typing problem in library
		commonProps.components = { MenuList }
		commonProps.filterOption = createFilter({ ignoreAccents: false }) // To improve performance on filtering
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
