import axios from "axios";
import {
	loadWorkflowDefFailure,
	loadWorkflowDefInProgress,
	loadWorkflowDefSuccess,
} from "../actions/workflowActions";

// fetch workflow definitions from server
// @ts-expect-error TS(7006): Parameter 'type' implicitly has an 'any' type.
export const fetchWorkflowDef = (type) => async (dispatch) => {
	try {
		dispatch(loadWorkflowDefInProgress());

		let urlParams;

		switch (type) {
			case "tasks": {
				urlParams = {
					tags: "archive",
				};
				break;
			}
			case "delete-event": {
				urlParams = {
					tags: "delete",
				};
				break;
			}
			case "event-details":
				urlParams = {
					tags: "schedule",
				};
				break;
			default: {
				urlParams = {
					tags: "upload,schedule",
				};
			}
		}

		let data = await axios.get("/admin-ng/event/new/processing?", {
			params: urlParams,
		});

		const response = await data.data;

		let workflows = response.workflows;

// @ts-expect-error TS(7006): Parameter 'workflow' implicitly has an 'any' type.
		workflows = workflows.map((workflow) => {
			if (workflow.configuration_panel_json.length > 0) {
				return {
					...workflow,
					configuration_panel_json: JSON.parse(
						workflow.configuration_panel_json
					),
				};
			} else {
				return workflow;
			}
		});

		const workflowDef = {
			defaultWorkflowId: response.default_workflow_id,
			workflows: workflows,
		};
		dispatch(loadWorkflowDefSuccess(workflowDef));
	} catch (e) {
		dispatch(loadWorkflowDefFailure());
		console.error(e);
	}
};
