import axios from "axios";
import {
	loadEventPoliciesInProgress,
	loadEventPoliciesSuccess,
	loadEventPoliciesFailure,
	loadEventCommentsInProgress,
	loadEventCommentsSuccess,
	loadEventCommentsFailure,
	saveCommentInProgress,
	saveCommentDone,
	saveCommentReplyInProgress,
	saveCommentReplyDone,
	loadEventWorkflowsInProgress,
	loadEventWorkflowsSuccess,
	loadEventWorkflowsFailure,
	setEventWorkflowDefinitions,
	setEventWorkflow,
	setEventWorkflowConfiguration,
	doEventWorkflowActionInProgress,
	doEventWorkflowActionSuccess,
	doEventWorkflowActionFailure,
	deleteEventWorkflowInProgress,
	deleteEventWorkflowFailure,
	deleteEventWorkflowSuccess,
	loadEventPublicationsInProgress,
	loadEventPublicationsSuccess,
	loadEventPublicationsFailure,
	loadEventWorkflowDetailsInProgress,
	loadEventWorkflowDetailsSuccess,
	loadEventWorkflowDetailsFailure,
	loadEventWorkflowOperationsInProgress,
	loadEventWorkflowOperationsSuccess,
	loadEventWorkflowOperationsFailure,
	loadEventWorkflowOperationDetailsFailure,
	loadEventWorkflowOperationDetailsSuccess,
	loadEventWorkflowOperationDetailsInProgress,
	loadEventWorkflowErrorsInProgress,
	loadEventWorkflowErrorsSuccess,
	loadEventWorkflowErrorsFailure,
	loadEventWorkflowErrorDetailsInProgress,
	loadEventWorkflowErrorDetailsSuccess,
	loadEventWorkflowErrorDetailsFailure,
	loadEventMetadataInProgress,
	loadEventMetadataSuccess,
	loadEventMetadataFailure,
	setEventMetadata,
	setExtendedEventMetadata,
	loadEventAssetsInProgress,
	loadEventAssetsSuccess,
	loadEventAssetsFailure,
	loadEventAssetAttachmentsSuccess,
	loadEventAssetAttachmentsFailure,
	loadEventAssetCatalogsFailure,
	loadEventAssetCatalogsSuccess,
	loadEventAssetMediaSuccess,
	loadEventAssetMediaFailure,
	loadEventAssetPublicationsFailure,
	loadEventAssetPublicationsSuccess,
	loadEventAssetAttachmentDetailsSuccess,
	loadEventAssetAttachmentDetailsFailure,
	loadEventAssetCatalogDetailsSuccess,
	loadEventAssetCatalogDetailsFailure,
	loadEventAssetMediaDetailsSuccess,
	loadEventAssetMediaDetailsFailure,
	loadEventAssetPublicationDetailsSuccess,
	loadEventAssetPublicationDetailsFailure,
	loadEventSchedulingInProgress,
	loadEventSchedulingSuccess,
	loadEventSchedulingFailure,
	checkConflictsFailure,
	checkConflictsSuccess,
	checkConflictsInProgress,
	saveEventSchedulingFailure,
	saveEventSchedulingSuccess,
	saveEventSchedulingInProgress,
	loadEventStatisticsInProgress,
	loadEventStatisticsSuccess,
	loadEventStatisticsFailure,
	updateEventStatisticsSuccess,
	updateEventStatisticsFailure,
} from "../actions/eventDetailsActions";
import { removeNotificationWizardForm } from "../actions/notificationActions";
import { addNotification } from "./notificationThunks";
import {
	createPolicy,
	getHttpHeaders,
	transformMetadataCollection,
	transformMetadataForUpdate,
} from "../utils/resourceUtils";
import { NOTIFICATION_CONTEXT } from "../configs/modalConfig";
import { fetchWorkflowDef } from "../slices/workflowSlice";
import {
	fetchStatistics,
	fetchStatisticsValueUpdate,
} from "../slices/statisticsSlice";
import {
	getBaseWorkflow,
	getMetadata,
	getExtendedMetadata,
	getSchedulingSource,
	getWorkflow,
	getWorkflowDefinitions,
	getWorkflows,
	getStatistics,
} from "../selectors/eventDetailsSelectors";
import { getWorkflowDef } from "../selectors/workflowSelectors";
import {
	getAssetUploadOptions,
	getAssetUploadWorkflow,
} from "../selectors/eventSelectors";
import { calculateDuration } from "../utils/dateUtils";
import { fetchRecordings } from "../slices/recordingSlice";
import { getRecordings } from "../selectors/recordingSelectors";

// thunks for metadata

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchMetadata = (eventId) => async (dispatch) => {
	try {
		dispatch(loadEventMetadataInProgress());

		const metadataRequest = await axios.get(
			`/admin-ng/event/${eventId}/metadata.json`
		);
		const metadataResponse = await metadataRequest.data;

		const mainCatalog = "dublincore/episode";
		let usualMetadata = {};
		let extendedMetadata = [];

		for (const catalog of metadataResponse) {
			let transformedCatalog = { ...catalog };

			if (catalog.locked !== undefined) {
				let fields = [];

				for (const field of catalog.fields) {
					const adaptedField = {
						...field,
						locked: catalog.locked,
						readOnly: true,
					};

					fields.push(adaptedField);
				}
				transformedCatalog = {
					...catalog,
					fields: fields,
				};
			}
			if (catalog.flavor === mainCatalog) {
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
				usualMetadata = transformMetadataCollection({ ...transformedCatalog });
			} else {
				extendedMetadata.push(
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
					transformMetadataCollection({ ...transformedCatalog })
				);
			}
		}

		dispatch(loadEventMetadataSuccess(usualMetadata, extendedMetadata));
	} catch (e) {
		console.error(e);
		dispatch(loadEventMetadataFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const updateMetadata = (eventId, values) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch,
// @ts-expect-error TS(7006): Parameter 'getState' implicitly has an 'any' type.
	getState
) => {
	try {
		let metadataInfos = getMetadata(getState());

		const { fields, data, headers } = transformMetadataForUpdate(
			metadataInfos,
			values
		);

		await axios.put(`/admin-ng/event/${eventId}/metadata`, data, headers);

		// updated metadata in event details redux store
		let eventMetadata = {
			flavor: metadataInfos.flavor,
			title: metadataInfos.title,
			fields: fields,
		};
		dispatch(setEventMetadata(eventMetadata));
	} catch (e) {
		console.error(e);
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const updateExtendedMetadata = (eventId, values, catalog) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch,
// @ts-expect-error TS(7006): Parameter 'getState' implicitly has an 'any' type.
	getState
) => {
	try {
		const { fields, data, headers } = transformMetadataForUpdate(
			catalog,
			values
		);

		await axios.put(`/admin-ng/event/${eventId}/metadata`, data, headers);

		// updated extended metadata in event details redux store
		let eventMetadata = {
			...catalog,
			fields: fields,
		};

		const oldExtendedMetadata = getExtendedMetadata(getState());
		let newExtendedMetadata = [];

		for (const catalog of oldExtendedMetadata) {
			if (
				catalog.flavor === eventMetadata.flavor &&
				catalog.title === eventMetadata.title
			) {
				newExtendedMetadata.push(eventMetadata);
			} else {
				newExtendedMetadata.push(catalog);
			}
		}

		dispatch(setExtendedEventMetadata(newExtendedMetadata));
	} catch (e) {
		console.error(e);
	}
};

//thunks for assets

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAssets = (eventId) => async (dispatch) => {
	try {
		dispatch(loadEventAssetsInProgress());

		const assetsRequest = await axios.get(
			`/admin-ng/event/${eventId}/asset/assets.json`
		);
		const assets = await assetsRequest.data;

		let transactionsReadOnly = true;
		const fetchTransactionResult = await dispatch(
			fetchHasActiveTransactions(eventId)
		);
		if (fetchTransactionResult.active !== undefined) {
			transactionsReadOnly = fetchTransactionResult.active;
		}

		const resourceOptionsListRequest = await axios.get(
			`/admin-ng/resources/eventUploadAssetOptions.json`
		);
		const resourceOptionsListResponse = await resourceOptionsListRequest.data;

		let uploadAssetOptions = [];
		const optionsData = formatUploadAssetOptions(resourceOptionsListResponse);

// @ts-expect-error TS(2339): Property 'options' does not exist on type '{}'.
		for (const option of optionsData.options) {
			if (option.type !== "track") {
				uploadAssetOptions.push({ ...option });
			}
		}

		// if no asset options, undefine the option variable
// @ts-expect-error TS(2322): Type 'any[] | undefined' is not assignable to type... Remove this comment to see the full error message
		uploadAssetOptions =
			uploadAssetOptions.length > 0 ? uploadAssetOptions : undefined;

		dispatch(
			loadEventAssetsSuccess(assets, transactionsReadOnly, uploadAssetOptions)
		);
		if (transactionsReadOnly) {
			dispatch(
				addNotification(
					"warning",
					"ACTIVE_TRANSACTION",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
		}
	} catch (e) {
		console.error(e);
		dispatch(loadEventAssetsFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'optionsData' implicitly has an 'any' ty... Remove this comment to see the full error message
const formatUploadAssetOptions = (optionsData) => {
	const optionPrefixSource = "EVENTS.EVENTS.NEW.SOURCE.UPLOAD";
	const optionPrefixAsset = "EVENTS.EVENTS.NEW.UPLOAD_ASSET.OPTION";
	const workflowPrefix = "EVENTS.EVENTS.NEW.UPLOAD_ASSET.WORKFLOWDEFID";

	let optionsResult = {};
	let uploadOptions = [];

	for (const [key, value] of Object.entries(optionsData)) {
		if (key.charAt(0) !== "$") {
			if (
				key.indexOf(optionPrefixAsset) >= 0 ||
				key.indexOf(optionPrefixSource) >= 0
			) {
				// parse upload asset options
				let options = JSON.parse(value as any);
				if (!options["title"]) {
					options["title"] = key;
				}
				uploadOptions.push({ ...options });
			} else if (key.indexOf(workflowPrefix) >= 0) {
				// parse upload workflow definition id
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				optionsResult["workflow"] = value;
			}
		}
	}
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
	optionsResult["options"] = uploadOptions;

	return optionsResult;
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAssetAttachments = (eventId) => async (dispatch) => {
	try {
		dispatch(loadEventAssetsInProgress());

		let params = new URLSearchParams();
		params.append("id1", "attachment");

		const attachmentsRequest = await axios.get(
			`/admin-ng/event/${eventId}/asset/attachment/attachments.json`,
			{ params }
		);
		const attachmentsResponse = await attachmentsRequest.data;

		dispatch(loadEventAssetAttachmentsSuccess(attachmentsResponse));
	} catch (e) {
		console.error(e);
		dispatch(loadEventAssetAttachmentsFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAssetAttachmentDetails = (eventId, attachmentId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	try {
		dispatch(loadEventAssetsInProgress());

		let params = new URLSearchParams();
		params.append("id1", "attachment");

		const attachmentDetailsRequest = await axios.get(
			`/admin-ng/event/${eventId}/asset/attachment/${attachmentId}.json`,
			{ params }
		);
		const attachmentDetailsResponse = await attachmentDetailsRequest.data;

		dispatch(loadEventAssetAttachmentDetailsSuccess(attachmentDetailsResponse));
	} catch (e) {
		console.error(e);
		dispatch(loadEventAssetAttachmentDetailsFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAssetCatalogs = (eventId) => async (dispatch) => {
	try {
		dispatch(loadEventAssetsInProgress());

		let params = new URLSearchParams();
		params.append("id1", "catalog");

		const catalogsRequest = await axios.get(
			`/admin-ng/event/${eventId}/asset/catalog/catalogs.json`,
			{ params }
		);
		const catalogsResponse = await catalogsRequest.data;

		dispatch(loadEventAssetCatalogsSuccess(catalogsResponse));
	} catch (e) {
		console.error(e);
		dispatch(loadEventAssetCatalogsFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAssetCatalogDetails = (eventId, catalogId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	try {
		dispatch(loadEventAssetsInProgress());

		let params = new URLSearchParams();
		params.append("id1", "catalog");

		const catalogDetailsRequest = await axios.get(
			`/admin-ng/event/${eventId}/asset/catalog/${catalogId}.json`,
			{ params }
		);
		const catalogDetailsResponse = await catalogDetailsRequest.data;

		dispatch(loadEventAssetCatalogDetailsSuccess(catalogDetailsResponse));
	} catch (e) {
		console.error(e);
		dispatch(loadEventAssetCatalogDetailsFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAssetMedia = (eventId) => async (dispatch) => {
	try {
		dispatch(loadEventAssetsInProgress());

		let params = new URLSearchParams();
		params.append("id1", "media");

		const mediaRequest = await axios.get(
			`/admin-ng/event/${eventId}/asset/media/media.json`,
			{ params }
		);
		const mediaResponse = await mediaRequest.data;

		let media = [];

		//for every media file item we define the filename
		for (let i = 0; i < mediaResponse.length; i++) {
			let item = mediaResponse[i];
			const url = item.url;
			item.mediaFileName = url
				.substring(url.lastIndexOf("/") + 1)
				.split("?")[0];
			media.push(item);
		}

		dispatch(loadEventAssetMediaSuccess(media));
	} catch (e) {
		console.error(e);
		dispatch(loadEventAssetMediaFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAssetMediaDetails = (eventId, mediaId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	try {
		dispatch(loadEventAssetsInProgress());

		let params = new URLSearchParams();
		params.append("id1", "media");

		const mediaDetailsRequest = await axios.get(
			`/admin-ng/event/${eventId}/asset/media/${mediaId}.json`,
			{ params }
		);
		const mediaDetailsResponse = await mediaDetailsRequest.data;

		let mediaDetails;

		if (typeof mediaDetailsResponse === "string") {
			mediaDetails = JSON.parse(mediaDetailsResponse);
		} else {
			mediaDetails = mediaDetailsResponse;
		}

		mediaDetails.video = {
			...mediaDetails,
			video: {
				previews: [{ uri: mediaDetails.url }],
			},
			url: mediaDetails.url.split("?")[0],
		};

		dispatch(loadEventAssetMediaDetailsSuccess(mediaDetails));
	} catch (e) {
		console.error(e);
		dispatch(loadEventAssetMediaDetailsFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAssetPublications = (eventId) => async (dispatch) => {
	try {
		dispatch(loadEventAssetsInProgress());

		let params = new URLSearchParams();
		params.append("id1", "publication");

		const publicationsRequest = await axios.get(
			`/admin-ng/event/${eventId}/asset/publication/publications.json`,
			{ params }
		);
		const publicationsResponse = await publicationsRequest.data;

		dispatch(loadEventAssetPublicationsSuccess(publicationsResponse));
	} catch (e) {
		console.error(e);
		dispatch(loadEventAssetPublicationsFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAssetPublicationDetails = (eventId, publicationId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	try {
		dispatch(loadEventAssetsInProgress());

		let params = new URLSearchParams();
		params.append("id1", "publication");

		const publicationDetailsRequest = await axios.get(
			`/admin-ng/event/${eventId}/asset/publication/${publicationId}.json`,
			{ params }
		);
		const publicationDetailsResponse = await publicationDetailsRequest.data;

		dispatch(
			loadEventAssetPublicationDetailsSuccess(publicationDetailsResponse)
		);
	} catch (e) {
		console.error(e);
		dispatch(loadEventAssetPublicationDetailsFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const updateAssets = (values, eventId) => async (dispatch, getState) => {
	// get asset upload options from redux store
	const state = getState();
	const uploadAssetOptions = getAssetUploadOptions(state);
	const uploadAssetWorkflow = getAssetUploadWorkflow(state);

	let formData = new FormData();

	let assets = {
		workflow: uploadAssetWorkflow,
		options: [],
	};

	uploadAssetOptions.forEach((option) => {
		if (!!values[option.id]) {
			formData.append(option.id + ".0", values[option.id]);
			assets.options = assets.options.concat(option);
		}
	});

	formData.append(
		"metadata",
		JSON.stringify({
			assets: assets,
		})
	);

	axios
		.post(`/admin-ng/event/${eventId}/assets`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		.then((response) => {
			console.info(response);
			dispatch(
				addNotification("success", "EVENTS_UPDATED", null, NOTIFICATION_CONTEXT)
			);
		})
		.catch((response) => {
			console.error(response);
			dispatch(
				addNotification(
					"error",
					"EVENTS_NOT_UPDATED",
					null,
					NOTIFICATION_CONTEXT
				)
			);
		});
};

// thunks for access policies

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const saveAccessPolicies = (eventId, policies) => async (dispatch) => {
	const headers = getHttpHeaders();

	let data = new URLSearchParams();
	data.append("acl", JSON.stringify(policies));
// @ts-expect-error TS(2345): Argument of type 'boolean' is not assignable to pa... Remove this comment to see the full error message
	data.append("override", true);

	return axios
		.post(`/admin-ng/event/${eventId}/access`, data.toString(), headers)
		.then((response) => {
			console.info(response);
			dispatch(
				addNotification(
					"info",
					"SAVED_ACL_RULES",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
			return true;
		})
		.catch((response) => {
			console.error(response);
			dispatch(
				addNotification(
					"error",
					"ACL_NOT_SAVED",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
			return false;
		});
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchAccessPolicies = (eventId) => async (dispatch) => {
	try {
		dispatch(loadEventPoliciesInProgress());

		const policyData = await axios.get(
			`/admin-ng/event/${eventId}/access.json`
		);
		let accessPolicies = await policyData.data;

// @ts-expect-error TS(7034): Variable 'policies' implicitly has type 'any[]' in... Remove this comment to see the full error message
		let policies = [];
		if (!!accessPolicies.episode_access) {
			const json = JSON.parse(accessPolicies.episode_access.acl).acl.ace;
			let newPolicies = {};
			let policyRoles = [];
			for (let i = 0; i < json.length; i++) {
				const policy = json[i];
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				if (!newPolicies[policy.role]) {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
					newPolicies[policy.role] = createPolicy(policy.role);
					policyRoles.push(policy.role);
				}
				if (policy.action === "read" || policy.action === "write") {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
					newPolicies[policy.role][policy.action] = policy.allow;
				} else if (policy.allow === true || policy.allow === "true") {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
					newPolicies[policy.role].actions.push(policy.action);
				}
			}
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			policies = policyRoles.map((role) => newPolicies[role]);
		}

// @ts-expect-error TS(7005): Variable 'policies' implicitly has an 'any[]' type... Remove this comment to see the full error message
		dispatch(loadEventPoliciesSuccess(policies));
	} catch (e) {
		console.error(e);
		dispatch(loadEventPoliciesFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchHasActiveTransactions = (eventId) => async () => {
	try {
		const transactionsData = await axios.get(
			`/admin-ng/event/${eventId}/hasActiveTransaction`
		);
		const hasActiveTransactions = await transactionsData.data;
		return hasActiveTransactions;
	} catch (e) {
		console.error(e);
	}
};

// thunks for comments

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchComments = (eventId) => async (dispatch) => {
	try {
		dispatch(loadEventCommentsInProgress());

		const commentsData = await axios.get(`/admin-ng/event/${eventId}/comments`);
		const comments = await commentsData.data;

		const commentReasonsData = await axios.get(
			`/admin-ng/resources/components.json`
		);
		const commentReasons = (await commentReasonsData.data).eventCommentReasons;

		dispatch(loadEventCommentsSuccess(comments, commentReasons));
	} catch (e) {
		dispatch(loadEventCommentsFailure());
		console.error(e);
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const saveComment = (eventId, commentText, commentReason) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	try {
		dispatch(saveCommentInProgress());

		let headers = getHttpHeaders();

		let data = new URLSearchParams();
		data.append("text", commentText);
		data.append("reason", commentReason);

		const commentSaved = await axios.post(
			`/admin-ng/event/${eventId}/comment`,
			data.toString(),
			headers
		);
		await commentSaved.data;

		dispatch(saveCommentDone());
		return true;
	} catch (e) {
		dispatch(saveCommentDone());
		console.error(e);
		return false;
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const deleteComment = (eventId, commentId) => async () => {
	try {
		const commentDeleted = await axios.delete(
			`/admin-ng/event/${eventId}/comment/${commentId}`
		);
		await commentDeleted.data;
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
};

export const saveCommentReply = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'commentId' implicitly has an 'any' type... Remove this comment to see the full error message
	commentId,
// @ts-expect-error TS(7006): Parameter 'replyText' implicitly has an 'any' type... Remove this comment to see the full error message
	replyText,
// @ts-expect-error TS(7006): Parameter 'commentResolved' implicitly has an 'any... Remove this comment to see the full error message
	commentResolved
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch) => {
	try {
		dispatch(saveCommentReplyInProgress());

		let headers = getHttpHeaders();

		let data = new URLSearchParams();
		data.append("text", replyText);
		data.append("resolved", commentResolved);

		const commentReply = await axios.post(
			`/admin-ng/event/${eventId}/comment/${commentId}/reply`,
			data.toString(),
			headers
		);

		await commentReply.data;

		dispatch(saveCommentReplyDone());
		return true;
	} catch (e) {
		dispatch(saveCommentReplyDone());
		console.error(e);
		return false;
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const deleteCommentReply = (eventId, commentId, replyId) => async () => {
	try {
		const commentReplyDeleted = await axios.delete(
			`/admin-ng/event/${eventId}/comment/${commentId}/${replyId}`
		);
		await commentReplyDeleted.data;

		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
};

// thunks for scheduling

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchSchedulingInfo = (eventId) => async (dispatch, getState) => {
	try {
		dispatch(loadEventSchedulingInProgress());

		// get data from API about event scheduling
		const schedulingRequest = await axios.get(
			`/admin-ng/event/${eventId}/scheduling.json`
		);
		const schedulingResponse = await schedulingRequest.data;

		// get data from API about capture agents
		await dispatch(fetchRecordings("inputs"));

		const state = getState();
		const captureAgents = getRecordings(state);

		const startDate = new Date(schedulingResponse.start);
		const endDate = new Date(schedulingResponse.end);
		const { durationHours, durationMinutes } = calculateDuration(
			startDate,
			endDate
		);

		let device: {
			id: string,
			name: string,
			inputs: string[],
			inputMethods: string[],
		} = {
			id: "",
			name: "",
			inputs: [],
			inputMethods: [],
		};

		const agent = captureAgents.find(
			(agent) => agent.id === schedulingResponse.agentId
		);
		if (!!agent) {
			let inputMethods = [];

			if (
				schedulingResponse.agentConfiguration["capture.device.names"] !==
				undefined
			) {
				const inputs = schedulingResponse.agentConfiguration[
					"capture.device.names"
				].split(",");
				for (const input of inputs) {
					inputMethods.push(input);
				}
			}
			device = {
				...agent,
				inputMethods: inputMethods,
			};
		}

		const source = {
			...schedulingResponse,
			start: {
				date: startDate,
				hour: startDate.getHours(),
				minute: startDate.getMinutes(),
			},
			end: {
				date: endDate,
				hour: endDate.getHours(),
				minute: endDate.getMinutes(),
			},
			duration: {
				hour: durationHours,
				minute: durationMinutes,
			},
			presenters: schedulingResponse.presenters.join(", "),
			device: { ...device },
		};

		dispatch(loadEventSchedulingSuccess(source));
	} catch (e) {
		console.error(e);
		dispatch(loadEventSchedulingFailure());
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const checkConflicts = (eventId, startDate, endDate, deviceId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	dispatch(checkConflictsInProgress());

// @ts-expect-error TS(7034): Variable 'conflicts' implicitly has type 'any[]' i... Remove this comment to see the full error message
	const conflicts = [];

	const now = new Date();
	if (endDate < now) {
		dispatch(removeNotificationWizardForm());
		dispatch(
			addNotification(
				"error",
				"CONFLICT_IN_THE_PAST",
				-1,
				null,
				NOTIFICATION_CONTEXT
			)
		);
// @ts-expect-error TS(7005): Variable 'conflicts' implicitly has an 'any[]' typ... Remove this comment to see the full error message
		dispatch(checkConflictsSuccess(conflicts));
		return false;
	} else {
		dispatch(removeNotificationWizardForm());
		let headers = getHttpHeaders();

		const conflictTimeFrame = {
			id: eventId,
			start: startDate.toISOString(),
			duration: endDate - startDate,
			device: deviceId,
			end: endDate.toISOString(),
		};

		let data = new URLSearchParams();
		data.append("metadata", JSON.stringify(conflictTimeFrame));

		return await axios
			.post(`/admin-ng/event/new/conflicts`, data, headers)
			.then((response) => {
				const responseStatus = response.status;
				if (responseStatus === 409) {
					//conflict detected, add notification and get conflict specifics
					dispatch(
						addNotification(
							"error",
							"CONFLICT_DETECTED",
							-1,
							null,
							NOTIFICATION_CONTEXT
						)
					);
					const conflictsResponse = response.data;

					for (const conflict of conflictsResponse) {
						conflicts.push({
							title: conflict.title,
							start: conflict.start,
							end: conflict.end,
						});
					}

// @ts-expect-error TS(7005): Variable 'conflicts' implicitly has an 'any[]' typ... Remove this comment to see the full error message
					dispatch(checkConflictsSuccess(conflicts));
					return false;
				} else if (responseStatus === 204) {
					//no conflicts detected
// @ts-expect-error TS(7005): Variable 'conflicts' implicitly has an 'any[]' typ... Remove this comment to see the full error message
					dispatch(checkConflictsSuccess(conflicts));
					return true;
				} else {
// @ts-expect-error TS(7005): Variable 'conflicts' implicitly has an 'any[]' typ... Remove this comment to see the full error message
					dispatch(checkConflictsSuccess(conflicts));
					return false;
				}
			})
			.catch((error) => {
				const responseStatus = error.response.status;
				if (responseStatus === 409) {
					//conflict detected, add notification and get conflict specifics
					dispatch(
						addNotification(
							"error",
							"CONFLICT_DETECTED",
							-1,
							null,
							NOTIFICATION_CONTEXT
						)
					);
					const conflictsResponse = error.response.data;

					for (const conflict of conflictsResponse) {
						conflicts.push({
							title: conflict.title,
							start: conflict.start,
							end: conflict.end,
						});
					}

// @ts-expect-error TS(7005): Variable 'conflicts' implicitly has an 'any[]' typ... Remove this comment to see the full error message
					dispatch(checkConflictsSuccess(conflicts));
					return false;
				} else {
					console.error(error);
					dispatch(checkConflictsFailure());
					return false;
				}
			});
	}
};

export const saveSchedulingInfo = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	values,
// @ts-expect-error TS(7006): Parameter 'startDate' implicitly has an 'any' type... Remove this comment to see the full error message
	startDate,
// @ts-expect-error TS(7006): Parameter 'endDate' implicitly has an 'any' type.
	endDate
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch, getState) => {
	dispatch(saveEventSchedulingInProgress());

	const state = getState();
	const oldSource = getSchedulingSource(state);
	const captureAgents = getRecordings(state);
	let device = {};

	const agent = captureAgents.find((agent) => agent.id === values.captureAgent);
	if (!!agent) {
		device = {
			...agent,
			inputMethods: values.inputs,
		};
	}

	const source = {
		...oldSource,
// @ts-expect-error TS(2339): Property 'id' does not exist on type '{}'.
		agentId: device.id,
		start: {
			date: startDate,
			hour: parseInt(values.scheduleStartHour),
			minute: parseInt(values.scheduleStartMinute),
		},
		end: {
			date: endDate,
			hour: parseInt(values.scheduleEndHour),
			minute: parseInt(values.scheduleEndMinute),
		},
		duration: {
			hour: parseInt(values.scheduleDurationHours),
			minute: parseInt(values.scheduleDurationMinutes),
		},
		device: { ...device },
		agentConfiguration: {
			...oldSource.agentConfiguration,
			"capture.device.names": values.inputs.join(","),
// @ts-expect-error TS(2339): Property 'id' does not exist on type '{}'.
			"event.location": device.id,
		},
	};

	const start = startDate.toISOString();
	const end = endDate.toISOString();

	const headers = getHttpHeaders();
	let data = new URLSearchParams();
	data.append(
		"scheduling",
		JSON.stringify({
			agentId: source.agentId,
			start: start,
			end: end,
			agentConfiguration: source.agentConfiguration,
		})
	);

	// save new scheduling information
	await axios
		.put(`/admin-ng/event/${eventId}/scheduling`, data, headers)
		.then((response) => {
			dispatch(removeNotificationWizardForm());
			dispatch(saveEventSchedulingSuccess(source));
			dispatch(fetchSchedulingInfo(eventId));
		})
		.catch((response) => {
			console.error(response);
			dispatch(
				addNotification(
					"error",
					"EVENTS_NOT_UPDATED",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
			dispatch(saveEventSchedulingFailure());
		});
};

// thunks for workflows

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchWorkflows = (eventId) => async (dispatch, getState) => {
	try {
		dispatch(loadEventWorkflowsInProgress());

		// todo: show notification if there are active transactions
		// dispatch(addNotification('warning', 'ACTIVE_TRANSACTION', -1, null, NOTIFICATION_CONTEXT));

		const data = await axios.get(`/admin-ng/event/${eventId}/workflows.json`);
		const workflowsData = await data.data;

		if (!!workflowsData.results) {
			const workflows = {
				entries: workflowsData.results,
				scheduling: false,
				workflow: {
					id: "",
					description: "",
				},
			};

			dispatch(loadEventWorkflowsSuccess(workflows));
		} else {
			const workflows = {
				workflow: workflowsData,
				scheduling: true,
				entries: [],
			};

			await dispatch(fetchWorkflowDef("event-details"));

			const state = getState();

			const workflowDefinitions = getWorkflowDef(state);

			dispatch(setEventWorkflowDefinitions(workflows, workflowDefinitions));
// @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
			dispatch(changeWorkflow(false));

			dispatch(loadEventWorkflowsSuccess(workflows));
		}
	} catch (e) {
		dispatch(loadEventWorkflowsFailure());
		console.error(e);
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchWorkflowDetails = (eventId, workflowId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	try {
		dispatch(loadEventWorkflowDetailsInProgress());

		const data = await axios.get(
			`/admin-ng/event/${eventId}/workflows/${workflowId}.json`
		);
		const workflowData = await data.data;
		dispatch(loadEventWorkflowDetailsSuccess(workflowData));
	} catch (e) {
		dispatch(loadEventWorkflowDetailsFailure());
		// todo: probably needs a Notification to the user
		console.error(e);
	}
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const changeWorkflow = () => async (dispatch, getState) => {
	const state = getState();
	const workflow = getWorkflow(state);

	if (!!workflow.workflowId) {
		dispatch(setEventWorkflowConfiguration(workflow));
	} else {
		dispatch(setEventWorkflowConfiguration(getBaseWorkflow(state)));
	}
};

// @ts-expect-error TS(7006): Parameter 'workflowId' implicitly has an 'any' typ... Remove this comment to see the full error message
export const updateWorkflow = (workflowId) => async (dispatch, getState) => {
	const state = getState();
	const workflowDefinitions = getWorkflowDefinitions(state);
// @ts-expect-error TS(7006): Parameter 'def' implicitly has an 'any' type.
	const workflowDef = workflowDefinitions.find((def) => def.id === workflowId);
	await dispatch(
		setEventWorkflow({
			workflowId: workflowId,
			description: workflowDef.description,
			configuration: workflowDef.configuration,
		})
	);
	dispatch(changeWorkflow());
};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
export const saveWorkflowConfig = (values, eventId) => async (dispatch) => {
	let jsonData = {
		id: values.workflowDefinition,
		configuration: values.configuration,
	};

	let header = getHttpHeaders();
	let data = new URLSearchParams();
	data.append("configuration", JSON.stringify(jsonData));

	axios
		.put(`/admin-ng/event/${eventId}/workflows`, data, header)
		.then((response) => {
			console.info(response);
			dispatch(removeNotificationWizardForm());
			dispatch(fetchWorkflows(eventId));
		})
		.catch((response) => {
			console.error(response);
			dispatch(
				addNotification(
					"error",
					"EVENTS_NOT_UPDATED",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
		});
};

export const performWorkflowAction = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'workflowId' implicitly has an 'any' typ... Remove this comment to see the full error message
	workflowId,
// @ts-expect-error TS(7006): Parameter 'action' implicitly has an 'any' type.
	action,
// @ts-expect-error TS(7006): Parameter 'close' implicitly has an 'any' type.
	close
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch) => {
	dispatch(doEventWorkflowActionInProgress());

	let headers = {
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
	};

	let data = {
		action: action,
		id: eventId,
		wfId: workflowId,
	};

	axios
		.put(
			`/admin-ng/event/${eventId}/workflows/${workflowId}/action/${action}`,
			data,
			headers
		)
		.then((response) => {
			dispatch(
				addNotification(
					"success",
					"EVENTS_PROCESSING_ACTION_" + action,
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
			close();
			dispatch(doEventWorkflowActionSuccess());
		})
		.catch((response) => {
			dispatch(
				addNotification(
					"error",
					"EVENTS_PROCESSING_ACTION_NOT_" + action,
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
			dispatch(doEventWorkflowActionFailure());
		});
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const deleteWorkflow = (eventId, workflowId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch,
// @ts-expect-error TS(7006): Parameter 'getState' implicitly has an 'any' type.
	getState
) => {
	dispatch(deleteEventWorkflowInProgress());

	axios
		.delete(`/admin-ng/event/${eventId}/workflows/${workflowId}`)
		.then((response) => {
			dispatch(
				addNotification(
					"success",
					"EVENTS_PROCESSING_DELETE_WORKFLOW",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);

			const state = getState();
			const workflows = getWorkflows(state);

			if (!!workflows.entries) {
				dispatch(
					deleteEventWorkflowSuccess(
// @ts-expect-error TS(7006): Parameter 'wf' implicitly has an 'any' type.
						workflows.entries.filter((wf) => wf.id !== workflowId)
					)
				);
			} else {
				dispatch(deleteEventWorkflowSuccess(workflows.entries));
			}
		})
		.catch((response) => {
			dispatch(
				addNotification(
					"error",
					"EVENTS_PROCESSING_DELETE_WORKFLOW_FAILED",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
			dispatch(deleteEventWorkflowFailure());
		});
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchWorkflowOperations = (eventId, workflowId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	try {
		dispatch(loadEventWorkflowOperationsInProgress());

		const data = await axios.get(
			`/admin-ng/event/${eventId}/workflows/${workflowId}/operations.json`
		);
		const workflowOperationsData = await data.data;
		const workflowOperations = { entries: workflowOperationsData };
		dispatch(loadEventWorkflowOperationsSuccess(workflowOperations));
	} catch (e) {
		dispatch(loadEventWorkflowOperationsFailure());
		// todo: probably needs a Notification to the user
		console.error(e);
	}
};

export const fetchWorkflowOperationDetails = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'workflowId' implicitly has an 'any' typ... Remove this comment to see the full error message
	workflowId,
// @ts-expect-error TS(7006): Parameter 'operationId' implicitly has an 'any' ty... Remove this comment to see the full error message
	operationId
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch) => {
	try {
		dispatch(loadEventWorkflowOperationDetailsInProgress());

		const data = await axios.get(
			`/admin-ng/event/${eventId}/workflows/${workflowId}/operations/${operationId}`
		);
		const workflowOperationDetails = await data.data;
		dispatch(
			loadEventWorkflowOperationDetailsSuccess(workflowOperationDetails)
		);
	} catch (e) {
		dispatch(loadEventWorkflowOperationDetailsFailure());
		// todo: probably needs a Notification to the user
		console.error(e);
	}
};

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchWorkflowErrors = (eventId, workflowId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	try {
		dispatch(loadEventWorkflowErrorsInProgress());

		const data = await axios.get(
			`/admin-ng/event/${eventId}/workflows/${workflowId}/errors.json`
		);
		const workflowErrorsData = await data.data;
		const workflowErrors = { entries: workflowErrorsData };
		dispatch(loadEventWorkflowErrorsSuccess(workflowErrors));
	} catch (e) {
		dispatch(loadEventWorkflowErrorsFailure());
		// todo: probably needs a Notification to the user
		console.error(e);
	}
};

export const fetchWorkflowErrorDetails = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'workflowId' implicitly has an 'any' typ... Remove this comment to see the full error message
	workflowId,
// @ts-expect-error TS(7006): Parameter 'errorId' implicitly has an 'any' type.
	errorId
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch) => {
	try {
		dispatch(loadEventWorkflowErrorDetailsInProgress());

		const data = await axios.get(
			`/admin-ng/event/${eventId}/workflows/${workflowId}/errors/${errorId}.json`
		);
		const workflowErrorDetails = await data.data;
		dispatch(loadEventWorkflowErrorDetailsSuccess(workflowErrorDetails));
	} catch (e) {
		dispatch(loadEventWorkflowErrorDetailsFailure());
		// todo: probably needs a Notification to the user
		console.error(e);
	}
};

// thunks for publications

// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchEventPublications = (eventId) => async (dispatch) => {
	try {
		dispatch(loadEventPublicationsInProgress());

		let data = await axios.get(`/admin-ng/event/${eventId}/publications.json`);

		let publications = await data.data;

		// get information about possible publication channels
		data = await axios.get("/admin-ng/resources/PUBLICATION.CHANNELS.json");

		let publicationChannels = await data.data;

		let now = new Date();

		// fill publication objects with additional information
// @ts-expect-error TS(7006): Parameter 'publication' implicitly has an 'any' ty... Remove this comment to see the full error message
		publications.publications.forEach((publication) => {
			publication.enabled = !(
				publication.id === "engage-live" &&
				(now < new Date(publications["start-date"]) ||
					now > new Date(publications["end-date"]))
			);

			if (publicationChannels[publication.id]) {
				let channel = JSON.parse(publicationChannels[publication.id]);

				if (channel.label) {
					publication.label = channel.label;
				}
				if (channel.icon) {
					publication.icon = channel.icon;
				}
				if (channel.hide) {
					publication.hide = channel.hide;
				}
				if (channel.description) {
					publication.description = channel.description;
				}
				if (channel.order) {
					publication.order = channel.order;
				}
			}
		});

		dispatch(loadEventPublicationsSuccess(publications.publications));
	} catch (e) {
		dispatch(loadEventPublicationsFailure());
		console.error(e);
	}
};

// thunks for statistics

// TODO: BROKEN! FIX THIS WHEN MODERNIZING REDUX TOOLKIT FOR EVENTS
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
export const fetchEventStatistics = (eventId) => async (dispatch) => {
	// dispatch(
	// 	fetchStatistics(
	// 		eventId,
	// 		"episode",
	// 		getStatistics,
	// 		loadEventStatisticsInProgress,
	// 		loadEventStatisticsSuccess,
	// 		loadEventStatisticsFailure
	// 	)
	// );
};

// TODO: BROKEN! FIX THIS WHEN MODERNIZING REDUX TOOLKIT FOR EVENTS
export const fetchEventStatisticsValueUpdate = (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	eventId,
// @ts-expect-error TS(7006): Parameter 'providerId' implicitly has an 'any' typ... Remove this comment to see the full error message
	providerId,
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
	from,
// @ts-expect-error TS(7006): Parameter 'to' implicitly has an 'any' type.
	to,
// @ts-expect-error TS(7006): Parameter 'dataResolution' implicitly has an 'any'... Remove this comment to see the full error message
	dataResolution,
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
	timeMode
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch) => {
	// dispatch(
	// 	fetchStatisticsValueUpdate(
	// 		eventId,
	// 		"episode",
	// 		providerId,
	// 		from,
	// 		to,
	// 		dataResolution,
	// 		timeMode,
	// 		getStatistics,
	// 		updateEventStatisticsSuccess,
	// 		updateEventStatisticsFailure
	// 	)
	// );
};
