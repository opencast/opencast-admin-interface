import { RootState } from "../store";

/**
 * This file contains selectors regarding details of a certain lifeCyclePolicy/capture agent
 */
export const getLifeCyclePolicyDetails = (state: RootState) => state.lifeCyclePolicyDetails;
export const getLifeCyclePolicyDetailsAcl = (state: RootState) => state.lifeCyclePolicyDetails.accessControlEntries;
