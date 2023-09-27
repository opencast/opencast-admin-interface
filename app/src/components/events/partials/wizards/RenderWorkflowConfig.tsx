import React from "react";
import { connect } from "react-redux";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from "uuid";
import { Field } from "formik";
import {
	getWorkflowDefById,
	makeGetWorkflowDefById,
} from "../../../../selectors/workflowSelectors";

/**
 * This component renders the configuration panel for the selected workflow in the processing step of the new event
 * wizard chosen via dropdown.
 * Here, props is used instead of {} containing name of each prop because props are needed in the selector for finding
 * the workflow definition with the matching id. In this case props need to be considered in mapStateToProps and
 * therefore {} containing names of props not works.
 */
// @ts-expect-error TS(7006): Parameter 'props' implicitly has an 'any' type.
const RenderWorkflowConfig = (props) => {
	// Get html for configuration panel
	const configPanel = !!props.configuration_panel_json
		? props.configuration_panel_json
		: [];
	const description = !!props.description ? props.description : "";
	const displayDescription = !!props.displayDescription;
	let formik = props.formik;

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
const RenderDatetimeLocal = ({ field, key, formik }) => {
  field.value = undefined;

    return <RenderField field={field} key={key} formik={formik} />;
};

// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
const RenderCheckbox = ({ field, key, formik }) => {
  field.defaultValue = field.value;
  field.value = undefined;

    return <RenderField field={field} key={key} formik={formik} />;
};

// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
const RenderRadio = ({ field, key, formik }) => {
    return <RenderField field={field} key={key} formik={formik} />;
};

// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
const RenderNumber = ({ field, key, formik }) => {
	// validate that value of number is between max and min
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	const validate = (value) => {
		let error;
		if (parseInt(value) > field.max || parseInt(value) < field.min) {
			error = "out of range";
		}
		return error;
	};

  field.defaultValue = field.value;
  field.value = undefined;

    return <RenderField field={field} key={key} formik={formik} validate={validate}/>;
};

// @ts-expect-error TS(7031): Binding element 'field' implicitly has an 'any' ty... Remove this comment to see the full error message
const RenderText = ({ field, key, formik }) => {
  field.value = undefined;

    return <RenderField field={field} key={key} formik={formik} />;
};

const RenderField : React.FC<{
  field: any,
  key: any,
  formik: any,
  validate?: (value: any) => string | undefined,
}> = ({
  field,
  key,
  formik,
  validate = undefined
}) => {
	// id used for Field and label
	const uuid = uuidv4();
	const disabled = !!field.disabled ? field.disabled : false;

  // Only set value to *anything* if there is actually a value to be had
  // Otherwise it empties the displayed value when switching between tabs
  const renderField = () => {
    if (field.value) {
      return(
                <Field
          id={uuid}
          defaultValue={field.defaultValue}
          value={field.value}
          validate={validate}
          className="configField"
          name={"configuration." + field.name}
          disabled={disabled}
          type={field.type}
          min={field.min}
          max={field.max}
        />
      )
    } else {
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
  }

	return (
		<li key={key}>
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

// Getting state data out of redux store
const mapStateToProps = () => {
	getWorkflowDefById();
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
	return (state, props) => makeGetWorkflowDefById(state, props);
};

export default connect(mapStateToProps)(RenderWorkflowConfig);
