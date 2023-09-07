import axios from "axios";
import {
	loadRecordingsFailure,
	loadRecordingsInProgress,
	loadRecordingsSuccess,
} from "../actions/recordingActions";
import { getURLParams } from "../utils/resourceUtils";
import { addNotification } from "./notificationThunks";

// fetch recordings from server
// @ts-expect-error TS(7006): Parameter 'flag' implicitly has an 'any' type.
export const fetchRecordings = (flag) => async (dispatch, getState) => {
	try {
		dispatch(loadRecordingsInProgress());

		let data;

		if (flag === "inputs") {
			data = await axios.get(
				"/admin-ng/capture-agents/agents.json?inputs=true"
			);
		} else {
			const state = getState();
			let params = getURLParams(state);

			// /agents.json?filter={filter}&limit=100&offset=0&inputs=false&sort={sort}
			data = await axios.get("/admin-ng/capture-agents/agents.json", {
				params: params,
			});
		}

		const recordings = await data.data;

		let captureAgents = [];

		for (const agent of recordings.results) {
			const transformedAgent = {
				id: agent.Name,
				name: agent.Name,
				status: agent.Status,
				updated: agent.Update,
				inputs: !!agent.inputs ? [...agent.inputs] : [],
				roomId: !!agent.roomId ? agent.roomId : "",
				type: "LOCATION",
				url: !!agent.url ? agent.url : "",
				removable:
					"AGENTS.STATUS.OFFLINE" === agent.Status ||
					"AGENTS.STATUS.UNKNOWN" === agent.Status,
			};

			captureAgents.push(transformedAgent);
		}

		dispatch(loadRecordingsSuccess({ ...recordings, results: captureAgents }));
	} catch (e) {
		dispatch(loadRecordingsFailure());
		console.error(e);
	}
};

// delete location with provided id
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const deleteRecording = (id) => async (dispatch) => {
	// API call for deleting a location
	axios
		.delete(`/admin-ng/capture-agents/${id}`)
		.then((res) => {
			console.info(res);
			// add success notification
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
			dispatch(addNotification("success", "LOCATION_DELETED"));
		})
		.catch((res) => {
			console.error(res);
			// add error notification depending on status code
			if (res.status === 401) {
				dispatch(
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
					addNotification("error", "LOCATION_NOT_DELETED_NOT_AUTHORIZED")
				);
			} else {
// @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
				dispatch(addNotification("error", "LOCATION_NOT_DELETED"));
			}
		});
};
