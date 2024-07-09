import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useClickOutsideField } from "../../../hooks/wizardHooks";
import { FieldInputProps, FieldProps } from "formik";
import { MetadataField } from "../../../slices/eventSlice";

const childRef = React.createRef<HTMLDivElement>();

/**
 * This component renders an editable field for multiple values depending on the type of the corresponding metadata
 */
const RenderMultiField = ({
	fieldInfo,
	onlyCollectionValues = false,
	field,
	form,
	showCheck = false,
}: {
	fieldInfo: MetadataField
	onlyCollectionValues?: boolean
	field: FieldProps["field"]
	form: FieldProps["form"]
	showCheck?: boolean,
}) => {
	// Indicator if currently edit mode is activated
	const {editMode, setEditMode} = useClickOutsideField(childRef);
	// Temporary storage for value user currently types in
	const [inputValue, setInputValue] = useState("");

	let fieldValue = [...field.value];

	// Handle change of value user currently types in
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const itemValue = e.target.value;
		setInputValue(itemValue);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		// Check if pressed key is Enter
		if (event.keyCode === 13 && inputValue !== "") {
			event.preventDefault();

			submitValue();
		}
	};

	const submitValue = (alternativeInput?: string) => {

		let newInputValue = inputValue
		if (alternativeInput) {
			newInputValue = alternativeInput
		}

		if (newInputValue !== "") {
			// Flag if only values of collection are allowed or any value
			if (onlyCollectionValues) {
				// add input to formik field value if not already added and input in collection of possible values
				if (
					!fieldValue.find((e) => e === newInputValue) &&
					fieldInfo.collection?.find((e) => e.value === newInputValue)
				) {
					fieldValue[fieldValue.length] = newInputValue;
					form.setFieldValue(field.name, fieldValue);
				}
			} else {
				// add input to formik field value if not already added
				if (!fieldValue.find((e) => e === newInputValue)) {
					fieldValue[fieldValue.length] = newInputValue;
					form.setFieldValue(field.name, fieldValue);
				}
			}

			// reset inputValue
			setInputValue("");
		}
	}

	// Remove item/value from inserted field values
	const removeItem = (key: number) => {
		fieldValue.splice(key, 1);
		form.setFieldValue(field.name, fieldValue);
	};

	return (
		// Render editable field for multiple values depending on type of metadata field
		// (types: see metadata.json retrieved from backend)
		editMode ? (
			<>
				{fieldInfo.type === "mixed_text" && !!fieldInfo.collection ? (
					<EditMultiSelect
						collection={fieldInfo.collection}
						field={field}
						fieldValue={fieldValue}
						inputValue={inputValue}
						removeItem={removeItem}
						handleChange={handleChange}
						handleKeyDown={handleKeyDown}
						handleBlur={submitValue}
					/>
				) : (
					fieldInfo.type === "mixed_text" && (
						<EditMultiValue
							setEditMode={setEditMode}
							fieldValue={fieldValue}
							field={field}
							inputValue={inputValue}
							removeItem={removeItem}
							handleChange={handleChange}
							handleKeyDown={handleKeyDown}
						/>
					)
				)}
			</>
		) : (
			<ShowValue
				setEditMode={setEditMode}
				field={field}
				form={form}
				showCheck={showCheck}
			/>
		)
	);
};

// Renders multi select
const EditMultiSelect = ({
	collection,
	handleKeyDown,
	handleChange,
	handleBlur,
	inputValue,
	removeItem,
	field,
	fieldValue,
}: {
	collection: { [key: string]: unknown }[]
	handleKeyDown: (event: React.KeyboardEvent) => void
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	handleBlur: (refCurrent: string) => void
	inputValue: HTMLInputElement["value"]
	removeItem: (key: number) => void
	field: FieldProps["field"]
	fieldValue: FieldInputProps<unknown>["value"]
}) => {
	const { t } = useTranslation();

	// onBlur does not get called if a component unmounts for some reason
	// Instead, we achieve the same effect with useEffect
	const textRef = useRef(inputValue);
	React.useEffect( () => {
		textRef.current = inputValue;
	}, [inputValue])
	React.useEffect( () => {
		return () => handleBlur(textRef.current)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<div ref={childRef}>
				<div>
					<input
						type="text"
						name={field.name}
						value={inputValue}
						onKeyDown={(e) => handleKeyDown(e)}
						onChange={(e) => handleChange(e)}
						placeholder={t("EDITABLE.MULTI.PLACEHOLDER")}
						list="data-list"
						autoFocus={true}
					/>
					{/* Display possible options for values as some kind of dropdown */}
					<datalist id="data-list">
						{collection.map((item, key) => (
							<option key={key}>{item.value}</option>
						))}
					</datalist>
				</div>
				{/* Render blue label for all values already in field array */}
				{fieldValue instanceof Array &&
					fieldValue.length !== 0 &&
					fieldValue.map((item, key) => (
						<span className="ng-multi-value" key={key}>
							{item}
							<button className="button-like-anchor" onClick={() => removeItem(key)}>
								<i className="fa fa-times" />
							</button>
						</span>
					))}
			</div>
		</>
	);
};

// Renders editable field input for multiple values
const EditMultiValue = ({
	setEditMode,
	inputValue,
	removeItem,
	handleChange,
	handleKeyDown,
	field,
	fieldValue,
}: {
	setEditMode: (e: boolean) => void
	inputValue: HTMLInputElement["value"]
	removeItem: (key: number) => void
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	handleKeyDown: (event: React.KeyboardEvent) => void
	field: FieldProps["field"]
	fieldValue: FieldInputProps<unknown>["value"]
}) => {
	const { t } = useTranslation();

	return (
		<>
			<div onBlur={() => setEditMode(false)} ref={childRef}>
				<input
					type="text"
					name={field.name}
					onKeyDown={(e) => handleKeyDown(e)}
					onChange={(e) => handleChange(e)}
					value={inputValue}
					placeholder={t("EDITABLE.MULTI.PLACEHOLDER")}
				/>
			</div>
			{fieldValue instanceof Array &&
				fieldValue.length !== 0 &&
				fieldValue.map((item, key) => (
					<span className="ng-multi-value" key={key}>
						{item}
						<button className="button-like-anchor" onClick={() => removeItem(key)}>
							<i className="fa fa-times" />
						</button>
					</span>
				))}
		</>
	);
};

// Shows the values of the array in non-edit mode
const ShowValue = ({
	setEditMode,
	form: { initialValues },
	field,
	showCheck,
}: {
  setEditMode: (e: boolean) => void
	form: FieldProps["form"]
	field: FieldProps["field"]
	showCheck: any,
}) => {
	return (
		<div onClick={() => setEditMode(true)} className="show-edit">
			{field.value instanceof Array && field.value.length !== 0 ? (
				<ul>
					{field.value.map((item, key) => (
						<li key={key}>
							<span>{item}</span>
						</li>
					))}
				</ul>
			) : (
				<span className="editable preserve-newlines">{""}</span>
			)}
			<div>
				<i className="edit fa fa-pencil-square" />
				{showCheck && (
					<i
						className={cn("saved fa fa-check", {
							active: JSON.stringify(initialValues[field.name] ?? []) !== JSON.stringify(field.value ?? []),
						})}
					/>
				)}
			</div>
		</div>
	);
};

export default RenderMultiField;
