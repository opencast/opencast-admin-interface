import React from "react";
import { useTranslation } from "react-i18next";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import cn from "classnames";
import { useClickOutsideField } from "../../../hooks/wizardHooks";
import { isJson } from "../../../utils/utils";
import { getMetadataCollectionFieldName } from "../../../utils/resourceUtils";
import DropDown, { DropDownType } from "../DropDown";
import RenderDate from "../RenderDate";
import { parseISO } from "date-fns";
import { FieldProps } from "formik";
import { MetadataField } from "../../../slices/eventSlice";

const childRef = React.createRef<HTMLDivElement>();
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

	// Indicator if currently edit mode is activated
	const {editMode, setEditMode} = useClickOutsideField(childRef, isFirstField);

	// Handle key down event and check if pressed key leads to leaving edit mode
	const handleKeyDown = (event: React.KeyboardEvent, type: MetadataField["type"]) => {
		const { key } = event;
		// keys pressable for leaving edit mode
		const keys = ["Escape", "Tab", "Enter"];

		if (type !== "textarea" && keys.indexOf(key) > -1) {
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
					text={t(getMetadataCollectionFieldName(metadataField, field))}
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
	field,
	handleKeyDown,
	form: { initialValues },
	showCheck,
}: {
	field: FieldProps["field"]
	handleKeyDown: (event: React.KeyboardEvent, type: string) => void
	form: FieldProps["form"]
	showCheck?: boolean,
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
	field,
	text,
	form: { setFieldValue, initialValues },
	editMode,
	setEditMode,
	showCheck,
	handleKeyDown
}: {
	field: FieldProps["field"]
	text: string
	form: FieldProps["form"]
	editMode: boolean | undefined
	setEditMode: (e: boolean) => void
	showCheck?: boolean,
	handleKeyDown: (event: React.KeyboardEvent, type: string) => void
}) => editMode ? (
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
	<div onClick={() => setEditMode(true)} className="show-edit">
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

// renders editable field for selecting value via dropdown
const EditableSingleSelect = ({
	field,
	metadataField,
	text,
	editMode,
	setEditMode,
	handleKeyDown,
	form: { setFieldValue, initialValues },
	showCheck,
}: {
	field: FieldProps["field"]
	metadataField: MetadataField
	text: string
	editMode: boolean | undefined
	setEditMode: (e: boolean) => void
	handleKeyDown: (event: React.KeyboardEvent, type: string) => void
	form: FieldProps["form"]
	showCheck?: boolean,
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
				options={metadataField.collection ? metadataField.collection : []}
				type={metadataField.id as DropDownType}
				required={metadataField.required}
				handleChange={(element) => element && setFieldValue(field.name, element.value)}
				placeholder={`-- ${t("SELECT_NO_OPTION_SELECTED")} --`}
				tabIndex={10}
				autoFocus={true}
				defaultOpen={true}
			/>
		</div>
	) : (
		<div onClick={() => setEditMode(true)} className="show-edit">
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
	field,
	text,
	editMode,
	setEditMode,
	handleKeyDown,
	form: { initialValues },
	showCheck,
}: {
	field: FieldProps["field"]
	text: string
	editMode: boolean | undefined
	setEditMode: (e: boolean) => void
	handleKeyDown: (event: React.KeyboardEvent, type: string) => void
	form: FieldProps["form"]
	showCheck?: boolean,
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
		<div onClick={() => setEditMode(true)} className="show-edit">
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
	field,
	form: { initialValues },
	text,
	editMode,
	setEditMode,
	handleKeyDown,
	showCheck,
}: {
	field: FieldProps["field"]
	form: FieldProps["form"]
	text: string
	editMode: boolean | undefined
	setEditMode: (e: boolean) => void
	handleKeyDown: (event: React.KeyboardEvent, type: string) => void
	showCheck?: boolean,
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
		<div onClick={() => setEditMode(true)} className="show-edit">
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
	field,
	text,
	form: { setFieldValue, initialValues },
	editMode,
	setEditMode,
	showCheck,
	handleKeyDown,
}: {
	field: FieldProps["field"]
	text: string
	form: FieldProps["form"]
	editMode: boolean | undefined
	setEditMode: (e: boolean) => void
	showCheck?: boolean,
	handleKeyDown: (event: React.KeyboardEvent, type: string) => void
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
						onBlur: () => {
							setEditMode(false)
						}
					}
				}}
			/>
		</div>
	) : (
		<div onClick={() => setEditMode(true)} className="show-edit">
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
