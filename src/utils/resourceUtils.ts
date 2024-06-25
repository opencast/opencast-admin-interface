import { getFilters, getTextFilter } from "../selectors/tableFilterSelectors";
import {
	getPageLimit,
	getPageOffset,
	getTableDirection,
	getTableSorting,
} from "../selectors/tableSelectors";
import { TransformedAcl } from "../slices/aclDetailsSlice";
import { Acl } from "../slices/aclSlice";
import { NewUser } from "../slices/userSlice";
import { Recording } from "../slices/recordingSlice";
import { UserInfoState } from "../slices/userInfoSlice";
import { hasAccess, isJson } from "./utils";
import { RootState } from "../store";
import { MetadataCatalog } from "../slices/eventSlice";

/**
 * This file contains methods that are needed in more than one resource thunk
 */

// prepare http headers for posting to resources
export const getHttpHeaders = () => {
	return {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	};
};

// prepare URL params for getting resources
export const getURLParams = (
	state: RootState
) => {
	// get filter map from state
	let filters = [];
	let filterMap = getFilters(state);
	let textFilter = getTextFilter(state);

	// check if textFilter has value and transform for use as URL param
	if (textFilter !== "") {
		filters.push("textFilter:" + textFilter);
	}
	// transform filters for use as URL param
	for (let key in filterMap) {
		if (!!filterMap[key].value) {
			filters.push(filterMap[key].name + ":" + filterMap[key].value.toString());
		}
	}

	let params = {
		limit: getPageLimit(state),
		offset: getPageOffset(state) * getPageLimit(state),
	};

	if (filters.length) {
		params = {
			...params,
// @ts-expect-error TS(2322): Type '{ filter: string; limit: any; offset: number... Remove this comment to see the full error message
			filter: filters.join(","),
		};
	}

	if (getTableSorting(state) !== "") {
		params = {
			...params,
// @ts-expect-error TS(2322): Type '{ sort: string; limit: any; offset: number; ... Remove this comment to see the full error message
			sort: getTableSorting(state) + ":" + getTableDirection(state),
		};
	}

	return params;
};

// used for create URLSearchParams for API requests used to create/update user
export const buildUserBody = (values: NewUser) => {
	let data = new URLSearchParams();
	// fill form data with user inputs
	data.append("username", values.username);
	data.append("name", values.name);
	data.append("email", values.email);
	data.append("password", values.password);
	data.append("roles", JSON.stringify(values.roles));

	return data;
};

// used for create URLSearchParams for API requests used to create/update group
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const buildGroupBody = (values) => {
	let roles = [],
		users = [];

	// fill form data depending on user inputs
	let data = new URLSearchParams();
	data.append("name", values.name);
	data.append("description", values.description);

	for (let i = 0; i < values.roles.length; i++) {
		roles.push(values.roles[i].name);
	}
	for (let i = 0; i < values.users.length; i++) {
		users.push(values.users[i].id);
	}
	data.append("roles", roles.join(","));
	data.append("users", users.join(","));

	return data;
};

// get initial metadata field values for formik in create resources wizards
export const getInitialMetadataFieldValues = (
	metadataFields: MetadataCatalog,
	extendedMetadata: MetadataCatalog[]
) => {
	let initialValues: { [key: string]: string | string[] | boolean } = {};

	if (!!metadataFields.fields && metadataFields.fields.length > 0) {
		metadataFields.fields.forEach((field) => {
			initialValues[field.id] = field.value;
		});
	}

	if (extendedMetadata.length > 0) {
		for (const metadataCatalog of extendedMetadata) {
			if (!!metadataCatalog.fields && metadataCatalog.fields.length > 0) {
				metadataCatalog.fields.forEach((field) => {
					let value = false;
					if (field.value === "true") {
						value = true;
					} else if (field.value === "false") {
						value = false;
					}

					initialValues[metadataCatalog.flavor + "_" + field.id] = value;
				});
			}
		}
	}

	return initialValues;
};

// transform collection of metadata into object with name and value
export const transformMetadataCollection = (metadata: any, noField: boolean) => {
	if (noField) {
		for (let i = 0; metadata.length > i; i++) {
			if (!!metadata[i].collection) {
				metadata[i].collection = Object.keys(metadata[i].collection).map(
					(key) => {
						return {
							name: key,
							value: metadata[i].collection[key],
						};
					}
				);
			}
			metadata[i] = {
				...metadata[i],
				selected: false,
			};
		}
	} else {
		for (let i = 0; metadata.fields.length > i; i++) {
			if (!!metadata.fields[i].collection) {
				metadata.fields[i].collection = Object.keys(
					metadata.fields[i].collection
				).map((key) => {
					if (isJson(key)) {
						let collectionParsed = JSON.parse(key);
						return {
							name: collectionParsed.label ? collectionParsed.label : key,
							value: metadata.fields[i].collection[key],
							...collectionParsed,
						};
					} else {
						return {
							name: key,
							value: metadata.fields[i].collection[key],
						};
					}
				});
			}
		}
	}

	return metadata;
};

// transform metadata catalog for update via post request
// @ts-expect-error TS(7006): Parameter 'catalog' implicitly has an 'any' type.
export const transformMetadataForUpdate = (catalog, values) => {
// @ts-expect-error TS(7034): Variable 'fields' implicitly has type 'any[]' in s... Remove this comment to see the full error message
	let fields = [];
// @ts-expect-error TS(7034): Variable 'updatedFields' implicitly has type 'any[... Remove this comment to see the full error message
	let updatedFields = [];

// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
	catalog.fields.forEach((field) => {
		if (field.value !== values[field.id]) {
			let updatedField = {
				...field,
				value: values[field.id],
			};
			updatedFields.push(updatedField);
			fields.push(updatedField);
		} else {
			fields.push({ ...field });
		}
	});
	let data = new URLSearchParams();
	data.append(
		"metadata",
		JSON.stringify([
			{
				flavor: catalog.flavor,
				title: catalog.title,
// @ts-expect-error TS(7005): Variable 'updatedFields' implicitly has an 'any[]'... Remove this comment to see the full error message
				fields: updatedFields,
			},
		])
	);
	const headers = getHttpHeaders();

// @ts-expect-error TS(7005): Variable 'fields' implicitly has an 'any[]' type.
	return { fields, data, headers };
};

// Prepare metadata for post of new events or series
export const prepareMetadataFieldsForPost = (
// @ts-expect-error TS(7006): Parameter 'metadataInfo' implicitly has an 'any' t... Remove this comment to see the full error message
	metadataInfo,
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	values,
	formikIdPrefix = ""
) => {
// @ts-expect-error TS(7034): Variable 'metadataFields' implicitly has type 'any... Remove this comment to see the full error message
	let metadataFields = [];

	// fill metadataField with field information send by server previously and values provided by user
	// Todo: What is hashkey?
	for (let i = 0; metadataInfo.length > i; i++) {
		let fieldValue = {
			id: metadataInfo[i].id,
			type: metadataInfo[i].type,
			value: values[formikIdPrefix + metadataInfo[i].id],
			tabindex: i + 1,
			$$hashKey: "object:123",
		};
		if (!!metadataInfo[i].translatable) {
			fieldValue = {
				...fieldValue,
// @ts-expect-error TS(2322): Type '{ translatable: any; id: any; type: any; val... Remove this comment to see the full error message
				translatable: metadataInfo[i].translatable,
			};
		}
// @ts-expect-error TS(7005): Variable 'metadataFields' implicitly has an 'any[]... Remove this comment to see the full error message
		metadataFields = metadataFields.concat(fieldValue);
	}

	return metadataFields;
};

// Prepare extended metadata for post of new events or series
export const prepareExtendedMetadataFieldsForPost = (
// @ts-expect-error TS(7006): Parameter 'extendedMetadata' implicitly has an 'an... Remove this comment to see the full error message
	extendedMetadata,
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	values
) => {
	const extendedMetadataFields = [];

	for (const catalog of extendedMetadata) {
		const catalogPrefix = catalog.flavor + "_";
		const metadataFields = prepareMetadataFieldsForPost(
			catalog.fields,
			values,
			catalogPrefix
		);

		// Todo: What is hashkey?
		const metadataCatalog = {
			flavor: catalog.flavor,
			title: catalog.title,
			fields: metadataFields,
			$$hashKey: "object:123",
		};

		extendedMetadataFields.push(metadataCatalog);
	}

	return extendedMetadataFields;
};

export const prepareSeriesMetadataFieldsForPost = (
// @ts-expect-error TS(7006): Parameter 'metadataInfo' implicitly has an 'any' t... Remove this comment to see the full error message
	metadataInfo,
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	values,
	formikIdPrefix = ""
) => {
// @ts-expect-error TS(7034): Variable 'metadataFields' implicitly has type 'any... Remove this comment to see the full error message
	let metadataFields = [];

	// fill metadataField with field information sent by server previously and values provided by user
	for (let i = 0; metadataInfo.length > i; i++) {
		let fieldValue = {
			readOnly: metadataInfo[i].readOnly,
			id: metadataInfo[i].id,
			label: metadataInfo[i].label,
			type: metadataInfo[i].type,
			value: values[formikIdPrefix + metadataInfo[i].id],
			tabindex: i + 1,
		};
		if (!!metadataInfo[i].translatable) {
			fieldValue = {
				...fieldValue,
// @ts-expect-error TS(2322): Type '{ translatable: any; readOnly: any; id: any;... Remove this comment to see the full error message
				translatable: metadataInfo[i].translatable,
			};
		}
		if (!!metadataInfo[i].collection) {
			fieldValue = {
				...fieldValue,
// @ts-expect-error TS(2322): Type '{ collection: never[]; readOnly: any; id: an... Remove this comment to see the full error message
				collection: [],
			};
		}
		if (!!metadataInfo[i].required) {
			fieldValue = {
				...fieldValue,
// @ts-expect-error TS(2322): Type '{ required: any; readOnly: any; id: any; lab... Remove this comment to see the full error message
				required: metadataInfo[i].required,
			};
		}
		if (metadataInfo[i].type === "mixed_text") {
			fieldValue = {
				...fieldValue,
// @ts-expect-error TS(2322): Type '{ presentableValue: any; readOnly: any; id: ... Remove this comment to see the full error message
				presentableValue: values[formikIdPrefix + metadataInfo[i].id].join(),
			};
		} else {
			fieldValue = {
				...fieldValue,
// @ts-expect-error TS(2322): Type '{ presentableValue: any; readOnly: any; id: ... Remove this comment to see the full error message
				presentableValue: values[formikIdPrefix + metadataInfo[i].id],
			};
		}
// @ts-expect-error TS(7005): Variable 'metadataFields' implicitly has an 'any[]... Remove this comment to see the full error message
		metadataFields = metadataFields.concat(fieldValue);
	}

	return metadataFields;
};

// Prepare extended metadata for post of new events or series
export const prepareSeriesExtendedMetadataFieldsForPost = (
// @ts-expect-error TS(7006): Parameter 'extendedMetadata' implicitly has an 'an... Remove this comment to see the full error message
	extendedMetadata,
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	values
) => {
	const extendedMetadataFields = [];

	for (const catalog of extendedMetadata) {
		const catalogPrefix = catalog.flavor + "_";
		const metadataFields = prepareSeriesMetadataFieldsForPost(
			catalog.fields,
			values,
			catalogPrefix
		);

		// Todo: What is hashkey?
		const metadataCatalog = {
			flavor: catalog.flavor,
			title: catalog.title,
			fields: metadataFields,
		};

		extendedMetadataFields.push(metadataCatalog);
	}

	return extendedMetadataFields;
};

// returns the name for a field value from the collection
// @ts-expect-error TS(7006): Parameter 'metadataField' implicitly has an 'any' ... Remove this comment to see the full error message
export const getMetadataCollectionFieldName = (metadataField, field) => {
	try {
		const collectionField = metadataField.collection.find(
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
			(element) => element.value === field.value
		);
		return collectionField.name;
	} catch (e) {
		return "";
	}
};

// Prepare rules of access policies for post of new events or series
// @ts-expect-error TS(7006): Parameter 'policies' implicitly has an 'any' type.
export const prepareAccessPolicyRulesForPost = (policies) => {
	// access policies for post request
	let access = {
		acl: {
			ace: [],
		},
	};

	// iterate through all policies provided by user and transform them into form required for request
	for (let i = 0; policies.length > i; i++) {
		if (policies[i].read) {
			access.acl.ace = access.acl.ace.concat({
// @ts-expect-error TS(2769): No overload matches this call.
				action: "read",
				allow: policies[i].read,
				role: policies[i].role,
			});
		}
		if (policies[i].write) {
			access.acl.ace = access.acl.ace.concat({
// @ts-expect-error TS(2769): No overload matches this call.
				action: "write",
				allow: policies[i].write,
				role: policies[i].role,
			});
		}
		if (policies[i].actions.length > 0) {
			for (let j = 0; policies[i].actions.length > j; j++) {
				access.acl.ace = access.acl.ace.concat({
// @ts-expect-error TS(2769): No overload matches this call.
					action: policies[i].actions[j],
					allow: true,
					role: policies[i].role,
				});
			}
		}
	}

	return access;
};

// transform response data in form that is used in wizards and modals for policies (for each role one entry)
export const transformAclTemplatesResponse = (acl: Acl) => {
	let template: TransformedAcl[] = [];

	for (let i = 0; acl.ace.length > i; i++) {
		if (template.find((rule) => rule.role === acl.ace[i].role)) {
			for (let j = 0; template.length > j; j++) {
				// Only update entry for policy if already added with other action
				if (template[j].role === acl.ace[i].role) {
					if (acl.ace[i].action === "read") {
						template[j] = {
							...template[j],
							read: acl.ace[i].allow,
						};
						break;
					}
					if (acl.ace[i].action === "write") {
						template[j] = {
							...template[j],
							write: acl.ace[i].allow,
						};
						break;
					}
					if (
						acl.ace[i].action !== "read" &&
						acl.ace[i].action !== "write" &&
						acl.ace[i].allow === true
					) {
						template[j] = {
							...template[j],
							actions: template[j].actions.concat(acl.ace[i].action),
						};
						break;
					}
				}
			}
		} else {
			// add policy if role not seen before
			if (acl.ace[i].action === "read") {
				template = template.concat({
					role: acl.ace[i].role,
					read: acl.ace[i].allow,
					write: false,
					actions: [],
				});
			}
			if (acl.ace[i].action === "write") {
				template = template.concat({
					role: acl.ace[i].role,
					read: false,
					write: acl.ace[i].allow,
					actions: [],
				});
			}
			if (
				acl.ace[i].action !== "read" &&
				acl.ace[i].action !== "write" &&
				acl.ace[i].allow === true
			) {
				template = template.concat({
					role: acl.ace[i].role,
					read: false,
					write: false,
					actions: [acl.ace[i].action],
				});
			}
		}
	}

	return template;
};

// filter devices, so that only devices for which the user has access rights are left
export const filterDevicesForAccess = (user: UserInfoState, inputDevices: Recording[]) => {
	if (user.isOrgAdmin) {
		return inputDevices;
	} else {
		const devicesWithAccessRights = [];
		for (const device of inputDevices) {
			const inputDeviceAccessRole =
				"ROLE_CAPTURE_AGENT_" +
				device.id.replace(/[^a-zA-Z0-9_]/g, "").toUpperCase();
			if (hasAccess(inputDeviceAccessRole, user)) {
				devicesWithAccessRights.push(device);
			}
		}

		return devicesWithAccessRights;
	}
};

// returns, whether user has access rights for any inputDevices
export const hasAnyDeviceAccess = (user: UserInfoState, inputDevices: Recording[]) => {
	return filterDevicesForAccess(user, inputDevices).length > 0;
};

// returns, whether user has access rights for a specific inputDevice
export const hasDeviceAccess = (user: UserInfoState, deviceId: Recording["id"]) => {
	if (user.isOrgAdmin) {
		return true;
	} else {
		const inputDeviceAccessRole =
			"ROLE_CAPTURE_AGENT_" +
			deviceId.replace(/[^a-zA-Z0-9_]/g, "").toUpperCase();
		return hasAccess(inputDeviceAccessRole, user);
	}
};

// build body for post/put request in theme context
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const buildThemeBody = (values) => {
	// fill form data depending on user inputs
	let data = new URLSearchParams();
	data.append("name", values.name);
	data.append("description", values.description);
	data.append("bumperActive", values.bumperActive);
	if (values.bumperActive) {
		data.append("bumperFile", values.bumperFile);
	}
	data.append("trailerActive", values.trailerActive);
	if (values.trailerActive) {
		data.append("trailerFile", values.trailerFile);
	}
	data.append("titleSlideActive", values.titleSlideActive);
	if (values.titleSlideActive && values.titleSlideMode === "upload") {
		data.append("titleSlideBackground", values.titleSlideBackground);
	}
	data.append("licenseSlideActive", values.licenseSlideActive);
	data.append("watermarkActive", values.watermarkActive);
	if (values.watermarkActive) {
		data.append("watermarkFile", values.watermarkFile);
		data.append("watermarkPosition", values.watermarkPosition);
	}

	return data;
};

// creates an empty policy with the role from the argument
export const createPolicy = (role: string) => {
	const actions: string[] = [];
	return {
		role: role,
		read: false,
		write: false,
		actions: actions,
	};
};
