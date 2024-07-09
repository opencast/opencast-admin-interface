import { RootState } from "../store";

/**
 * This file contains selectors regarding details of a certain recording/capture agent
 */
export const getRecordingDetails = (state: RootState) => state.recordingDetails;
