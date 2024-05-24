/*This File contains functions that are needed in several access right views*/

export const getAclTemplateText = (aclTemplates: any, formikTemplate: any) => {
	if (!!aclTemplates && aclTemplates.length > 0) {
		const template = aclTemplates.find(
// @ts-expect-error TS(7006): Parameter 'template' implicitly has an 'any' type.
			(template) => formikTemplate === template.id
		);
		return !!template ? template.value : "";
	} else {
		return "";
	}
};

// @ts-expect-error TS(7006): Parameter 'roles' implicitly has an 'any' type.
export const filterRoles = (roles, policies) => {
	return roles.filter(
// @ts-expect-error TS(7006): Parameter 'role' implicitly has an 'any' type.
		(role) => !policies.find((policy) => policy.role === role.name)
	);
};
