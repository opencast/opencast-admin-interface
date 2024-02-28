import axios from "axios";
import { addNotification } from "../slices/notificationSlice";

export const postTasks = (values: any) => async (dispatch: any) => {
	let configuration = {};
	Object.keys(values.configuration).forEach((config) => {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
		configuration[config] = String(values.configuration[config]);
	});

	let workflowConfig = {};
	for (let i = 0; i < values.events.length; i++) {
		if (values.events[i].selected) {
			let eventId = values.events[i].id;
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			workflowConfig[eventId] = configuration;
		}
	}

	let metadataJson = {
		workflow: values.workflow,
		configuration: workflowConfig,
	};

	let data = new URLSearchParams();
	data.append("metadata", JSON.stringify(metadataJson));

	axios
		.post("/admin-ng/tasks/new", data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			console.info(response);
			dispatch(addNotification({type: "success", key: "TASK_CREATED"}));
		})
		.catch((response) => {
			console.error(response);
			dispatch(addNotification({type: "error", key: "TASK_NOT_CREATED"}));
		});
};
