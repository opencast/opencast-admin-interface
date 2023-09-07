import axios from "axios";
import {
	loadRecordingDetailsFailure,
	loadRecordingDetailsInProgress,
	loadRecordingDetailsSuccess,
} from "../actions/recordingDetailsActions";

// fetch details of certain recording from server
// @ts-expect-error TS(7006): Parameter 'name' implicitly has an 'any' type.
export const fetchRecordingDetails = (name) => async (dispatch) => {
	try {
		dispatch(loadRecordingDetailsInProgress());

		// fetch recording details
		let data = await axios.get(`/admin-ng/capture-agents/${name}`);

		const recordingDetails = await data.data;

		dispatch(loadRecordingDetailsSuccess(recordingDetails));
	} catch (e) {
		dispatch(loadRecordingDetailsFailure());
		console.error(e);
	}
};
