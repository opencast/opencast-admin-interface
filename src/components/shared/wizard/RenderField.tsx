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

	return (
		// Render editable field depending on type of metadata field
		// (types: see metadata.json retrieved from backend)
		<>
			{metadataField.type === "time" && (
				<EditableSingleValueTime
					field={field}
					form={form}
					showCheck={showCheck}
					isFirstField={isFirstField}
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
						showCheck={showCheck}
						isFirstField={isFirstField}
					/>
				)}
			{metadataField.type === "ordered_text" && (
				<EditableSingleSelect
					metadataField={metadataField}
					field={field}
					form={form}
					text={getMetadataCollectionFieldName(metadataField, field, t)}
					showCheck={showCheck}
					isFirstField={isFirstField}
				/>
			)}
			{metadataField.type === "text" &&
				!(
					!!metadataField.collection && metadataField.collection.length !== 0
				) && (
					<EditableSingleValue
						field={field}
						form={form}
						showCheck={showCheck}
						isFirstField={isFirstField}
					/>
				)}
			{metadataField.type === "text_long" && (
				<EditableSingleValueTextArea
					field={field}
					form={form}
					showCheck={showCheck}
					isFirstField={isFirstField}
				/>
			)}
			{metadataField.type === "date" && (
				<EditableDateValue
					field={field}
					form={form}
					showCheck={showCheck}
					isFirstField={isFirstField}
				/>
			)}
			{metadataField.type === "boolean" && (
				<EditableBooleanValue
					field={field}
					form={form}
					showCheck={showCheck}
					isFirstField={isFirstField}
				/>
			)}
		</>
	);
};

// Renders editable field for a boolean value
const EditableBooleanValue = ({
	field,
	form: { initialValues },
	showCheck,
	isFirstField,
}: {
	field: FieldProps["field"]
	form: FieldProps["form"]
	showCheck?: boolean,
	isFirstField?: boolean,
}) => {
	return (
		<div>
			<input
				type="checkbox"
				checked={field.value}
				autoFocus={isFirstField}
				{...field}
			/>
			<i className="edit fa fa-pencil-square" />
			{showCheck && (
				<i
					className={cn("saved fa fa-check", {
						active: initialValues[field.name] !== field.value,
					})}
				/>
			)}
		</div>
	);
};

// Renders editable field for a data value
const EditableDateValue = ({
	field,
	form: { setFieldValue, initialValues },
	showCheck,
	isFirstField,
}: {
	field: FieldProps["field"]
	form: FieldProps["form"]
	showCheck?: boolean,
	isFirstField?: boolean,
}) => {

	const datePickerRef = useRef<DatePicker>(null);
	const [focused, setFocused] = useState(false);
	const onFocus = () => setFocused(true);
	const onBlur = () => setFocused(false);

	return (
		<div
			onClick={() => datePickerRef.current?.setFocus()}
			style={{display: "flex", justifyContent: "space-between"}}
		>
			{/* For some reason onclick events are bubbling up from the datepicker which we do not want.
				Therefore we wrap it.*/}
			<div onClick={(e) => { e.stopPropagation() }}>
				<DatePicker
					ref={datePickerRef}
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
			<div style={{display: "flex", justifyContent: "flex-end"}}>
				{!focused && showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
				{!focused && <i className="edit fa fa-pencil-square" />}
			</div>
		</div>
	);
};

// renders editable field for selecting value via dropdown
const EditableSingleSelect = ({
	field,
	metadataField,
	text,
	form: { setFieldValue, initialValues },
	showCheck,
	isFirstField,
}: {
	field: FieldProps["field"]
	metadataField: MetadataField
	text: string
	form: FieldProps["form"]
	showCheck?: boolean,
	isFirstField?: boolean,
}) => {
	const { t } = useTranslation();

	const dropdownRef = useRef<SelectInstance<any, boolean, GroupBase<any>>>(null);
	const [focused, setFocused] = useState(false);

	return (
		<div
			onClick={() => dropdownRef.current?.focus()}
			style={{display: "flex", justifyContent: "space-between"}}
		>
			<DropDown
				ref={dropdownRef}
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
			<div style={{display: "flex", justifyContent: "flex-end"}}>
				{!focused && showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
				{!focused && <i className="edit fa fa-pencil-square" />}
			</div>
		</div>
	);
};

// Renders editable text area
const EditableSingleValueTextArea = ({
	field,
	form: { initialValues },
	showCheck,
	isFirstField,
}: {
	field: FieldProps["field"]
	form: FieldProps["form"]
	showCheck?: boolean,
	isFirstField?: boolean,
}) => {

	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [focused, setFocused] = useState(false);
	const onFocus = () => setFocused(true);
	const onBlur = () => setFocused(false);

	const [value, setValue] = useState("");
	useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
			console.log("Scrollheight: " + scrollHeight)
      textAreaRef.current.style.height = scrollHeight + 5 + "px";
    }
  }, [textAreaRef, value]);

	const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setValue(val);
  };

	return (
		<div
			onClick={() => textAreaRef.current?.focus()}
			style={{display: "flex", justifyContent: "space-between"}}
		>
			<textarea
				{...field}
				ref={textAreaRef}
				autoFocus={isFirstField}
				className="single-value-textarea"
				onChange={handleChange}
				value={value}
				rows={1}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
			<div style={{display: "flex", justifyContent: "flex-end"}}>
				{!focused && showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
				{!focused && <i className="edit fa fa-pencil-square" />}
			</div>
		</div>
	);
};

// Renders editable input for single value
const EditableSingleValue = ({
	field,
	form: { initialValues },
	showCheck,
	isFirstField,
}: {
	field: FieldProps["field"]
	form: FieldProps["form"]
	showCheck?: boolean,
	isFirstField?: boolean,
}) => {

	const inputRef = useRef<HTMLInputElement>(null);
	const [focused, setFocused] = useState(false);
	const onFocus = () => setFocused(true);
	const onBlur = () => setFocused(false);

	return (
		<div
			onClick={() => inputRef.current?.focus()}
			style={{display: "flex", justifyContent: "space-between"}}
		>
			<input
				{...field}
				ref={inputRef}
				className="single-value"
				autoFocus={isFirstField}
				type="text"
				onFocus={onFocus}
				onBlur={onBlur}
			/>
			<div style={{display: "flex", justifyContent: "flex-end"}}>
				{!focused && showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
				{!focused && <i className="edit fa fa-pencil-square" />}
			</div>
		</div>
	)
};

// Renders editable field for time value
const EditableSingleValueTime = ({
	field,
	form: { setFieldValue, initialValues },
	showCheck,
	isFirstField,
}: {
	field: FieldProps["field"]
	form: FieldProps["form"]
	showCheck?: boolean,
	isFirstField?: boolean,
}) => {
	const datePickerRef = useRef<DatePicker>(null);
	const [focused, setFocused] = useState(false);
	const onFocus = () => setFocused(true);
	const onBlur = () => setFocused(false);

	return (
		<div
			onClick={() => datePickerRef.current?.setFocus()}
			style={{display: "flex", justifyContent: "space-between"}}
		>
			<DatePicker
				ref={datePickerRef}
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
			<div style={{display: "flex", justifyContent: "flex-end"}}>
				{!focused && showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
				{!focused && <i className="edit fa fa-pencil-square" />}
			</div>
		</div>
	);
};

export default RenderField;
