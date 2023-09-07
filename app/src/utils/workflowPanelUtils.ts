// fill values with default configuration of chosen workflow
export const setDefaultConfig = (workflowDefinitions: any, workflowId: any) => {
	let defaultConfiguration = {};

	// find configuration panel information about chosen workflow
	let configPanel = workflowDefinitions.find(
// @ts-expect-error TS(7006): Parameter 'workflow' implicitly has an 'any' type.
		(workflow) => workflow.id === workflowId
	).configuration_panel_json;

	// only set default values if there is an configuration panel
	if (configPanel.length > 0) {
		// iterate through all config options and set their defaults
// @ts-expect-error TS(7006): Parameter 'configOption' implicitly has an 'any' t... Remove this comment to see the full error message
		configPanel.forEach((configOption) => {
			if (configOption.fieldset) {
				defaultConfiguration = fillDefaultConfig(
					configOption.fieldset,
					defaultConfiguration
				);
			}
		});
	}

	return defaultConfiguration;
};

// fills default configuration with values
// @ts-expect-error TS(7006): Parameter 'fieldset' implicitly has an 'any' type.
const fillDefaultConfig = (fieldset, defaultConfiguration) => {
	// iteration through each input field
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
	fieldset.forEach((field) => {

    // set only the checked input of radio button as default value
    if (field.type === "radio" && field.checked) {
      defaultConfiguration[field.name] = field.value;
    }
    else if (field.type === "datetime-local") {
      const date = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0];
      defaultConfiguration[field.name] = date;
      field.defaultValue = date;
    }
    // set value in default configuration
    else {
      defaultConfiguration[field.name] = field.value;
    }

		// if an input has further configuration then go through fillDefaultConfig again
		if (field.fieldset) {
			defaultConfiguration = fillDefaultConfig(
				field.fieldset,
				defaultConfiguration
			);
		}
	});

	return defaultConfiguration;
};
