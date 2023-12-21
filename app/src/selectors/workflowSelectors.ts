import { createSelector } from "reselect";

/**
 * This file contains selectors regarding workflows
 */

export const getWorkflowDef = (state: any) => state.workflows.workflows;

// Selector for getting a workflow definition by its id
// first you have to find said id in state then put these in selector because reselect need one input selector
export const makeGetWorkflowDefById = (state: any, props: any) =>
	state.workflows.workflows.find(
// @ts-expect-error TS(7006): Parameter 'workflow' implicitly has an 'any' type.
		(workflow) => workflow.id === props.workflowId
	);
export const getWorkflowDefById = () =>
	createSelector(makeGetWorkflowDefById, (workflowDef) => ({ workflowDef }));
