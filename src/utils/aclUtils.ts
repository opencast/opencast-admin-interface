/*This File contains functions that are needed in several access right views*/

import { TransformedAcl } from "../slices/aclDetailsSlice";
import { Role } from "../slices/aclSlice";

export const getAclTemplateText = (
	aclTemplates: {
		id: string
		value: string
	}[],
	formikTemplate: string
) => {
	if (!!aclTemplates && aclTemplates.length > 0) {
		const template = aclTemplates.find(
			(template) => formikTemplate === template.id
		);
		return !!template ? template.value : "";
	} else {
		return "";
	}
};

export const filterRoles = (roles: Role[], policies: TransformedAcl[]) => {
	return roles.filter(
		(role) => !policies.find((policy) => policy.role === role.name)
	);
};
