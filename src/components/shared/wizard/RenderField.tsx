import React from "react";
import { useTranslation } from "react-i18next";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import cn from "classnames";
import { useClickOutsideField } from "../../../hooks/wizardHooks";
import { isJson } from "../../../utils/utils";
import { getMetadataCollectionFieldName } from "../../../utils/resourceUtils";
import DropDown from "../DropDown";
import RenderDate from "../RenderDate";
import { parseISO } from "date-fns";

const childRef = React.createRef<HTMLDivElement>();
/**
 * This component renders an editable field for single values depending on the type of the corresponding metadata
 */
const RenderField = ({
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'metadataField' implicitly has an ... Remove this comment to see the full error message
	metadataField,
// @ts-expect-error TS(7031): Binding element 'form' implicitly has an 'any' typ... Remove this comment to see the full error message
	form,
	showCheck = false,
	isFirstField = false,
}) => {
	const { t } = useTranslation();

	// Indicator if currently edit mode is activated
	const {editMode, setEditMode} = useClickOutsideField(childRef, isFirstField);

	// Handle key down event and check if pressed key leads to leaving edit mode
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
	const handleKeyDown = (event, type) => {
		const { key } = event;
		// keys pressable for leaving edit mode
		const keys = ["Escape", "Enter"];

		if ((type !== "textarea" || type !== "select") && keys.indexOf(key) > -1) {
			setEditMode(false);
		}
	};

	return (
		// Render editable field depending on type of metadata field
		// (types: see metadata.json retrieved from backend)
		<>
			{metadataField.type === "time" && (
				<EditableSingleValueTime
					field={field}
					text={field.value}
					editMode={editMode}
					setEditMode={setEditMode}
					form={form}
					showCheck={showCheck}
					handleKeyDown={handleKeyDown}
				/>
			)}
			{metadataField.type === "text" &&
				!!metadataField.collection &&
				metadataField.collection.length > 0 && (
					<EditableSingleSelect
						metadataField={metadataField}
						field={field}
						form={form}
						text={
							isJson(getMetadataCollectionFieldName(metadataField, field))
								? t(
										JSON.parse(
											getMetadataCollectionFieldName(metadataField, field)
										).label
								  )
								: t(getMetadataCollectionFieldName(metadataField, field))
						}
						editMode={editMode}
						setEditMode={setEditMode}
						showCheck={showCheck}
						handleKeyDown={handleKeyDown}
					/>
				)}
			{metadataField.type === "ordered_text" && (
				<EditableSingleSelect
					metadataField={metadataField}
					field={field}
					form={form}
					text={field.value}
					editMode={editMode}
					setEditMode={setEditMode}
					showCheck={showCheck}
					handleKeyDown={handleKeyDown}
				/>
			)}
			{metadataField.type === "text" &&
				!(
					!!metadataField.collection && metadataField.collection.length !== 0
				) && (
					<EditableSingleValue
						field={field}
						form={form}
						text={field.value}
						editMode={editMode}
						setEditMode={setEditMode}
// @ts-expect-error TS(2322): Type '{ field: any; form: any; text: any; editMode... Remove this comment to see the full error message
						isFirst={isFirstField}
						showCheck={showCheck}
						handleKeyDown={handleKeyDown}
					/>
				)}
			{metadataField.type === "text_long" && (
				<EditableSingleValueTextArea
					field={field}
					text={field.value}
					form={form}
					editMode={editMode}
					setEditMode={setEditMode}
// @ts-expect-error TS(2322): Type '{ field: any; text: any; form: any; editMode... Remove this comment to see the full error message
					isFirst={isFirstField}
					showCheck={showCheck}
					handleKeyDown={handleKeyDown}
				/>
			)}
			{metadataField.type === "date" && (
				<EditableDateValue
					field={field}
					text={field.value}
					form={form}
					editMode={editMode}
					setEditMode={setEditMode}
					showCheck={showCheck}
					handleKeyDown={handleKeyDown}
				/>
			)}
			{metadataField.type === "boolean" && (
				<EditableBooleanValue
					field={field}
					form={form}
					showCheck={showCheck}
					handleKeyDown={handleKeyDown}
				/>
			)}
		</>
	);
};

// Renders editable field for a boolean value
const EditableBooleanValue = ({
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'handleKeyDown' implicitly has an ... Remove this comment to see the full error message
	handleKeyDown,
// @ts-expect-error TS(7031): Binding element 'initialValues' implicitly has an ... Remove this comment to see the full error message
	form: { initialValues },
// @ts-expect-error TS(7031): Binding element 'showCheck' implicitly has an 'any... Remove this comment to see the full error message
	showCheck,
}) => {
	return (
		<div onKeyDown={(e) => handleKeyDown(e, "input")} ref={childRef}>
			<input type="checkbox" checked={field.value} {...field} />
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
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'text' implicitly has an 'any' typ... Remove this comment to see the full error message
	text,
// @ts-expect-error TS(7031): Binding element 'setFieldValue' implicitly has an ... Remove this comment to see the full error message
	form: { setFieldValue, initialValues },
// @ts-expect-error TS(7031): Binding element 'editMode' implicitly has an 'any'... Remove this comment to see the full error message
	editMode,
// @ts-expect-error TS(7031): Binding element 'setEditMode' implicitly has an 'a... Remove this comment to see the full error message
	setEditMode,
// @ts-expect-error TS(7031): Binding element 'showCheck' implicitly has an 'any... Remove this comment to see the full error message
	showCheck,
// @ts-expect-error TS(7031):
	handleKeyDown
}) => {
	const { t } = useTranslation();

	return editMode ? (
		<div>
			<DateTimePicker
				name={field.name}
				value={typeof field.value === "string" ? parseISO(field.value) : field.value}
				onChange={(value) => setFieldValue(field.name, value)}
				onClose={() => setEditMode(false)}
				slotProps={{
					textField: {
						fullWidth: true,
						onKeyDown: (event) => {
							if (event.key === "Enter") {
								handleKeyDown(event, "date")
							}
						},
						onBlur: (event) => {
							setEditMode(false)
						}
					}
				}}
			/>
		</div>
	) : (
		<div onFocus={() => setEditMode(true)} className="show-edit" tabIndex={0}>
			<span className="editable preserve-newlines">
				<RenderDate date={text} />
			</span>
			<div>
				<i className="edit fa fa-pencil-square" />
				{showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
			</div>
		</div>
	);
};

// renders editable field for selecting value via dropdown
const EditableSingleSelect = ({
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'metadataField' implicitly has an ... Remove this comment to see the full error message
	metadataField,
// @ts-expect-error TS(7031): Binding element 'text' implicitly has an 'any' typ... Remove this comment to see the full error message
	text,
// @ts-expect-error TS(7031): Binding element 'editMode' implicitly has an 'any'... Remove this comment to see the full error message
	editMode,
// @ts-expect-error TS(7031): Binding element 'setEditMode' implicitly has an 'a... Remove this comment to see the full error message
	setEditMode,
// @ts-expect-error TS(7031): Binding element 'handleKeyDown' implicitly has an ... Remove this comment to see the full error message
	handleKeyDown,
// @ts-expect-error TS(7031): Binding element 'setFieldValue' implicitly has an ... Remove this comment to see the full error message
	form: { setFieldValue, initialValues },
// @ts-expect-error TS(7031): Binding element 'showCheck' implicitly has an 'any... Remove this comment to see the full error message
	showCheck,
}) => {
	const { t } = useTranslation();

	return editMode ? (
		<div
			onBlur={() => setEditMode(false)}
			onKeyDown={(e) => handleKeyDown(e, "select")}
			ref={childRef}
		>
			<DropDown
				value={field.value}
				text={text}
				options={metadataField.collection}
				type={metadataField.id}
				required={metadataField.required}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
				handleChange={(element) => setFieldValue(field.name, element.value)}
				placeholder={`-- ${t("SELECT_NO_OPTION_SELECTED")} --`}
				tabIndex={10}
				autoFocus={true}
				defaultOpen={true}
			/>
		</div>
	) : (
		<div onFocus={() => setEditMode(true)} className="show-edit" tabIndex={0}>
			<span className="editable preserve-newlines">
				{text || t("SELECT_NO_OPTION_SELECTED")}
			</span>
			<div>
				<i className="edit fa fa-pencil-square" />
				{showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
			</div>
		</div>
	);
};

// Renders editable text area
const EditableSingleValueTextArea = ({
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'text' implicitly has an 'any' typ... Remove this comment to see the full error message
	text,
// @ts-expect-error TS(7031): Binding element 'editMode' implicitly has an 'any'... Remove this comment to see the full error message
	editMode,
// @ts-expect-error TS(7031): Binding element 'setEditMode' implicitly has an 'a... Remove this comment to see the full error message
	setEditMode,
// @ts-expect-error TS(7031): Binding element 'handleKeyDown' implicitly has an ... Remove this comment to see the full error message
	handleKeyDown,
// @ts-expect-error TS(7031): Binding element 'initialValues' implicitly has an ... Remove this comment to see the full error message
	form: { initialValues },
// @ts-expect-error TS(7031): Binding element 'showCheck' implicitly has an 'any... Remove this comment to see the full error message
	showCheck,
}) => {
	return editMode ? (
		<div
			onBlur={() => setEditMode(false)}
			onKeyDown={(e) => handleKeyDown(e, "textarea")}
			ref={childRef}
		>
			<textarea
				{...field}
				autoFocus={true}
				className="editable vertical-resize"
			/>
		</div>
	) : (
		<div onFocus={() => setEditMode(true)} className="show-edit" tabIndex={0}>
			<span className="editable preserve-newlines">{text || ""}</span>
			<div>
				<i className="edit fa fa-pencil-square" />
				{showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
			</div>
		</div>
	);
};

// Renders editable input for single value
const EditableSingleValue = ({
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'initialValues' implicitly has an ... Remove this comment to see the full error message
	form: { initialValues },
// @ts-expect-error TS(7031): Binding element 'text' implicitly has an 'any' typ... Remove this comment to see the full error message
	text,
// @ts-expect-error TS(7031): Binding element 'editMode' implicitly has an 'any'... Remove this comment to see the full error message
	editMode,
// @ts-expect-error TS(7031): Binding element 'setEditMode' implicitly has an 'a... Remove this comment to see the full error message
	setEditMode,
// @ts-expect-error TS(7031): Binding element 'handleKeyDown' implicitly has an ... Remove this comment to see the full error message
	handleKeyDown,
// @ts-expect-error TS(7031): Binding element 'showCheck' implicitly has an 'any... Remove this comment to see the full error message
	showCheck,
}) => {
	return editMode ? (
		<div
			onBlur={() => setEditMode(false)}
			onKeyDown={(e) => handleKeyDown(e, "input")}
			ref={childRef}
		>
			<input {...field} autoFocus={true} type="text" />
		</div>
	) : (
		<div onFocus={() => setEditMode(true)} className="show-edit" tabIndex={0}>
			<span className="editable preserve-newlines">{text || ""}</span>
			<div>
				<i className="edit fa fa-pencil-square" />
				{showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
			</div>
		</div>
	);
};

// Renders editable field for time value
const EditableSingleValueTime = ({
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'text' implicitly has an 'any' typ... Remove this comment to see the full error message
	text,
// @ts-expect-error TS(7031): Binding element 'setFieldValue' implicitly has an ... Remove this comment to see the full error message
	form: { setFieldValue, initialValues },
// @ts-expect-error TS(7031): Binding element 'editMode' implicitly has an 'any'... Remove this comment to see the full error message
	editMode,
// @ts-expect-error TS(7031): Binding element 'setEditMode' implicitly has an 'a... Remove this comment to see the full error message
	setEditMode,
// @ts-expect-error TS(7031): Binding element 'showCheck' implicitly has an 'any... Remove this comment to see the full error message
	showCheck,
	// @ts-expect-error TS(7031): Binding element 'handleKeyDown' implicitly has an ... Remove this comment to see the full error message
	handleKeyDown,
}) => {
	const { t } = useTranslation();

	return editMode ? (
		<div>
			<DateTimePicker
				name={field.name}
				value={parseISO(field.value)}
				onChange={(value) => setFieldValue(field.name, value)}
				onClose={() => setEditMode(false)}
				slotProps={{
					textField: {
						fullWidth: true,
						onKeyDown: (event) => {
							if (event.key === "Enter") {
								handleKeyDown(event, "date")
							}
						},
						onBlur: (event) => {
							setEditMode(false)
						}
					}
				}}
			/>
		</div>
	) : (
		<div onFocus={() => setEditMode(true)} className="show-edit" tabIndex={0}>
			<span className="editable preserve-newlines">
				{t("dateFormats.dateTime.short", { dateTime: new Date(text) }) || ""}
			</span>
			<div>
				<i className="edit fa fa-pencil-square" />
				{showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
			</div>
		</div>
	);
};

export default RenderField;
