import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import cn from "classnames";
import { getMetadataCollectionFieldName } from "../../../utils/resourceUtils";
import { getCurrentLanguageInformation } from "../../../utils/utils";
import DropDown, { DropDownType } from "../DropDown";
import { parseISO } from "date-fns";
import { FieldProps } from "formik";
import { MetadataField } from "../../../slices/eventSlice";
import { GroupBase, SelectInstance } from "react-select";

/**
 * This component renders an editable field for single values depending on the type of the corresponding metadata
 */
const RenderField = ({
	field,
	metadataField,
	form,
	showCheck = false,
	isFirstField = false,
}: {
	field: FieldProps["field"]
	metadataField: MetadataField
	form: FieldProps["form"]
	showCheck?: boolean,
	isFirstField?: boolean,
}) => {
	const { t } = useTranslation();

	// TODO: Figure out how to type a ref that could have multiple types
	const editableRef = useRef<any>(null);
	const [focused, setFocused] = useState(false);
	const onFocus = () => setFocused(true);
	const onBlur = () => setFocused(false);

	return (
		<div
			onClick={() => {
				if(editableRef.current) {
					editableRef.current.focus && editableRef.current.focus()
					editableRef.current.setFocus && editableRef.current.setFocus() // For DatePicker
				}
			}}
			style={{display: "flex", justifyContent: "space-between"}}
		>
			{metadataField.type === "time" && (
				<EditableSingleValueTime
					field={field}
					form={form}
					isFirstField={isFirstField}
					onFocus={onFocus}
					onBlur={onBlur}
					ref={editableRef}
				/>
			)}
			{metadataField.type === "text" &&
				!!metadataField.collection &&
				metadataField.collection.length > 0 && (
					<EditableSingleSelect
						metadataField={metadataField}
						field={field}
						form={form}
						text={getMetadataCollectionFieldName(metadataField, field, t)}
						isFirstField={isFirstField}
						focused={focused}
						setFocused={setFocused}
						ref={editableRef}
					/>
				)}
			{metadataField.type === "ordered_text" && (
				<EditableSingleSelect
					metadataField={metadataField}
					field={field}
					form={form}
					text={getMetadataCollectionFieldName(metadataField, field, t)}
					isFirstField={isFirstField}
					focused={focused}
					setFocused={setFocused}
					ref={editableRef}
				/>
			)}
			{metadataField.type === "text" &&
				!(
					!!metadataField.collection && metadataField.collection.length !== 0
				) && (
					<EditableSingleValue
						field={field}
						isFirstField={isFirstField}
						onFocus={onFocus}
						onBlur={onBlur}
						ref={editableRef}
					/>
				)}
			{metadataField.type === "text_long" && (
				<EditableSingleValueTextArea
					field={field}
					isFirstField={isFirstField}
					onFocus={onFocus}
					onBlur={onBlur}
					ref={editableRef}
				/>
			)}
			{metadataField.type === "date" && (
				<EditableDateValue
					field={field}
					form={form}
					isFirstField={isFirstField}
					onFocus={onFocus}
					onBlur={onBlur}
					ref={editableRef}
				/>
			)}
			{metadataField.type === "boolean" && (
				<EditableBooleanValue
					field={field}
					isFirstField={isFirstField}
					onFocus={onFocus}
					onBlur={onBlur}
					ref={editableRef}
				/>
			)}
			<div style={{display: "flex", justifyContent: "flex-end"}}>
				{!focused && showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: form.initialValues[field.name] !== field.value,
						})}
					/>
				)}
				{!focused && <i className="edit fa fa-pencil-square" />}
			</div>
		</div>
	);
};

// Renders editable field for a boolean value
const EditableBooleanValue = ({
	field,
	isFirstField,
	onFocus,
	onBlur,
	ref,
}: {
	field: FieldProps["field"]
	isFirstField?: boolean,
	onFocus: () => void
	onBlur: () => void
	ref: React.RefObject<HTMLInputElement>
}) => {
	return (
		<input
			{...field}
			ref={ref}
			type="checkbox"
			checked={field.value}
			autoFocus={isFirstField}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	);
};

// Renders editable field for a data value
const EditableDateValue = ({
	field,
	form: { setFieldValue },
	isFirstField,
	onFocus,
	onBlur,
	ref,
}: {
	field: FieldProps["field"]
	form: FieldProps["form"]
	isFirstField?: boolean,
	onFocus: () => void
	onBlur: () => void
	ref: React.RefObject<DatePicker>
}) => {
	return (
		// For some reason onclick events are bubbling up from the datepicker which we do not want.
		// Therefore we wrap it.
		<div onClick={(e) => { e.stopPropagation() }}>
			<DatePicker
				ref={ref}
				selected={!isNaN(Date.parse(field.value)) ? new Date(field.value) : null}
				onChange={(value) => setFieldValue(field.name, value)}
				showTimeInput
				showYearDropdown
				showMonthDropdown
				yearDropdownItemNumber={2}
				dateFormat="Pp"
				popperPlacement="bottom-start"
				popperClassName="datepicker-custom"
				className="datepicker-custom-input"
				wrapperClassName="datepicker-custom-wrapper"
				locale={getCurrentLanguageInformation()?.dateLocale}
				strictParsing
				onFocus={onFocus}
				onBlur={onBlur}
				autoFocus={isFirstField}
			/>
		</div>
	);
};

// renders editable field for selecting value via dropdown
const EditableSingleSelect = ({
	field,
	metadataField,
	text,
	form: { setFieldValue },
	isFirstField,
	focused,
	setFocused,
	ref,
}: {
	field: FieldProps["field"]
	metadataField: MetadataField
	text: string
	form: FieldProps["form"]
	isFirstField?: boolean,
	focused: boolean,
	setFocused: (open: boolean) => void
	ref: React.RefObject<SelectInstance<any, boolean, GroupBase<any>>>
}) => {
	const { t } = useTranslation();

	return (
		<DropDown
			ref={ref}
			value={field.value}
			text={text}
			options={metadataField.collection ? metadataField.collection : []}
			type={metadataField.id as DropDownType}
			required={metadataField.required}
			handleChange={(element) => element && setFieldValue(field.name, element.value)}
			placeholder={focused
				? `-- ${t("SELECT_NO_OPTION_SELECTED")} --`
				: `${t("SELECT_NO_OPTION_SELECTED")}`
			}
			isMetadataStyle={focused ? false : true}
			handleMenuIsOpen={(open: boolean) => setFocused(open)}
			openMenuOnFocus
			autoFocus={isFirstField}
		/>
	);
};

// Renders editable text area
const EditableSingleValueTextArea = ({
	field,
	isFirstField,
	onFocus,
	onBlur,
	ref,
}: {
	field: FieldProps["field"]
	isFirstField?: boolean,
	onFocus: () => void
	onBlur: () => void
	ref: React.RefObject<HTMLTextAreaElement>
}) => {

	const [value, setValue] = useState("");
	useEffect(() => {
		if (ref && ref.current) {
			// We need to reset the height momentarily to get the correct scrollHeight for the textarea
			ref.current.style.height = "0px";
			const scrollHeight = ref.current.scrollHeight;

			// We then set the height directly, outside of the render loop
			// Trying to set this with state or a ref will product an incorrect value.
			console.log("Scrollheight: " + scrollHeight)
			ref.current.style.height = scrollHeight + 5 + "px";
		}
	}, [ref, value]);

	const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
		const val = evt.target?.value;

		setValue(val);
	};

	return (
			<textarea
				{...field}
				ref={ref}
				autoFocus={isFirstField}
				className="single-value-textarea"
				onChange={handleChange}
				value={value}
				rows={1}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
	);
};

// Renders editable input for single value
const EditableSingleValue = ({
	field,
	isFirstField,
	onFocus,
	onBlur,
	ref,
}: {
	field: FieldProps["field"]
	isFirstField?: boolean,
	onFocus: () => void
	onBlur: () => void
	ref: React.RefObject<HTMLInputElement | null>
}) => {
	return (
		<input
			{...field}
			ref={ref}
			className="single-value"
			autoFocus={isFirstField}
			type="text"
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	)
};

// Renders editable field for time value
const EditableSingleValueTime = ({
	field,
	form: { setFieldValue },
	isFirstField,
	onFocus,
	onBlur,
	ref,
}: {
	field: FieldProps["field"]
	form: FieldProps["form"]
	isFirstField?: boolean,
	onFocus: () => void
	onBlur: () => void
	ref: React.RefObject<DatePicker>
}) => {
	return (
		// For some reason onclick events are bubbling up from the datepicker which we do not want.
		// Therefore we wrap it.
		<div onClick={(e) => { e.stopPropagation() }}>
			<DatePicker
				ref={ref}
				selected={typeof field.value === "string" ? parseISO(field.value) : field.value}
				onChange={(value) => setFieldValue(field.name, value)}
				showTimeSelect
				showTimeSelectOnly
				dateFormat="p"
				popperPlacement="bottom-start"
				popperClassName="datepicker-custom"
				className="datepicker-custom-input"
				wrapperClassName="datepicker-custom-wrapper"
				locale={getCurrentLanguageInformation()?.dateLocale}
				strictParsing
				onFocus={onFocus}
				onBlur={onBlur}
				autoFocus={isFirstField}
			/>
		</div>
	);
};

export default RenderField;
