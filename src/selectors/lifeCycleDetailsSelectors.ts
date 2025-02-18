import { RootState } from "../store";

/**
 * This file contains selectors regarding details of a certain lifeCyclePolicy/capture agent
 */
export const getLifeCyclePolicyDetails = (state: RootState) => state.lifeCyclePolicyDetails;
export const getLifeCyclePolicyDetailsAcl = (state: RootState) => state.lifeCyclePolicyDetails.accessControlEntries;
export const getLifeCyclePolicyActions = (state: RootState) => state.lifeCyclePolicyDetails.actionsEnum;
export const getLifeCyclePolicyTargetTypes = (state: RootState) => state.lifeCyclePolicyDetails.targetTypesEnum;
export const getLifeCyclePolicyTimings = (state: RootState) => state.lifeCyclePolicyDetails.timingsEnum;
