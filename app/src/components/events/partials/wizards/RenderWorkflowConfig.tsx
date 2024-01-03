import React from "react";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from "uuid";
import { Field } from "formik";
import {
	getWorkflowDefById,
} from "../../../../selectors/workflowSelectors";
import { useAppSelector } from "../../../../store";

/**
 * This component renders the configuration panel for the selected workflow in the processing step of the new event
 * wizard chosen via dropdown.
 */
const RenderWorkflowConfig: React.FC<{
	workflowId: string
	formik: any	//TODO: Add type
	displayDescription?: any
}> = ({
	workflowId,
	formik,
	displayDescription
}) => {

	const workflowDef = useAppSelector(state => getWorkflowDefById(state, workflowId));

	// Get html for configuration panel
	const configPanel = !!workflowDef && workflowDef.configuration_panel_json
		? workflowDef.configuration_panel_json
		: [];
	const description = !!workflowDef && workflowDef.description
		? workflowDef.description
		: "";

	const descriptionBoxStyle = {
		margin: "15px 0 0 0",
		position: "relative" as const,
		border: "solid #c9d0d3",
		borderWidth: "1px",
		backgroundColor: "#fafafa",
		overflow: "hidden",
		borderRadius: "4px",
	};

	const descriptionTextStyle = {
		margin: "10px",
		fontFamily: '"Open sans", Helvetica,sans-serif',
		fontSize: "12px",
		whiteSpace: "pre-line" as const,
	};

	return (
		<>
			{displayDescription && description.length > 0 && (
				<div className="collapsible-box" style={descriptionBoxStyle}>
					<div style={descriptionTextStyle}>{description}</div>
				</div>
			)}

			{configPanel.length > 0 && (
				<form>
					<div id="workflow-configuration">
{/* @ts-expect-error TS(7006): Parameter 'configOption' implicitly has an 'any' t... Remove this comment to see the full error message */}
						{configPanel.map((configOption, key) => (
							<fieldset key={key}>
								{!!configOption.legend && (
									<legend>{configOption.legend}</legend>
								)}
								{!!configOption.description && (
									<p>{configOption.description}</p>
								)}
								<ul>
{/* @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type. */}
									{configOption.fieldset?.map((field, keys) =>
										renderInputByType(field, keys, formik)
									)}
								</ul>
							</fieldset>
						))}
					</div>
				</form>
			)}
		</>
	);
};

// render input depending on field type
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
const renderInputByType = (field, key, formik) => {
	switch (field.type) {
		case "checkbox":
			return <RenderCheckbox field={field} key={key} formik={formik} />;
		case "radio":
			return <RenderRadio field={field} key={key} formik={formik} />;
		case "number":
			return <RenderNumber field={field} key={key} formik={formik} />;
		case "text":
			return <RenderText field={field} key={key} formik={formik} />;
    case "datetime-local":
            return <RenderDatetimeLocal field={field} key={key} formik={formik} />;
		default:
			return "";
	}
};

// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
const RenderDatetimeLocal = ({ field, formik }) => {
    return <RenderField field={field} formik={formik} />;
};

// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
const RenderCheckbox = ({ field, formik }) => {
    return <RenderField field={field} formik={formik} />;
};

// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
const RenderRadio = ({ field, formik }) => {
    return <RenderField field={field} formik={formik} />;
};

// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
const RenderNumber = ({ field, formik }) => {
	// validate that value of number is between max and min
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	const validate = (value) => {
		let error;
		if (parseInt(value) > field.max || parseInt(value) < field.min) {
			error = "out of range";
		}
		return error;
	};

    return <RenderField field={field} formik={formik} validate={validate}/>;
};

// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
const RenderText = ({ field, formik }) => {
    return <RenderField field={field} formik={formik} />;
};

const RenderField : React.FC<{
  field: any,
  formik: any,
  validate?: (value: any) => string | undefined,
}> = ({
  field,
  formik,
  validate = undefined
}) => {
	// id used for Field and label
	const uuid = uuidv4();
	const disabled = !!field.disabled ? field.disabled : false;

  const renderField = () => {
      return(
				<Field
          id={uuid}
          defaultValue={field.defaultValue}
          validate={validate}
          className="configField"
          name={"configuration." + field.name}
          disabled={disabled}
          type={field.type}
          min={field.min}
          max={field.max}
        />
      )
  }

	return (
		<li>
			{renderField()}
			<label htmlFor={uuid}>{field.label}</label>
			{/* if input has an additional fieldset or further configuration inputs
            then render again by input type*/}
			{!!field.fieldset && !!formik.values.configuration[field.name] && (
				<ul className="workflow-configuration-subpanel">
{/* @ts-expect-error TS(7006): Parameter 'f' implicitly has an 'any' type. */}
					{field.fieldset?.map((f, keys) => renderInputByType(f, keys, formik))}
				</ul>
			)}
		</li>
	);
}

export default RenderWorkflowConfig;
