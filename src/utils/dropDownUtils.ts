import { Recording } from "../slices/recordingSlice";
import { Workflow } from "../slices/workflowSlice";
import { Role } from "../slices/aclSlice";
/*
 * this file contains functions, which are needed for the searchable drop-down selections
 */

export const formatTimeForDropdown = (times: {index: number, value: string}[]) => {
	return times.map(({index, value}) => ({ label: value, value: index }));
};

export const formatCaptureAgentForDropdown = (captureAgents: Recording[]) => {
	return captureAgents.map(captureAgent => ({ label: captureAgent.name, value: captureAgent.name }));
};

export const formatWorkflowsForDropdown = (workflows: Workflow[]) => {
	return workflows.map(workflow => ({ label: workflow.title, value: workflow.id }));
};

export const formatAclTemplatesForDropdown = (templates: { id: string, value: string }[]) => {
	return templates.map(template => ({ label: template.value, value: template.id}));
};

export const formatAclRolesForDropdown = (roles: Role[]) => {
	return roles.map(role => ({ label: role.name, value: role.name }));
};
