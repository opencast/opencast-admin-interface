import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useClickOutsideField } from "../../../hooks/wizardHooks";

const childRef = React.createRef<HTMLDivElement>();

/**
 * This component renders an editable field for multiple values depending on the type of the corresponding metadata
 */
const RenderMultiField = ({
// @ts-expect-error TS(7031): Binding element 'fieldInfo' implicitly has an 'any... Remove this comment to see the full error message
	fieldInfo,
	onlyCollectionValues = false,
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'form' implicitly has an 'any' typ... Remove this comment to see the full error message
	form,
	showCheck = false,
}) => {
	// Indicator if currently edit mode is activated
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
	const [editMode, setEditMode] = useClickOutsideField(childRef);
	// Temporary storage for value user currently types in
	const [inputValue, setInputValue] = useState("");

	let fieldValue = [...field.value];

	// Handle change of value user currently types in
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const handleChange = (e) => {
		const itemValue = e.target.value;
		setInputValue(itemValue);
	};

// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
	const handleKeyDown = (event) => {
		// Check if pressed key is Enter
		if (event.keyCode === 13 && inputValue !== "") {
			event.preventDefault();

			// Flag if only values of collection are allowed or any value
			if (onlyCollectionValues) {
				// add input to formik field value if not already added and input in collection of possible values
				if (
					!fieldValue.find((e) => e === inputValue) &&
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
					fieldInfo.collection.find((e) => e.value === inputValue)
				) {
					fieldValue[fieldValue.length] = inputValue;
					form.setFieldValue(field.name, fieldValue);
				}
			} else {
				// add input to formik field value if not already added
				if (!fieldValue.find((e) => e === inputValue)) {
					fieldValue[fieldValue.length] = inputValue;
					form.setFieldValue(field.name, fieldValue);
				}
			}

			// reset inputValue
			setInputValue("");
		}
	};

	// Remove item/value from inserted field values
// @ts-expect-error TS(7006): Parameter 'key' implicitly has an 'any' type.
	const removeItem = (key) => {
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
// @ts-expect-error TS(2322): Type '{ collection: any; field: any; fieldValue: a... Remove this comment to see the full error message
						setEditMode={setEditMode}
						inputValue={inputValue}
						removeItem={removeItem}
						handleChange={handleChange}
						handleKeyDown={handleKeyDown}
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
// @ts-expect-error TS(7031): Binding element 'collection' implicitly has an 'an... Remove this comment to see the full error message
	collection,
// @ts-expect-error TS(7031): Binding element 'handleKeyDown' implicitly has an ... Remove this comment to see the full error message
	handleKeyDown,
// @ts-expect-error TS(7031): Binding element 'handleChange' implicitly has an '... Remove this comment to see the full error message
	handleChange,
// @ts-expect-error TS(7031): Binding element 'inputValue' implicitly has an 'an... Remove this comment to see the full error message
	inputValue,
// @ts-expect-error TS(7031): Binding element 'removeItem' implicitly has an 'an... Remove this comment to see the full error message
	removeItem,
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'fieldValue' implicitly has an 'an... Remove this comment to see the full error message
	fieldValue,
}) => {
	const { t } = useTranslation();

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
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
						placeholder={t("EDITABLE.MULTI.PLACEHOLDER")}
						list="data-list"
						autoFocus={true}
					/>
					{/* Display possible options for values as some kind of dropdown */}
					<datalist id="data-list">
{/* @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type. */}
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
// @ts-expect-error TS(7031): Binding element 'setEditMode' implicitly has an 'a... Remove this comment to see the full error message
	setEditMode,
// @ts-expect-error TS(7031): Binding element 'inputValue' implicitly has an 'an... Remove this comment to see the full error message
	inputValue,
// @ts-expect-error TS(7031): Binding element 'removeItem' implicitly has an 'an... Remove this comment to see the full error message
	removeItem,
// @ts-expect-error TS(7031): Binding element 'handleChange' implicitly has an '... Remove this comment to see the full error message
	handleChange,
// @ts-expect-error TS(7031): Binding element 'handleKeyDown' implicitly has an ... Remove this comment to see the full error message
	handleKeyDown,
// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
	field,
// @ts-expect-error TS(7031): Binding element 'fieldValue' implicitly has an 'an... Remove this comment to see the full error message
	fieldValue,
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
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
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
const ShowValue : React.FC<{
  setEditMode: any,
	form: any,
	field: any,
	showCheck: any,
	fieldValue?: any,
}> = ({
	setEditMode,
	form: { initialValues },
	field,
	showCheck,
	fieldValue,
}) => {
	return (
		<div onClick={() => setEditMode(true)} className="show-edit">
			{field.value instanceof Array && field.value.length !== 0 ? (
				<ul>
{/* @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type. */}
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
							active: initialValues[field.name] !== field.value,
						})}
					/>
				)}
			</div>
		</div>
	);
};

export default RenderMultiField;
