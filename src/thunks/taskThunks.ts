import axios from "axios";
import { addNotification } from "../slices/notificationSlice";
import { AppDispatch } from "../store";
import { Event } from "../slices/eventSlice";

export const postTasks = (
	values: {
		events: Event[]
		configuration: { [key: string] : string }
		workflow: string
	}
) => async (dispatch: AppDispatch) => {
	let configuration: { [key: string] : string } = {};
	Object.keys(values.configuration).forEach((config) => {
		configuration[config] = String(values.configuration[config]);
	});

	let workflowConfig: { [key: string] : { [key: string] : string } } = {};
	for (let i = 0; i < values.events.length; i++) {
		if (values.events[i].selected) {
			let eventId = values.events[i].id;
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
