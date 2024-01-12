import { PayloadAction, SerializedError, createAsyncThunk, createSlice, unwrapResult } from '@reduxjs/toolkit'
import axios from 'axios';
import { removeNotificationWizardForm } from "../actions/notificationActions";
import { addNotification } from "../thunks/notificationThunks";
import {
	createPolicy,
	getHttpHeaders,
	transformMetadataCollection,
	transformMetadataForUpdate,
} from "../utils/resourceUtils";
import { NOTIFICATION_CONTEXT } from "../configs/modalConfig";
import { fetchWorkflowDef } from "../thunks/workflowThunks";
import {
	getMetadata,
	getExtendedMetadata,
	getSchedulingSource,
	getWorkflowDefinitions,
	getWorkflows,
} from "../selectors/eventDetailsSelectors";
import { getWorkflowDef } from "../selectors/workflowSelectors";
import {
	getAssetUploadOptions,
	getAssetUploadWorkflow,
} from "../selectors/eventSelectors";
import { calculateDuration } from "../utils/dateUtils";
import { fetchRecordings } from "../thunks/recordingThunks";
import { getRecordings } from "../selectors/recordingSelectors";
import { RootState } from '../store';
type AssetDetails = {
	id: string,
	type: string,
	mimetype: string,
	size: any,	// TODO: proper typing
	tags: any[],	// TODO: proper typing
	url: string
}

type EventDetailsState = {
	statusMetadata: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorMetadata: SerializedError | null,
	statusAssets: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorAssets: SerializedError | null,
	statusAssetAttachments: 'uninitialized' | 'loading' | 'succeeded' | 'failed',	// These were previously all just statusAssets
	errorAssetAttachments: SerializedError | null,
	statusAssetAttachmentDetails: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorAssetAttachmentDetails: SerializedError | null,
	statusAssetCatalogs: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorAssetCatalogs: SerializedError | null,
	statusAssetCatalogDetails: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorAssetCatalogDetails: SerializedError | null,
	statusAssetMedia: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorAssetMedia: SerializedError | null,
	statusAssetMediaDetails: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorAssetMediaDetails: SerializedError | null,
	statusAssetPublications: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorAssetPublications: SerializedError | null,
	statusAssetPublicationDetails: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorAssetPublicationDetails: SerializedError | null,
	statusPolicies: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorPolicies: SerializedError | null,
	statusComments: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorComments: SerializedError | null,
	statusPublications: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorPublications: SerializedError | null,
	statusSaveComment: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorSaveComment: SerializedError | null,
	statusSaveCommentReply: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorSaveCommentReply: SerializedError | null,
	statusScheduling: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorScheduling: SerializedError | null,
	statusSaveScheduling: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorSaveScheduling: SerializedError | null,
	statusCheckConflicts: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorCheckConflicts: SerializedError | null,
	statusWorkflows: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorWorkflows: SerializedError | null,
	statusWorkflowDetails: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorWorkflowDetails: SerializedError | null,
	statusDoWorkflowAction: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorDoWorkflowAction: SerializedError | null,
	statusDeleteWorkflow: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorDeleteWorkflow: SerializedError | null,
	statusWorkflowOperations: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorWorkflowOperations: SerializedError | null,
	statusWorkflowOperationDetails: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorWorkflowOperationDetails: SerializedError | null,
	statusWorkflowErrors: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorWorkflowErrors: SerializedError | null,
	statusWorkflowErrorDetails: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorWorkflowErrorDetails: SerializedError | null,
	statusStatistics: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorStatistics: SerializedError | null,
	eventId: string,
	metadata: any,	// TODO: proper typing
	extendedMetadata: any[],	// TODO: proper typing
	assets: {
		attachments: any,	// TODO: proper typing
		catalogs: any,	// TODO: proper typing
		media: any,	// TODO: proper typing
		publications: any,	// TODO: proper typing
	},
	transactionsReadOnly: boolean,
	uploadAssetOptions: any[],	// TODO: proper typing
	assetAttachments: any[],	// TODO: proper typing
	assetAttachmentDetails: AssetDetails & {
		checksum: any,	// TODO: proper typing
		reference: string,
	},
	assetCatalogs: any[],	// TODO: proper typing
	assetCatalogDetails: AssetDetails & {
		checksum: any,	// TODO: proper typing
		reference: string,
	},
	assetMedia: any[],	// TODO: proper typing
	assetMediaDetails: AssetDetails & {
		duration: any,	// TODO: proper typing
		streams: {
			audio: any[],	// TODO: proper typing
			video: any[],	// TODO: proper typing
		},
		video: string,
	},
	assetPublications: any[],	// TODO: proper typing
	assetPublicationDetails: AssetDetails & {
		channel: string,
		reference: string,
	},
	policies: any[],	// TODO: proper typing
	comments: any[],	// TODO: proper typing
	commentReasons: any[],	// TODO: proper typing
	scheduling: {
		hasProperties: boolean,
	},
	schedulingSource: {
		start: {
			date: string,
			hour: any,		// TODO: proper typing
			minute: any,		// TODO: proper typing
		},
		duration: {
			hour: any,	// TODO: proper typing
			minute: any,	// TODO: proper typing
		},
		end: {
			date: string,
			hour: any,	// TODO: proper typing
			minute: any,	// TODO: proper typing
		},
		device: {
			id: string,
			name: string,
			inputs: any[],	// TODO: proper typing
			inputMethods: any[],	// TODO: proper typing
		},
		agentId: any,	// TODO: proper typing
		agentConfiguration: any,	// TODO: proper typing
	},
	hasSchedulingConflicts: boolean,
	schedulingConflicts: any[],	// TODO: proper typing
	workflows: {
		scheduling: boolean,
		entries: any[],	// TODO: proper typing
		workflow: any | {
			workflowId: string,
			description: string,
		},
	},
	workflowConfiguration: {
		workflowId: string,
		description: string,
	},
	workflowDefinitions: any[],	// TODO: proper typing
	baseWorkflow: any,	// TODO: proper typing
	workflowOperations: any,	// TODO: proper typing
	workflowOperationDetails: any,	// TODO: proper typing
	workflowErrors: any,	// TODO: proper typing
	workflowErrorDetails: any,	// TODO: proper typing
	publications: any[],	// TODO: proper typing
	statistics: any[],	// TODO: proper typing
	hasStatisticsError: boolean,
}

// Initial state of event details in redux store
const initialState: EventDetailsState = {
	statusMetadata: 'uninitialized',
	errorMetadata: null,
	statusAssets: 'uninitialized',
	errorAssets: null,
	statusAssetAttachments: 'uninitialized',
	errorAssetAttachments: null,
	statusAssetAttachmentDetails: 'uninitialized',
	errorAssetAttachmentDetails: null,
	statusAssetCatalogs: 'uninitialized',
	errorAssetCatalogs: null,
	statusAssetCatalogDetails: 'uninitialized',
	errorAssetCatalogDetails: null,
	statusAssetMedia: 'uninitialized',
	errorAssetMedia: null,
	statusAssetMediaDetails: 'uninitialized',
	errorAssetMediaDetails: null,
	statusAssetPublications: 'uninitialized',
	errorAssetPublications: null,
	statusAssetPublicationDetails: 'uninitialized',
	errorAssetPublicationDetails: null,
	statusPolicies: 'uninitialized',
	errorPolicies: null,
	statusComments: 'uninitialized',
	errorComments: null,
	statusPublications: 'uninitialized',
	errorPublications: null,
	statusSaveComment: 'uninitialized',
	errorSaveComment: null,
	statusSaveCommentReply: 'uninitialized',
	errorSaveCommentReply: null,
	statusScheduling: 'uninitialized',
	errorScheduling: null,
	statusSaveScheduling: 'uninitialized',
	errorSaveScheduling: null,
	statusCheckConflicts: 'uninitialized',
	errorCheckConflicts: null,
	statusWorkflows: 'uninitialized',
	errorWorkflows: null,
	statusWorkflowDetails: 'uninitialized',
	errorWorkflowDetails: null,
	statusDoWorkflowAction: 'uninitialized',
	errorDoWorkflowAction: null,
	statusDeleteWorkflow: 'uninitialized',
	errorDeleteWorkflow: null,
	statusWorkflowOperations: 'uninitialized',
	errorWorkflowOperations: null,
	statusWorkflowOperationDetails: 'uninitialized',
	errorWorkflowOperationDetails: null,
	statusWorkflowErrors: 'uninitialized',
	errorWorkflowErrors: null,
	statusWorkflowErrorDetails: 'uninitialized',
	errorWorkflowErrorDetails: null,
	statusStatistics: 'uninitialized',
	errorStatistics: null,
	eventId: "",
	metadata: {},
	extendedMetadata: [],
	assets: {
		attachments: null,
		catalogs: null,
		media: null,
		publications: null,
	},
	transactionsReadOnly: false,
	uploadAssetOptions: [],
	assetAttachments: [],
	assetAttachmentDetails: {
		id: "",
		type: "",
		mimetype: "",
		size: null,
		checksum: null,
		reference: "",
		tags: [],
		url: "",
	},
	assetCatalogs: [],
	assetCatalogDetails: {
		id: "",
		type: "",
		mimetype: "",
		size: null,
		checksum: null,
		reference: "",
		tags: [],
		url: "",
	},
	assetMedia: [],
	assetMediaDetails: {
		id: "",
		type: "",
		mimetype: "",
		tags: [],
		duration: null,
		size: null,
		url: "",
		streams: {
			audio: [],
			video: [],
		},
		video: "",
	},
	assetPublications: [],
	assetPublicationDetails: {
		id: "",
		type: "",
		mimetype: "",
		size: null,
		channel: "",
		reference: "",
		tags: [],
		url: "",
	},
	policies: [],
	comments: [],
	commentReasons: [],
	scheduling: {
		hasProperties: false,
	},
	schedulingSource: {
		start: {
			date: "",
			hour: null,
			minute: null,
		},
		duration: {
			hour: null,
			minute: null,
		},
		end: {
			date: "",
			hour: null,
			minute: null,
		},
		device: {
			id: "",
			name: "",
			inputs: [],
			inputMethods: [],
		},
		agentId: undefined,
		agentConfiguration: {},
	},
	hasSchedulingConflicts: false,
	schedulingConflicts: [],
	workflows: {
		scheduling: false,
		entries: [],
		workflow: {
			workflowId: "",
			description: "",
		},
	},
	workflowConfiguration: {
		workflowId: "",
		description: "",
	},
	workflowDefinitions: [],
	baseWorkflow: {},
	workflowOperations: {},
	workflowOperationDetails: {},
	workflowErrors: {},
	workflowErrorDetails: {},
	publications: [],
	statistics: [],
	hasStatisticsError: false,
};


export const fetchMetadata = createAsyncThunk('eventDetails/fetchMetadata', async (eventId: any) => {
	const metadataRequest = await axios.get(`/admin-ng/event/${eventId}/metadata.json`);
	const metadataResponse = await metadataRequest.data;

	const mainCatalog = "dublincore/episode";
	let metadata = {};
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
			metadata = transformMetadataCollection({ ...transformedCatalog });
		} else {
			extendedMetadata.push(
// @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
				transformMetadataCollection({ ...transformedCatalog })
			);
		}
	}

	return { metadata, extendedMetadata }
});

export const fetchAssets = createAsyncThunk('eventDetails/fetchAssets', async (eventId: any, { dispatch }) => {
	const assetsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/assets.json`
	);
	const assets = await assetsRequest.data;

	let transactionsReadOnly = true;
	const fetchTransactionResult = await dispatch(fetchHasActiveTransactions(eventId))
		.then(unwrapResult);
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

	return { assets, transactionsReadOnly, uploadAssetOptions }
});

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

export const fetchAssetAttachments = createAsyncThunk('eventDetails/fetchAssetAttachments', async (eventId: any) => {
	let params = new URLSearchParams();
	params.append("id1", "attachment");

	const attachmentsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/attachment/attachments.json`,
		{ params }
	);
	return await attachmentsRequest.data;
});

export const fetchAssetAttachmentDetails = createAsyncThunk('eventDetails/fetchAssetAttachmentDetails', async (params: {eventId: any, attachmentId: any}) => {
	const { eventId, attachmentId } = params;
	let searchParams = new URLSearchParams();
	searchParams.append("id1", "attachment");

	const attachmentDetailsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/attachment/${attachmentId}.json`,
		{ params }
	);
	return await attachmentDetailsRequest.data;
});

export const fetchAssetCatalogs = createAsyncThunk('eventDetails/fetchAssetCatalogs', async (eventId: any) => {
	let params = new URLSearchParams();
	params.append("id1", "catalog");

	const catalogsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/catalog/catalogs.json`,
		{ params }
	);
	return await catalogsRequest.data;
});

export const fetchAssetCatalogDetails = createAsyncThunk('eventDetails/fetchAssetCatalogDetails', async (params: {eventId: any, catalogId: any}) => {
	const { eventId, catalogId } = params;
	let searchParams = new URLSearchParams();
	searchParams.append("id1", "catalog");

	const catalogDetailsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/catalog/${catalogId}.json`,
		{ params }
	);
	return await catalogDetailsRequest.data;
});

export const fetchAssetMedia = createAsyncThunk('eventDetails/fetchAssetMedia', async (eventId: any) => {
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

	return media;
});

export const fetchAssetMediaDetails = createAsyncThunk('eventDetails/fetchAssetMediaDetails', async (params: {eventId: any, mediaId: any}) => {
	const { eventId, mediaId } = params;
	let searchParams = new URLSearchParams();
	searchParams.append("id1", "media");

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

	return mediaDetails;
});

export const fetchAssetPublications = createAsyncThunk('eventDetails/fetchAssetPublications', async (eventId: any) => {
	let params = new URLSearchParams();
	params.append("id1", "publication");

	const publicationsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/publication/publications.json`,
		{ params }
	);
	return await publicationsRequest.data;
});

export const fetchAssetPublicationDetails = createAsyncThunk('eventDetails/fetchAssetPublicationDetails', async (params: {eventId: any, publicationId: any}) => {
	const { eventId, publicationId } = params;
	let searchParams = new URLSearchParams();
	searchParams.append("id1", "publication");

	const publicationDetailsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/publication/${publicationId}.json`,
		{ params }
	);
	return await publicationDetailsRequest.data;
});

export const fetchAccessPolicies = createAsyncThunk('eventDetails/fetchAccessPolicies', async (eventId: any) => {
	const policyData = await axios.get(
		`/admin-ng/event/${eventId}/access.json`
	);
	let accessPolicies = await policyData.data;

	let policies: any[] = [];
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

	return policies;
});

export const fetchComments = createAsyncThunk('eventDetails/fetchComments', async (eventId: any) => {
	const commentsData = await axios.get(`/admin-ng/event/${eventId}/comments`);
	const comments = await commentsData.data;

	const commentReasonsData = await axios.get(
		`/admin-ng/resources/components.json`
	);
	const commentReasons = (await commentReasonsData.data).eventCommentReasons;

	return { comments, commentReasons }
});

export const fetchEventPublications = createAsyncThunk('eventDetails/fetchEventPublications', async (eventId: any, { dispatch }) => {
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

	return publications.publications;
});

export const saveComment = createAsyncThunk('eventDetails/saveComment', async (params: {eventId: any, commentText: any, commentReason: any}, { dispatch }) => {
	const { eventId, commentText, commentReason } = params;
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

	return true;
});

export const saveCommentReply = createAsyncThunk('eventDetails/saveCommentReply', async (params: {eventId: any, commentId: any, replyText: any, commentResolved: any}) => {
	const { eventId, commentId, replyText, commentResolved } = params;
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

	return true;
});

export const fetchSchedulingInfo = createAsyncThunk('eventDetails/fetchSchedulingInfo', async (eventId: any, { dispatch, getState }) => {
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

		let device = {
			id: "",
			name: "",
			inputs: [],
		};

		const agent = captureAgents.find(
// @ts-expect-error TS(7006): Parameter 'agent' implicitly has an 'any' type.
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
				date: schedulingResponse.start,
				hour: startDate.getHours(),
				minute: startDate.getMinutes(),
			},
			end: {
				date: schedulingResponse.end,
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

		return source;
});

export const saveSchedulingInfo = createAsyncThunk('eventDetails/saveSchedulingInfo', async (params: {eventId: any, values: any, startDate: any, endDate: any}, { dispatch, getState }) => {
	const { eventId, values, startDate, endDate } = params;

	const state = getState() as RootState;
	const oldSource = getSchedulingSource(state as RootState);
	const captureAgents = getRecordings(state);
	let device = {
		id: "",
		name: "",
		inputs: [],
		inputMethods: [],
	};

// @ts-expect-error TS(7006): Parameter 'agent' implicitly has an 'any' type.
	const agent = captureAgents.find((agent) => agent.id === values.captureAgent);
	if (!!agent) {
		device = {
			...agent,
			inputMethods: values.inputs,
		};
	}

	const source = {
		...oldSource,
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
			dispatch(fetchSchedulingInfo(eventId));
		})
		.catch((response) => {
			dispatch(
				addNotification(
					"error",
					"EVENTS_NOT_UPDATED",
					-1,
					null,
					NOTIFICATION_CONTEXT
				)
			);
			throw (response);
		});

	return source;
});

// TODO: This does not return a boolean anymore. Fix this in usage, make users
// get their info from the state
export const checkConflicts = createAsyncThunk('eventDetails/checkConflicts', async (params: {eventId: any, startDate: any, endDate: any, deviceId: any}, { dispatch }) => {
const { eventId, startDate, endDate, deviceId } = params;
const conflicts: any[] = [];
let hasSchedulingConflicts = false;

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
	hasSchedulingConflicts = true;
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

	await axios
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

				hasSchedulingConflicts = true;
			} else if (responseStatus === 204) {
				//no conflicts detected
				hasSchedulingConflicts = false;
			} else {
				hasSchedulingConflicts = true;
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

				hasSchedulingConflicts = true;
			} else {
				hasSchedulingConflicts = true;
			}
		});
	}

	return { conflicts, hasSchedulingConflicts };
});

export const fetchWorkflows = createAsyncThunk('eventDetails/fetchWorkflows', async (eventId: any, { dispatch, getState }) => {
	// todo: show notification if there are active transactions
	// dispatch(addNotification('warning', 'ACTIVE_TRANSACTION', -1, null, NOTIFICATION_CONTEXT));

	const data = await axios.get(`/admin-ng/event/${eventId}/workflows.json`);
	const workflowsData = await data.data;
	let workflows;

	if (!!workflowsData.results) {
		workflows = {
			entries: workflowsData.results,
			scheduling: false,
			workflow: {
				id: "",
				description: "",
			},
		};

	} else {
		workflows = {
			workflow: workflowsData,
			scheduling: true,
			entries: [],
		};

		await dispatch(fetchWorkflowDef("event-details"));

		const state = getState();

		const workflowDefinitions = getWorkflowDef(state);

		dispatch(setEventWorkflowDefinitions({workflows, workflowDefinitions}));
	}

	return workflows;
});

export const fetchWorkflowDetails = createAsyncThunk('eventDetails/fetchWorkflowDetails', async (params: {eventId: any, workflowId: any}, { getState }) => {
	const { eventId, workflowId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}.json`
	);
	return await data.data;
});

export const performWorkflowAction = createAsyncThunk('eventDetails/performWorkflowAction', async (params: {eventId: any, workflowId: any, action: any, close: any}, { dispatch }) => {
	const { eventId, workflowId, action, close} = params;
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

	await axios
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
			throw (response)
		});
});

export const deleteWorkflow = createAsyncThunk('eventDetails/deleteWorkflow', async (params: {eventId: any, workflowId: any}, { dispatch, getState }) => {
	const { eventId, workflowId } = params;

	const workflowEntries = await axios
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
			const workflows = getWorkflows(state as RootState);

			if (!!workflows.entries) {
				return workflows.entries.filter((wf) => wf.id !== workflowId)
			} else {
				return workflows.entries;
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
			throw (response);
		});

	return workflowEntries;
});

export const fetchWorkflowOperations = createAsyncThunk('eventDetails/fetchWorkflowOperations', async (params: {eventId: any, workflowId: any}) => {
	const { eventId, workflowId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}/operations.json`
	);
	const workflowOperationsData = await data.data;
	return { entries: workflowOperationsData };
});

export const fetchWorkflowOperationDetails = createAsyncThunk('eventDetails/fetchWorkflowOperationDetails', async (params: {eventId: any, workflowId: any, operationId: any}) => {
	const { eventId, workflowId, operationId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}/operations/${operationId}`
	);
	return await data.data;
});

export const fetchWorkflowErrors = createAsyncThunk('eventDetails/fetchWorkflowErrors', async (params: {eventId: any, workflowId: any}) => {
	const { eventId, workflowId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}/errors.json`
	);
	const workflowErrorsData = await data.data;
	return { entries: workflowErrorsData };
});

export const fetchWorkflowErrorDetails = createAsyncThunk('eventDetails/fetchWorkflowErrorDetails', async (params: {eventId: any, workflowId: any, errorId: any}) => {
	const { eventId, workflowId, errorId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}/errors/${errorId}.json`
	);
	return await data.data;
});

// TODO: Fix this after the modernization of statisticsThunks happened
export const fetchEventStatistics = createAsyncThunk('eventDetails/fetchEventStatistics', async (eventId: any, { dispatch }) => {
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
});

// TODO: Fix this after the modernization of statisticsThunks happened
export const fetchEventStatisticsValueUpdate = createAsyncThunk('eventDetails/fetchEventStatisticsValueUpdate', async (params: {eventId: any, providerId: any, from: any, to: any, dataResolution: any, timeMode: any}, { dispatch }) => {
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
});

export const updateMetadata = createAsyncThunk('eventDetails/updateMetadata', async (params: {eventId: any, values: any}, { dispatch, getState }) => {
	const { eventId, values } = params;

	let metadataInfos = getMetadata(getState() as RootState);

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
});

export const updateExtendedMetadata = createAsyncThunk('eventDetails/updateExtendedMetadata', async (params: {eventId: any, values: any, catalog: any}, { dispatch, getState }) => {
	const { eventId, values, catalog } = params;

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

	const oldExtendedMetadata = getExtendedMetadata(getState() as RootState);
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
});

export const fetchHasActiveTransactions = createAsyncThunk('eventDetails/fetchHasActiveTransactions', async (eventId: any) => {
	const transactionsData = await axios.get(
		`/admin-ng/event/${eventId}/hasActiveTransaction`
	);
	const hasActiveTransactions = await transactionsData.data;
	return hasActiveTransactions;
});

export const updateAssets = createAsyncThunk('eventDetails/updateAssets', async (params: {values: any, eventId: any}, { dispatch, getState }) => {
	const { values, eventId } = params;
	// get asset upload options from redux store
	const state = getState();
	const uploadAssetOptions = getAssetUploadOptions(state);
	const uploadAssetWorkflow = getAssetUploadWorkflow(state);

	let formData = new FormData();

	let assets = {
		workflow: uploadAssetWorkflow,
		options: [],
	};

// @ts-expect-error TS(7006): Parameter 'option' implicitly has an 'any' type.
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
});

export const saveAccessPolicies = createAsyncThunk('eventDetails/saveAccessPolicies', async (params: {eventId: any, policies: any}, { dispatch }) => {
	const { eventId, policies } = params;
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
});

export const deleteComment = createAsyncThunk('eventDetails/deleteComment', async (params: {eventId: any, commentId: any}) => {
	const { eventId, commentId } = params;
	const commentDeleted = await axios.delete(
		`/admin-ng/event/${eventId}/comment/${commentId}`
	);
	await commentDeleted.data;
	return true;
});

export const deleteCommentReply = createAsyncThunk('eventDetails/deleteCommentReply', async (params: {eventId: any, commentId: any, replyId: any}) => {
	const { eventId, commentId, replyId } = params;
	const commentReplyDeleted = await axios.delete(
		`/admin-ng/event/${eventId}/comment/${commentId}/${replyId}`
	);
	await commentReplyDeleted.data;

	return true;
});

export const updateWorkflow = createAsyncThunk('eventDetails/updateWorkflow', async (workflowId: any, { dispatch, getState }) => {
	const state = getState();
	const workflowDefinitions = getWorkflowDefinitions(state as RootState);
	const workflowDef = workflowDefinitions.find((def) => def.id === workflowId);
	await dispatch(
		setEventWorkflow({
			workflowId: workflowId,
			description: workflowDef.description,
			configuration: workflowDef.configuration,
		})
	);
});

export const saveWorkflowConfig = createAsyncThunk('eventDetails/saveWorkflowConfig', async (params: {values: any, eventId: any}, { dispatch }) => {
	const { values, eventId } = params;
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
});

const eventDetailsSlice = createSlice({
	name: 'eventDetails',
	initialState,
	reducers: {
		setEventMetadata(state, action: PayloadAction<
			EventDetailsState["metadata"]
		>) {
			state.metadata = action.payload;
		},
		setExtendedEventMetadata(state, action: PayloadAction<
			EventDetailsState["extendedMetadata"]
		>) {
			state.extendedMetadata = action.payload;
		},
		setEventWorkflow(state, action: PayloadAction<
			EventDetailsState["workflows"]["workflow"]
		>) {
			state.workflows.workflow = action.payload;
		},
		setEventWorkflowDefinitions(state, action: PayloadAction<{
			workflows: EventDetailsState["workflows"],
			workflowDefinitions: EventDetailsState["workflowDefinitions"],
		}>) {
			state.baseWorkflow = { ...action.payload.workflows.workflow };
			state.workflows = action.payload.workflows;
			state.workflowDefinitions = action.payload.workflowDefinitions;
		},
		setEventWorkflowConfiguration(state, action: PayloadAction<{
			workflowConfiguration: EventDetailsState["workflowConfiguration"],
		}>) {
			state.workflowConfiguration = action.payload.workflowConfiguration;
		},
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			// fetchMetadata
			.addCase(fetchMetadata.pending, (state) => {
				state.statusMetadata = 'loading';
			})
			.addCase(fetchMetadata.fulfilled, (state, action: PayloadAction<{
				metadata: EventDetailsState["metadata"],
				extendedMetadata: EventDetailsState["extendedMetadata"],
			}>) => {
				state.statusMetadata = 'succeeded';
				const eventDetails = action.payload;
				state.metadata = eventDetails.metadata;
				state.extendedMetadata = eventDetails.extendedMetadata;
			})
			.addCase(fetchMetadata.rejected, (state, action) => {
				state.statusMetadata = 'failed';
				state.metadata = {};
				state.extendedMetadata = [];
				state.errorMetadata = action.error;
				console.error(action.error);
			})
			// fetchAssets
			.addCase(fetchAssets.pending, (state) => {
				state.statusAssets = 'loading';
			})
			.addCase(fetchAssets.fulfilled, (state, action: PayloadAction<{
				assets: EventDetailsState["assets"],
				transactionsReadOnly: EventDetailsState["transactionsReadOnly"],
				uploadAssetOptions: EventDetailsState["uploadAssetOptions"],
			}>) => {
				state.statusAssets = 'succeeded';
				const eventDetails = action.payload;
				state.assets = eventDetails.assets;
				state.transactionsReadOnly = eventDetails.transactionsReadOnly;
				state.uploadAssetOptions = eventDetails.uploadAssetOptions;
			})
			.addCase(fetchAssets.rejected, (state, action) => {
				state.statusAssets = 'failed';
				const emptyAssets = {
					attachments: null,
					catalogs: null,
					media: null,
					publications: null,
				};
				state.assets = emptyAssets;
				state.transactionsReadOnly = false;
				state.uploadAssetOptions = [];
				state.errorAssets = action.error;
				console.error(action.error);
			})
			// fetchAssetAttachments
			.addCase(fetchAssetAttachments.pending, (state) => {
				state.statusAssetAttachments = 'loading';
			})
			.addCase(fetchAssetAttachments.fulfilled, (state, action: PayloadAction<
				EventDetailsState["assetAttachments"]
			>) => {
				state.statusAssetAttachments = 'succeeded';
				state.assetAttachments = action.payload;
			})
			.addCase(fetchAssetAttachments.rejected, (state, action) => {
				state.statusAssetAttachments = 'failed';
				state.assetAttachments = [];
				state.errorAssetAttachments = action.error;
				console.error(action.error);
			})
			// fetchAssetAttachmentDetails
			.addCase(fetchAssetAttachmentDetails.pending, (state) => {
				state.statusAssetAttachments = 'loading';
			})
			.addCase(fetchAssetAttachmentDetails.fulfilled, (state, action: PayloadAction<
				EventDetailsState["assetAttachmentDetails"]
			>) => {
				state.statusAssetAttachments = 'succeeded';
				state.assetAttachmentDetails = action.payload;
			})
			.addCase(fetchAssetAttachmentDetails.rejected, (state, action) => {
				state.statusAssetAttachments = 'failed';
				const emptyAssetAttachmentDetails = {
					id: "",
					type: "",
					mimetype: "",
					size: null,
					checksum: null,
					reference: "",
					tags: [],
					url: "",
				};
				state.assetAttachmentDetails = emptyAssetAttachmentDetails;
				state.errorAssetAttachments = action.error;
				console.error(action.error);
			})
			// fetchAssetCatalogs
			.addCase(fetchAssetCatalogs.pending, (state) => {
				state.statusAssetCatalogs = 'loading';
			})
			.addCase(fetchAssetCatalogs.fulfilled, (state, action: PayloadAction<
				EventDetailsState["assetCatalogs"]
			>) => {
				state.statusAssetCatalogs = 'succeeded';
				state.assetCatalogs = action.payload;
			})
			.addCase(fetchAssetCatalogs.rejected, (state, action) => {
				state.statusAssetCatalogs = 'failed';
				state.assetCatalogs = [];
				state.errorAssetCatalogs = action.error;
				console.error(action.error);
			})
			// fetchAssetCatalogDetails
			.addCase(fetchAssetCatalogDetails.pending, (state) => {
				state.statusAssetCatalogDetails = 'loading';
			})
			.addCase(fetchAssetCatalogDetails.fulfilled, (state, action: PayloadAction<
				EventDetailsState["assetCatalogDetails"]
			>) => {
				state.statusAssetCatalogDetails = 'succeeded';
				state.assetCatalogDetails = action.payload;
			})
			.addCase(fetchAssetCatalogDetails.rejected, (state, action) => {
				state.statusAssetCatalogDetails = 'failed';
				const emptyAssetCatalogDetails = {
					id: "",
					type: "",
					mimetype: "",
					size: null,
					checksum: null,
					reference: "",
					tags: [],
					url: "",
				};
				state.assetCatalogDetails = emptyAssetCatalogDetails;
				state.errorAssetCatalogDetails = action.error;
				console.error(action.error);
			})
			// fetchAssetMedia
			.addCase(fetchAssetMedia.pending, (state) => {
				state.statusAssetMedia = 'loading';
			})
			.addCase(fetchAssetMedia.fulfilled, (state, action: PayloadAction<
				EventDetailsState["assetMedia"]
			>) => {
				state.statusAssetMedia = 'succeeded';
				state.assetMedia = action.payload;
			})
			.addCase(fetchAssetMedia.rejected, (state, action) => {
				state.statusAssetMedia = 'failed';
				state.assetMedia = [];
				state.errorAssetMedia = action.error;
				console.error(action.error);
			})
			// fetchAssetMediaDetails
			.addCase(fetchAssetMediaDetails.pending, (state) => {
				state.statusAssetMediaDetails = 'loading';
			})
			.addCase(fetchAssetMediaDetails.fulfilled, (state, action: PayloadAction<
				EventDetailsState["assetMediaDetails"]
			>) => {
				state.statusAssetMediaDetails = 'succeeded';
				state.assetMediaDetails = action.payload;
			})
			.addCase(fetchAssetMediaDetails.rejected, (state, action) => {
				state.statusAssetMediaDetails = 'failed';
				const emptyAssetMediaDetails = {
					id: "",
					type: "",
					mimetype: "",
					tags: [],
					duration: null,
					size: null,
					url: "",
					streams: {
						audio: [],
						video: [],
					},
					video: "",
				};
				state.assetMediaDetails = emptyAssetMediaDetails;
				state.errorAssetMediaDetails = action.error;
				console.error(action.error);
			})
			// fetchAssetPublications
			.addCase(fetchAssetPublications.pending, (state) => {
				state.statusAssetPublications = 'loading';
			})
			.addCase(fetchAssetPublications.fulfilled, (state, action: PayloadAction<
				EventDetailsState["assetPublications"]
			>) => {
				state.statusAssetPublications = 'succeeded';
				state.assetPublications = action.payload;
			})
			.addCase(fetchAssetPublications.rejected, (state, action) => {
				state.statusAssetPublications = 'failed';
				state.assetPublications = [];
				state.errorAssetPublications = action.error;
				console.error(action.error);
			})
			// fetchAssetPublicationDetails
			.addCase(fetchAssetPublicationDetails.pending, (state) => {
				state.statusAssetPublicationDetails = 'loading';
			})
			.addCase(fetchAssetPublicationDetails.fulfilled, (state, action: PayloadAction<
				EventDetailsState["assetPublicationDetails"]
			>) => {
				state.statusAssetPublicationDetails = 'succeeded';
				state.assetPublicationDetails = action.payload;
			})
			.addCase(fetchAssetPublicationDetails.rejected, (state, action) => {
				state.statusAssetPublicationDetails = 'failed';
				const emptyAssetPublicationDetails = {
					id: "",
					type: "",
					mimetype: "",
					size: null,
					channel: "",
					reference: "",
					tags: [],
					url: "",
				};
				state.assetPublicationDetails = emptyAssetPublicationDetails;
				state.errorAssetPublicationDetails = action.error;
				console.error(action.error);
			})
			// fetchAccessPolicies
			.addCase(fetchAccessPolicies.pending, (state) => {
				state.statusPolicies = 'loading';
			})
			.addCase(fetchAccessPolicies.fulfilled, (state, action: PayloadAction<
				EventDetailsState["policies"]
			>) => {
				state.statusPolicies = 'succeeded';
				state.policies = action.payload;
			})
			.addCase(fetchAccessPolicies.rejected, (state, action) => {
				state.statusPolicies = 'failed';
				state.errorPolicies = action.error;
				console.error(action.error);
			})
			// fetchComments
			.addCase(fetchComments.pending, (state) => {
				state.statusComments = 'loading';
			})
			.addCase(fetchComments.fulfilled, (state, action: PayloadAction<{
				comments: EventDetailsState["comments"],
				commentReasons: EventDetailsState["commentReasons"],
			}>) => {
				state.statusComments = 'succeeded';
				const eventDetails = action.payload;
				state.comments = eventDetails.comments;
				state.commentReasons = eventDetails.commentReasons;
			})
			.addCase(fetchComments.rejected, (state, action) => {
				state.statusComments = 'failed';
				state.errorComments = action.error;
				console.error(action.error);
			})
			// fetchEventPublications
			.addCase(fetchEventPublications.pending, (state) => {
				state.statusPublications = 'loading';
			})
			.addCase(fetchEventPublications.fulfilled, (state, action: PayloadAction<
				EventDetailsState["publications"]
			>) => {
				state.statusPublications = 'succeeded';
				state.publications = action.payload;
			})
			.addCase(fetchEventPublications.rejected, (state, action) => {
				state.statusPublications = 'failed';
				state.errorPublications = action.error;
				console.error(action.error);
			})
			// saveComment
			.addCase(saveComment.pending, (state) => {
				state.statusSaveComment = 'loading';
			})
			.addCase(saveComment.fulfilled, (state) => {
				state.statusSaveComment = 'succeeded';
			})
			.addCase(saveComment.rejected, (state, action) => {
				state.statusSaveComment = 'failed';
				state.errorSaveComment = action.error;
				console.error(action.error);
			})
			// saveCommentReply
			.addCase(saveCommentReply.pending, (state) => {
				state.statusSaveCommentReply = 'loading';
			})
			.addCase(saveCommentReply.fulfilled, (state) => {
				state.statusSaveCommentReply = 'succeeded';
			})
			.addCase(saveCommentReply.rejected, (state, action) => {
				state.statusSaveCommentReply = 'failed';
				state.errorSaveCommentReply = action.error;
				console.error(action.error);
			})
			// fetchSchedulingInfo
			.addCase(fetchSchedulingInfo.pending, (state) => {
				state.statusScheduling = 'loading';
			})
			.addCase(fetchSchedulingInfo.fulfilled, (state, action: PayloadAction<
				EventDetailsState["schedulingSource"]
			>) => {
				state.statusScheduling = 'succeeded';
				state.schedulingSource = action.payload;
				state.scheduling.hasProperties = true;
			})
			.addCase(fetchSchedulingInfo.rejected, (state, action) => {
				state.statusScheduling = 'failed';
				const emptySchedulingSource = {
					start: {
						date: "",
						hour: null,
						minute: null,
					},
					duration: {
						hour: null,
						minute: null,
					},
					end: {
						date: "",
						hour: null,
						minute: null,
					},
					device: {
						id: "",
						name: "",
						inputs: [],
						inputMethods: [],
					},
					agentId: undefined,
					agentConfiguration: {},
				};
				state.schedulingSource = emptySchedulingSource;
				state.scheduling.hasProperties = false;
				state.errorScheduling = action.error;
				console.error(action.error);
			})
			// saveSchedulingInfo
			.addCase(saveSchedulingInfo.pending, (state) => {
				state.statusSaveScheduling = 'loading';
			})
			.addCase(saveSchedulingInfo.fulfilled, (state, action: PayloadAction<
				EventDetailsState["schedulingSource"]
			>) => {
				state.statusSaveScheduling = 'succeeded';
				state.schedulingSource = action.payload;
			})
			.addCase(saveSchedulingInfo.rejected, (state, action) => {
				state.statusSaveScheduling = 'failed';
				state.errorSaveScheduling = action.error;
				console.error(action.error);
			})
			// checkConflicts
			.addCase(checkConflicts.pending, (state) => {
				state.statusCheckConflicts = 'loading';
			})
			.addCase(checkConflicts.fulfilled, (state, action: PayloadAction<{
				conflicts: EventDetailsState["schedulingConflicts"],
				hasSchedulingConflicts: EventDetailsState["hasSchedulingConflicts"],
			}>) => {
				state.statusCheckConflicts = 'succeeded';
				const eventDetails = action.payload;
				state.schedulingConflicts = eventDetails.conflicts;
				state.hasSchedulingConflicts = eventDetails.hasSchedulingConflicts;
			})
			.addCase(checkConflicts.rejected, (state, action) => {
				state.statusCheckConflicts = 'failed';
				state.errorCheckConflicts = action.error;
				console.error(action.error);
			})
			// fetchWorkflows
			.addCase(fetchWorkflows.pending, (state) => {
				state.statusWorkflows = 'loading';
			})
			.addCase(fetchWorkflows.fulfilled, (state, action: PayloadAction<
				EventDetailsState["workflows"]
			>) => {
				state.statusWorkflows = 'succeeded';
				state.workflows = action.payload;
				if (!!state.workflows.workflow.workflowId) {
					state.workflowConfiguration = state.workflows.workflow;
				} else {
					state.workflowConfiguration = state.baseWorkflow;
				}
			})
			.addCase(fetchWorkflows.rejected, (state, action) => {
				state.statusWorkflows = 'failed';
				state.errorWorkflows = action.error;
				console.error(action.error);
			})
			// fetchWorkflowDetails
			.addCase(fetchWorkflowDetails.pending, (state) => {
				state.statusWorkflowDetails = 'loading';
			})
			.addCase(fetchWorkflowDetails.fulfilled, (state, action: PayloadAction<
				EventDetailsState["workflows"]["workflow"]
			>) => {
				state.statusWorkflowDetails = 'succeeded';
				state.workflows.workflow = action.payload;
			})
			.addCase(fetchWorkflowDetails.rejected, (state, action) => {
				state.statusWorkflowDetails = 'failed';
				// This is the empty workflow data from the original reducer
				// TODO: Figure out why it is so vastly different from our initial state
				// and maybe fix our initial state if this is actually correct
				// const emptyWorkflowData = {
				// 	creator: {
				// 		name: "",
				// 		email: "",
				// 	},
				// 	title: "",
				// 	description: "",
				// 	submittedAt: "",
				// 	state: "",
				// 	executionTime: "",
				// 	wiid: "",
				// 	wdid: "",
				// 	configuration: {},
				// };
				const emptyWorkflowData = {
					workflowId: "",
					description: "",
				};
				state.workflows.workflow = emptyWorkflowData;
				state.errorWorkflowDetails = action.error;
				// todo: probably needs a Notification to the user
				console.error(action.error);
			})
			// performWorkflowAction
			.addCase(performWorkflowAction.pending, (state) => {
				state.statusDoWorkflowAction = 'loading';
			})
			.addCase(performWorkflowAction.fulfilled, (state) => {
				state.statusDoWorkflowAction = 'succeeded';
			})
			.addCase(performWorkflowAction.rejected, (state, action) => {
				state.statusDoWorkflowAction = 'failed';
				state.errorDoWorkflowAction = action.error;
				console.error(action.error);
			})
			// deleteWorkflow
			.addCase(deleteWorkflow.pending, (state) => {
				state.statusDeleteWorkflow = 'loading';
			})
			.addCase(deleteWorkflow.fulfilled, (state, action: PayloadAction<
				EventDetailsState["workflows"]["entries"]
			>) => {
				state.statusDeleteWorkflow = 'succeeded';
				state.workflows.entries = action.payload;
			})
			.addCase(deleteWorkflow.rejected, (state, action) => {
				state.statusDeleteWorkflow = 'failed';
				state.errorDeleteWorkflow = action.error;
				console.error(action.error);
			})
			// fetchWorkflowOperations
			.addCase(fetchWorkflowOperations.pending, (state) => {
				state.statusWorkflowOperations = 'loading';
			})
			.addCase(fetchWorkflowOperations.fulfilled, (state, action: PayloadAction<
				EventDetailsState["workflowOperations"]
			>) => {
				state.statusWorkflowOperations = 'succeeded';
				state.workflowOperations = action.payload;
			})
			.addCase(fetchWorkflowOperations.rejected, (state, action) => {
				state.statusWorkflowOperations = 'failed';
				state.workflowOperations = { entries: [] };
				state.errorWorkflowOperations = action.error;
				// todo: probably needs a Notification to the user
				console.error(action.error);
			})
			// fetchWorkflowOperationDetails
			.addCase(fetchWorkflowOperationDetails.pending, (state) => {
				state.statusWorkflowOperationDetails = 'loading';
			})
			.addCase(fetchWorkflowOperationDetails.fulfilled, (state, action: PayloadAction<
				EventDetailsState["workflowOperationDetails"]
			>) => {
				state.statusWorkflowOperationDetails = 'succeeded';
				state.workflowOperations = action.payload;
			})
			.addCase(fetchWorkflowOperationDetails.rejected, (state, action) => {
				state.statusWorkflowOperationDetails = 'failed';
				const emptyOperationDetails = {
					name: "",
					description: "",
					state: "",
					execution_host: "",
					job: "",
					time_in_queue: "",
					started: "",
					completed: "",
					retry_strategy: "",
					failed_attempts: "",
					max_attempts: "",
					exception_handler_workflow: "",
					fail_on_error: "",
				};
				state.workflowOperationDetails = emptyOperationDetails;
				state.errorWorkflowOperationDetails= action.error;
				// todo: probably needs a Notification to the user
				console.error(action.error);
			})
			// fetchWorkflowErrors
			.addCase(fetchWorkflowErrors.pending, (state) => {
				state.statusWorkflowErrors = 'loading';
			})
			.addCase(fetchWorkflowErrors.fulfilled, (state, action: PayloadAction<
				EventDetailsState["workflowErrors"]
			>) => {
				state.statusWorkflowErrors = 'succeeded';
				state.workflowErrors = action.payload;
			})
			.addCase(fetchWorkflowErrors.rejected, (state, action) => {
				state.statusWorkflowErrors = 'failed';
				state.workflowErrors = { entries: [] };
				state.errorWorkflowOperations = action.error;
				// todo: probably needs a Notification to the user
				console.error(action.error);
			})
			// fetchWorkflowErrorDetails
			.addCase(fetchWorkflowErrorDetails.pending, (state) => {
				state.statusWorkflowErrorDetails = 'loading';
			})
			.addCase(fetchWorkflowErrorDetails.fulfilled, (state, action: PayloadAction<
				EventDetailsState["workflowErrorDetails"]
			>) => {
				state.statusWorkflowErrorDetails = 'succeeded';
				state.workflowErrorDetails = action.payload;
			})
			.addCase(fetchWorkflowErrorDetails.rejected, (state, action) => {
				state.statusWorkflowErrorDetails = 'failed';
				state.workflowErrorDetails = {};
				state.errorWorkflowOperationDetails = action.error;
				// todo: probably needs a Notification to the user
				console.error(action.error);
			})
			// // fetchEventStatistics
			// .addCase(fetchEventStatistics.pending, (state) => {
			// 	state.statusStatistics = 'loading';
			// })
			// .addCase(fetchEventStatistics.fulfilled, (state, action: PayloadAction<{
			// 	statistics: EventDetailsState["statistics"],
			// 	hasStatisticsError: EventDetailsState["hasStatisticsError"],
			// }>) => {
			// 	state.statusStatistics = 'succeeded';
			// 	const eventDetails = action.payload;
			// 	state.statistics = eventDetails.statistics;
			// 	state.hasStatisticsError = eventDetails.hasStatisticsError;
			// })
			.addCase(fetchEventStatistics.rejected, (state, action) => {
				state.statusStatistics = 'failed';
				state.statistics = [];
				// TODO: Type this
				// state.hasStatisticsError = action.payload.hasStatisticsError;
				state.errorStatistics = action.error;
				console.error(action.error);
			})
			.addCase(updateMetadata.rejected, (state, action) => {
				console.error(action.error);
			})
			.addCase(updateExtendedMetadata.rejected, (state, action) => {
				console.error(action.error);
			})
			.addCase(fetchHasActiveTransactions.rejected, (state, action) => {
				console.error(action.error);
			})
			.addCase(deleteComment.rejected, (state, action) => {
				console.error(action.error);
			})
			.addCase(updateWorkflow.fulfilled, (state, action) => {
				if (!!state.workflows.workflow.workflowId) {
					state.workflowConfiguration = state.workflows.workflow;
				} else {
					state.workflowConfiguration = state.baseWorkflow;
				}
			})
	}
});

export const {
	setEventMetadata,
	setExtendedEventMetadata,
	setEventWorkflow,
	setEventWorkflowDefinitions,
	setEventWorkflowConfiguration,
} = eventDetailsSlice.actions;

// Export the slice reducer as the default export
export default eventDetailsSlice.reducer;
