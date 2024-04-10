import { PayloadAction, SerializedError, createAsyncThunk, createSlice, unwrapResult } from '@reduxjs/toolkit'
import axios from 'axios';
import { addNotification, removeNotificationWizardForm } from "../slices/notificationSlice";
import {
	createPolicy,
	getHttpHeaders,
	transformMetadataCollection,
	transformMetadataForUpdate,
} from "../utils/resourceUtils";
import { NOTIFICATION_CONTEXT } from "../configs/modalConfig";
import { fetchWorkflowDef } from "../slices/workflowSlice";
import {
	getMetadata,
	getExtendedMetadata,
	getSchedulingSource,
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
import { Workflow as WorkflowDefinitions} from "../slices/workflowSlice";
import { RootState } from '../store';
import { Statistics, fetchStatistics, fetchStatisticsValueUpdate } from './statisticsSlice';
import { Ace, TransformedAcl, TransformedAcls } from './aclDetailsSlice';

type MetadataField = {
	id: string,
	label: string,	// translation key
	readOnly: boolean,
	required: boolean,
	type: string,
	value: string,
}

interface Assets {
	id: string,
	mimetype: string,
	tags: string[],
	url: string,
}

type AssetDetails = {
	id: string,
	type: string,
	mimetype: string,
	size: number,
	tags: string[],
	url: string,
	checksum: string | undefined,
	reference: string,
}

type CommentAuthor = {
	email: string | undefined,
	name: string,
	username: string,
}

// TODO: Further define this after modernizing Workflows
type Workflow = {
	scheduling: boolean,
	entries: {
		id: number,
		status: string,	//translation key
		submitted: string,	//date
		submitter: string,
		submitterEmail: string,
		submitterName: string,
		title: string
	}[],
	workflow: any // TODO: proper typing
}

type Device = {
	id: string,
	inputs: { id: string, value: string }[],
	inputMethods: string[],
	name: string,
	// Fields we add to "device" from recordings but don't actually care about?
	// removable: boolean,
	// roomId: string,
	// status: string,
	// type: string,
	// updated: string,
	// url: string,
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
	statusStatisticsValue: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorStatisticsValue: SerializedError | null,
	eventId: string,
	metadata: {
		title: string,	// translation key
		flavor: string,
		fields: MetadataField[] | undefined
	},
	extendedMetadata: {
		title: string,	// not (necessarily) translation key
		flavor: string,
		fields: MetadataField[] | undefined
	}[],
	assets: {
		attachments: number,
		catalogs: number,
		media: number,
		publications: number,
	},
	transactionsReadOnly: boolean,
	uploadAssetOptions: {
		id: string,
		title: string,	// translation key
		type: string,		// "track", "attachment" etc.
		flavorType: string,
		flavorSubType: string,
		accept: string,
		displayOrder: number,
	}[] | undefined,
	assetAttachments: Array< Assets & {
		type: string,
	}>,
	assetAttachmentDetails: AssetDetails,
	assetCatalogs: Array< Assets & {
		type: string,
	}>,
	assetCatalogDetails: AssetDetails,
	assetMedia: Array< Assets & {
		type: string,
		mediaFileName: string,
	}>,
	assetMediaDetails: AssetDetails & {
		duration: number,
		has_audio: boolean,
		has_subtitle: boolean,
		has_video: boolean,
		streams: {
			audio: {
				bitdepth: string,
				bitrate: number,
				channels: number,
				framecount: number,
				id: string,
				peakleveldb: string,
				rmsleveldb: string,
				rmspeakdb: "",
				samplingrate: number,
				type: string,
			}[],
			video: {
				bitrate: number,
				framecount: number,
				framerate: number,
				id: string,
				resolution: string,
				scanorder: string,
				scantype: string,
				type: string,
			}[],
		},
		video: {
			previews: {
				uri: string,
			}[]
			url: string,
		} | undefined,
	},
	assetPublications: Array< Assets & {
		channel: string,
	}>,
	assetPublicationDetails: AssetDetails & {
		channel: string,
	},
	policies: {
		actions: string[],
		read: boolean,
		role: string,
		write: boolean,
	}[],
	comments: {
		author: CommentAuthor,
		creationDate: string,
		id: number,
		modificationDate: string,
		reason: string,	// translation key
		replies: {
			author: CommentAuthor,
			creationDate: string,
			id: number,
			modificationDate: string,
			text: string,
		}[],
		resolvedStatus: boolean,
		text: string,
	}[],
	commentReasons: { [key: string]: string },
	scheduling: {
		hasProperties: boolean,
	},
	schedulingSource: {
		start: {
			date: string,
			hour: number | undefined,
			minute: number | undefined,
		},
		duration: {
			hour: number | undefined,
			minute: number | undefined,
		},
		end: {
			date: string,
			hour: number | undefined,
			minute: number | undefined,
		},
		device: Device,
		agentId: string | undefined,
		agentConfiguration: { [key: string]: string },
	},
	hasSchedulingConflicts: boolean,
	schedulingConflicts: {
		title: string,
		start: string,
		end: string,
	}[],
	workflows: Workflow,
	workflowConfiguration: {
		workflowId: string,
		description?: string,
	},
	workflowDefinitions: WorkflowDefinitions[],
	baseWorkflow: any,	// TODO: proper typing
	workflowOperations: {
		entries: {
			configuration: { [key: string]: string },
			description: string,
			id: number,
			status: string,	// translation key
			title: string,
		}[]
	},
	workflowOperationDetails: {
		completed: string,	// date
		description: string,
		exception_handler_workflow: string,
		execution_host: string,
		fail_on_error: boolean,
		failed_attempts: number,
		job: number,
		max_attempts: number,
		name: string,
		retry_strategy: string,
		started: string,	// date
		state: string,	// translation key
		time_in_queue: number,
	},
	workflowErrors: {
		entries: {
			description: string,
			id: number,
			severity: string,
			timestamp: string,	// date
			title: string,
		}[]
	},
	workflowErrorDetails: {
		description: string,
		details: {
			name: string,
			value: string,
		}[],
		id: number,
		job_id: number,
		processing_host: string,
		service_type: string,
		severity: string,
		technical_details: string,
		timestamp: string,	// date
		title: string,
	},
	publications: {
		enabled: boolean,
		icon?: string,
		id: string,
		name: string,	// translation key
		order: number,
		url: string,
		description?: string,
	}[],
	statistics: Statistics[],
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
	statusStatisticsValue: 'uninitialized',
	errorStatisticsValue: null,
	eventId: "",
	metadata: {
		title: "",
		flavor: "",
		fields: undefined
	},
	extendedMetadata: [],
	assets: {
		attachments: 0,
		catalogs: 0,
		media: 0,
		publications: 0,
	},
	transactionsReadOnly: false,
	uploadAssetOptions: [],
	assetAttachments: [],
	assetAttachmentDetails: {
		id: "",
		type: "",
		mimetype: "",
		size: 0,
		checksum: undefined,
		reference: "",
		tags: [],
		url: "",
	},
	assetCatalogs: [],
	assetCatalogDetails: {
		id: "",
		type: "",
		mimetype: "",
		size: 0,
		checksum: undefined,
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
		duration: 0,
		size: 0,
		checksum: undefined,
		reference: "",
		has_audio: false,
		has_subtitle: false,
		has_video: false,
		url: "",
		streams: {
			audio: [],
			video: [],
		},
		video: undefined,
	},
	assetPublications: [],
	assetPublicationDetails: {
		id: "",
		type: "",
		mimetype: "",
		size: 0,
		channel: "",
		checksum: undefined,
		reference: "",
		tags: [],
		url: "",
	},
	policies: [],
	comments: [],
	commentReasons: {},
	scheduling: {
		hasProperties: false,
	},
	schedulingSource: {
		start: {
			date: "",
			hour: undefined,
			minute: undefined,
		},
		duration: {
			hour: undefined,
			minute: undefined,
		},
		end: {
			date: "",
			hour: undefined,
			minute: undefined,
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
	workflowOperations: {
		entries: [],
	},
	workflowOperationDetails: {
		completed: "",
		description: "",
		exception_handler_workflow: "",
		execution_host: "",
		fail_on_error: false,
		failed_attempts: 0,
		job: 0,
		max_attempts: 0,
		name: "",
		retry_strategy: "",
		started: "",
		state: "",
		time_in_queue: 0,
	},
	workflowErrors: {
		entries: []
	},
	workflowErrorDetails: {
		description: "",
		details: [],
		id: 0,
		job_id: 0,
		processing_host: "",
		service_type: "",
		severity: "",
		technical_details: "",
		timestamp: "",
		title: "",
	},
	publications: [],
	statistics: [],
	hasStatisticsError: false,
};


export const fetchMetadata = createAsyncThunk('eventDetails/fetchMetadata', async (eventId: string) => {
	const metadataRequest = await axios.get(`/admin-ng/event/${eventId}/metadata.json`);
	const metadataResponse = await metadataRequest.data;

	const mainCatalog = "dublincore/episode";
	let metadata = {
		title: "",
		flavor: "",
		fields: undefined
	};
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

export const fetchAssets = createAsyncThunk('eventDetails/fetchAssets', async (eventId: string, { dispatch }) => {
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
			addNotification({
				type: "warning",
				key: "ACTIVE_TRANSACTION",
				duration: -1,
				parameter: null,
				context: NOTIFICATION_CONTEXT
			})
		);
	}

	return { assets, transactionsReadOnly, uploadAssetOptions }
});

const formatUploadAssetOptions = (optionsData: object) => {
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

export const fetchAssetAttachments = createAsyncThunk('eventDetails/fetchAssetAttachments', async (eventId: string) => {
	let params = new URLSearchParams();
	params.append("id1", "attachment");

	const attachmentsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/attachment/attachments.json`,
		{ params }
	);
	return await attachmentsRequest.data;
});

export const fetchAssetAttachmentDetails = createAsyncThunk('eventDetails/fetchAssetAttachmentDetails', async (params: {
	eventId: string,
	attachmentId: string
}) => {
	const { eventId, attachmentId } = params;
	let searchParams = new URLSearchParams();
	searchParams.append("id1", "attachment");

	const attachmentDetailsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/attachment/${attachmentId}.json`,
		{ params }
	);
	return await attachmentDetailsRequest.data;
});

export const fetchAssetCatalogs = createAsyncThunk('eventDetails/fetchAssetCatalogs', async (eventId: string) => {
	let params = new URLSearchParams();
	params.append("id1", "catalog");

	const catalogsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/catalog/catalogs.json`,
		{ params }
	);
	return await catalogsRequest.data;
});

export const fetchAssetCatalogDetails = createAsyncThunk('eventDetails/fetchAssetCatalogDetails', async (params: {
	eventId: string,
	catalogId: string
}) => {
	const { eventId, catalogId } = params;
	let searchParams = new URLSearchParams();
	searchParams.append("id1", "catalog");

	const catalogDetailsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/catalog/${catalogId}.json`,
		{ params }
	);
	return await catalogDetailsRequest.data;
});

export const fetchAssetMedia = createAsyncThunk('eventDetails/fetchAssetMedia', async (eventId: string) => {
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

export const fetchAssetMediaDetails = createAsyncThunk('eventDetails/fetchAssetMediaDetails', async (params: {
	eventId: string,
	mediaId: string
}) => {
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
		video: {
			previews: [{ uri: mediaDetails.url }],
		},
		url: mediaDetails.url.split("?")[0],
	};

	return mediaDetails;
});

export const fetchAssetPublications = createAsyncThunk('eventDetails/fetchAssetPublications', async (eventId: string) => {
	let params = new URLSearchParams();
	params.append("id1", "publication");

	const publicationsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/publication/publications.json`,
		{ params }
	);
	return await publicationsRequest.data;
});

export const fetchAssetPublicationDetails = createAsyncThunk('eventDetails/fetchAssetPublicationDetails', async (params: {
	eventId: string,
	publicationId: string
}) => {
	const { eventId, publicationId } = params;
	let searchParams = new URLSearchParams();
	searchParams.append("id1", "publication");

	const publicationDetailsRequest = await axios.get(
		`/admin-ng/event/${eventId}/asset/publication/${publicationId}.json`,
		{ params }
	);
	return await publicationDetailsRequest.data;
});

export const fetchAccessPolicies = createAsyncThunk('eventDetails/fetchAccessPolicies', async (eventId: string) => {
	const policyData = await axios.get(
		`/admin-ng/event/${eventId}/access.json`
	);
	let accessPolicies = await policyData.data;

	let policies: TransformedAcls = [];
	if (!!accessPolicies.episode_access) {
		const json = JSON.parse(accessPolicies.episode_access.acl).acl.ace;
		let newPolicies: { [key: string]: TransformedAcl } = {};
		let policyRoles: string[] = [];
		for (let i = 0; i < json.length; i++) {
			const policy: Ace = json[i];
			if (!newPolicies[policy.role]) {
				newPolicies[policy.role] = createPolicy(policy.role);
				policyRoles.push(policy.role);
			}
			if (policy.action === "read" || policy.action === "write") {
				newPolicies[policy.role][policy.action] = policy.allow;
			} else if (policy.allow === true) { //|| policy.allow === "true") {
				newPolicies[policy.role].actions.push(policy.action);
			}
		}
		policies = policyRoles.map((role) => newPolicies[role]);
	}

	return policies;
});

export const fetchComments = createAsyncThunk('eventDetails/fetchComments', async (eventId: string) => {
	const commentsData = await axios.get(`/admin-ng/event/${eventId}/comments`);
	const comments = await commentsData.data;

	const commentReasonsData = await axios.get(
		`/admin-ng/resources/components.json`
	);
	const commentReasons = (await commentReasonsData.data).eventCommentReasons;

	return { comments, commentReasons }
});

export const fetchEventPublications = createAsyncThunk('eventDetails/fetchEventPublications', async (eventId: string) => {
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

export const saveComment = createAsyncThunk('eventDetails/saveComment', async (params: {
	eventId: string,
	commentText: string,
	commentReason: string
}) => {
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

export const saveCommentReply = createAsyncThunk('eventDetails/saveCommentReply', async (params: {
	eventId: string,
	commentId: string,
	replyText: string,
	commentResolved: boolean
}) => {
	const { eventId, commentId, replyText, commentResolved } = params;
	let headers = getHttpHeaders();

	let data = new URLSearchParams();
	data.append("text", replyText);
	data.append("resolved", String(commentResolved));

	const commentReply = await axios.post(
		`/admin-ng/event/${eventId}/comment/${commentId}/reply`,
		data.toString(),
		headers
	);

	await commentReply.data;

	return true;
});

export const fetchSchedulingInfo = createAsyncThunk('eventDetails/fetchSchedulingInfo', async (eventId: string, { dispatch, getState }) => {
		// get data from API about event scheduling
		const schedulingRequest = await axios.get(
			`/admin-ng/event/${eventId}/scheduling.json`
		);
		const schedulingResponse = await schedulingRequest.data;

		// get data from API about capture agents
		await dispatch(fetchRecordings("inputs"));

		const state = getState() as RootState;
		const captureAgents = getRecordings(state);

		const startDate = new Date(schedulingResponse.start);
		const endDate = new Date(schedulingResponse.end);
		const { durationHours, durationMinutes } = calculateDuration(
			startDate,
			endDate
		);

		let device: Device = {
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

export const saveSchedulingInfo = createAsyncThunk('eventDetails/saveSchedulingInfo', async (params: {
	eventId: string,
	values: {
		captureAgent: string,
		inputs: string[],
		scheduleDurationHours: string,
		scheduleDurationMinutes: string,
		scheduleEndDate: string,
		scheduleEndHour: string,
		scheduleEndMinute: string,
		scheduleStartDate: string,
		scheduleStartHour: string,
		scheduleStartMinute: string,
	},
	startDate: Date,
	endDate: Date
}, { dispatch, getState }) => {
	const { eventId, values, startDate, endDate } = params;

	const state = getState() as RootState;
	const oldSource = getSchedulingSource(state as RootState);
	const captureAgents = getRecordings(state);
	let device: Device = {
		id: "",
		name: "",
		inputs: [],
		inputMethods: [],
	};

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
			date: startDate.toISOString(),
			hour: parseInt(values.scheduleStartHour),
			minute: parseInt(values.scheduleStartMinute),
		},
		end: {
			date: endDate.toISOString(),
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
				addNotification({
					type: "error",
					key: "EVENTS_NOT_UPDATED",
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
			throw (response);
		});

	return source;
});

// TODO: This does not return a boolean anymore. Fix this in usage, make users
// get their info from the state
export const checkConflicts = createAsyncThunk('eventDetails/checkConflicts', async (params: {
	eventId: string,
	startDate: Date,
	endDate: Date,
	deviceId: string
}, { dispatch }) => {
const { eventId, startDate, endDate, deviceId } = params;
const conflicts: any[] = [];
let hasSchedulingConflicts = false;

const now = new Date();
if (endDate < now) {
	dispatch(removeNotificationWizardForm());
	dispatch(
		addNotification({
			type: "error",
			key: "CONFLICT_IN_THE_PAST",
			duration: -1,
			parameter: null,
			context: NOTIFICATION_CONTEXT
		})
	);
	hasSchedulingConflicts = true;
} else {
	dispatch(removeNotificationWizardForm());
	let headers = getHttpHeaders();

	const conflictTimeFrame = {
		id: eventId,
		start: startDate.toISOString(),
		duration: endDate.getTime() - startDate.getTime(),
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
					addNotification({
						type: "error",
						key: "CONFLICT_DETECTED",
						duration:-1,
						parameter: null,
						context: NOTIFICATION_CONTEXT
					})
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
					addNotification({
						type: "error",
						key: "CONFLICT_DETECTED",
						duration:-1,
						parameter: null,
						context: NOTIFICATION_CONTEXT
					})
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

export const fetchWorkflows = createAsyncThunk('eventDetails/fetchWorkflows', async (eventId: string, { dispatch, getState }) => {
	// todo: show notification if there are active transactions
	// dispatch(addNotification('warning', 'ACTIVE_TRANSACTION', -1, null, NOTIFICATION_CONTEXT));

	const data = await axios.get(`/admin-ng/event/${eventId}/workflows.json`);
	const workflowsData = await data.data;
	let workflows: Workflow;

	if (!!workflowsData.results) {
		workflows = {
			entries: workflowsData.results,
			scheduling: false,
			workflow: {
				workflowId: "",
				description: undefined,
				configuration: undefined
			},
		};

	} else {
		workflows = {
			workflow: {
				workflowId: workflowsData.workflowId,
				description: undefined,
				configuration: undefined
			},
			scheduling: true,
			entries: [],
		};

		await dispatch(fetchWorkflowDef("event-details"));

		const state = getState() as RootState;

		const workflowDefinitions = getWorkflowDef(state);

		dispatch(setEventWorkflowDefinitions({workflows, workflowDefinitions}));
	}

	return workflows;
});

export const fetchWorkflowDetails = createAsyncThunk('eventDetails/fetchWorkflowDetails', async (params: {
	eventId: string,
	workflowId: string
}) => {
	const { eventId, workflowId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}.json`
	);
	return await data.data;
});

export const performWorkflowAction = createAsyncThunk('eventDetails/performWorkflowAction', async (params: {
	eventId: string,
	workflowId: string,
	action: string,
	close: () => void,
}, { dispatch }) => {
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
				addNotification({
					type: "success",
					key: "EVENTS_PROCESSING_ACTION_" + action,
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
			close();
		})
		.catch((response) => {
			dispatch(
				addNotification({
					type: "error",
					key: "EVENTS_PROCESSING_ACTION_NOT_" + action,
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
			throw (response)
		});
});

export const deleteWorkflow = createAsyncThunk('eventDetails/deleteWorkflow', async (params: {
	eventId: string,
	workflowId: number
}, { dispatch, getState }) => {
	const { eventId, workflowId } = params;

	const workflowEntries = await axios
		.delete(`/admin-ng/event/${eventId}/workflows/${workflowId}`)
		.then((response) => {
			dispatch(
				addNotification({
					type: "success",
					key: "EVENTS_PROCESSING_DELETE_WORKFLOW",
					duration: -1,
					parameter:null,
					context: NOTIFICATION_CONTEXT
				})
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
				addNotification({
					type: "error",
					key: "EVENTS_PROCESSING_DELETE_WORKFLOW_FAILED",
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
			throw (response);
		});

	return workflowEntries;
});

export const fetchWorkflowOperations = createAsyncThunk('eventDetails/fetchWorkflowOperations', async (params: {
	eventId: string,
	workflowId: string
}) => {
	const { eventId, workflowId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}/operations.json`
	);
	const workflowOperationsData = await data.data;
	return { entries: workflowOperationsData };
});

export const fetchWorkflowOperationDetails = createAsyncThunk('eventDetails/fetchWorkflowOperationDetails', async (params: {
	eventId: string,
	workflowId: string,
	operationId?: number
}) => {
	const { eventId, workflowId, operationId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}/operations/${operationId}`
	);
	return await data.data;
});

export const fetchWorkflowErrors = createAsyncThunk('eventDetails/fetchWorkflowErrors', async (params: {
	eventId: string,
	workflowId: string
}) => {
	const { eventId, workflowId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}/errors.json`
	);
	const workflowErrorsData = await data.data;
	return { entries: workflowErrorsData };
});

export const fetchWorkflowErrorDetails = createAsyncThunk('eventDetails/fetchWorkflowErrorDetails', async (params: {
	eventId: string,
	workflowId: string,
	errorId?: number
}) => {
	const { eventId, workflowId, errorId } = params;
	const data = await axios.get(
		`/admin-ng/event/${eventId}/workflows/${workflowId}/errors/${errorId}.json`
	);
	return await data.data;
});

// TODO: Fix this after the modernization of statisticsThunks happened
export const fetchEventStatistics = createAsyncThunk('eventDetails/fetchEventStatistics', async (eventId: string, { getState }) => {
	// get prior statistics
	const state = getState();
	const statistics = getStatistics(state as RootState);

	return await (
		fetchStatistics(
			eventId,
			"episode",
			statistics,
		)
	);
});

// TODO: Fix this after the modernization of statisticsThunks happened
export const fetchEventStatisticsValueUpdate = createAsyncThunk('eventDetails/fetchEventStatisticsValueUpdate', async (params: {
	eventId: string,
	providerId: string,
	from: string,
	to: string,
	dataResolution: string[],
	timeMode: any
}, { getState }) => {
	const { eventId, providerId, from, to, dataResolution, timeMode } = params;
	// get prior statistics
	const state = getState();
	const statistics = getStatistics(state as RootState);

	return await (
		fetchStatisticsValueUpdate(
			eventId,
			"episode",
			providerId,
			from,
			to,
			dataResolution,
			timeMode,
			statistics,
		)
	);
});

export const updateMetadata = createAsyncThunk('eventDetails/updateMetadata', async (params: {
	eventId: string,
	values: { [key: string]: any }
}, { dispatch, getState }) => {
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

export const updateExtendedMetadata = createAsyncThunk('eventDetails/updateExtendedMetadata', async (params: {
	eventId: string,
	values: { [key: string]: any },
	catalog: {
		flavor: string,
		title: string,
		fields: { [key: string]: any }[]
	}
}, { dispatch, getState }) => {
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

export const fetchHasActiveTransactions = createAsyncThunk('eventDetails/fetchHasActiveTransactions', async (eventId: string) => {
	const transactionsData = await axios.get(
		`/admin-ng/event/${eventId}/hasActiveTransaction`
	);
	const hasActiveTransactions = await transactionsData.data;
	return hasActiveTransactions;
});

export const updateAssets = createAsyncThunk('eventDetails/updateAssets', async (params: {
	values: { [key: string]: string },
	eventId: string
}, { dispatch, getState }) => {
	const { values, eventId } = params;
	// get asset upload options from redux store
	const state = getState() as RootState;
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
				addNotification({
					type: "success",
					key: "EVENTS_UPDATED",
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
		})
		.catch((response) => {
			console.error(response);
			dispatch(
				addNotification({
					type: "error",
					key: "EVENTS_NOT_UPDATED",
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
		});
});

export const saveAccessPolicies = createAsyncThunk('eventDetails/saveAccessPolicies', async (params: {
	eventId: string,
	policies: { [key: string]: TransformedAcl }
}, { dispatch }) => {
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
				addNotification({
					type: "info",
					key: "SAVED_ACL_RULES",
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
			return true;
		})
		.catch((response) => {
			console.error(response);
			dispatch(
				addNotification({
					type: "error",
					key: "ACL_NOT_SAVED",
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
			);
			return false;
		});
});

export const deleteComment = createAsyncThunk('eventDetails/deleteComment', async (params: {
	eventId: string,
	commentId: number
}) => {
	const { eventId, commentId } = params;
	const commentDeleted = await axios.delete(
		`/admin-ng/event/${eventId}/comment/${commentId}`
	);
	await commentDeleted.data;
	return true;
});

export const deleteCommentReply = createAsyncThunk('eventDetails/deleteCommentReply', async (params: {
	eventId: string,
	commentId: number,
	replyId: number
}) => {
	const { eventId, commentId, replyId } = params;
	const commentReplyDeleted = await axios.delete(
		`/admin-ng/event/${eventId}/comment/${commentId}/${replyId}`
	);
	await commentReplyDeleted.data;

	return true;
});

export const updateWorkflow = createAsyncThunk('eventDetails/updateWorkflow', async (workflowId: string, { dispatch, getState }) => {
	const state = getState();
	const workflowDefinitions = getWorkflowDefinitions(state as RootState);
	const workflowDef = workflowDefinitions.find((def) => def.id === workflowId);
	await dispatch(
		setEventWorkflow({
			workflowId: workflowId,
			description: workflowDef?.description,
			configuration: workflowDef?.configuration_panel_json // previously `workflowDef.configuration`. Might cause error
		})
	);
});

export const saveWorkflowConfig = createAsyncThunk('eventDetails/saveWorkflowConfig', async (params: {
	values: {
		workflowDefinition: string,
		configuration: { [key: string]: any }
	},
	eventId: string
}, { dispatch }) => {
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
				addNotification({
					type: "error",
					key: "EVENTS_NOT_UPDATED",
					duration: -1,
					parameter: null,
					context: NOTIFICATION_CONTEXT
				})
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
				state.metadata = {
					title: "",
					flavor: "",
					fields: undefined
				};
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
					attachments: 0,
					catalogs: 0,
					media: 0,
					publications: 0,
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
					size: 0,
					checksum: undefined,
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
					size: 0,
					checksum: undefined,
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
					duration: 0,
					size: 0,
					checksum: undefined,
					reference: "",
					has_audio: false,
					has_subtitle: false,
					has_video: false,
					url: "",
					streams: {
						audio: [],
						video: [],
					},
					video: undefined,
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
					size: 0,
					checksum: undefined,
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
						hour: undefined,
						minute: undefined,
					},
					duration: {
						hour: undefined,
						minute: undefined,
					},
					end: {
						date: "",
						hour: undefined,
						minute: undefined,
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
				state.workflowOperationDetails = action.payload;
			})
			.addCase(fetchWorkflowOperationDetails.rejected, (state, action) => {
				state.statusWorkflowOperationDetails = 'failed';
				const emptyOperationDetails = {
					completed: "",
					description: "",
					exception_handler_workflow: "",
					execution_host: "",
					fail_on_error: false,
					failed_attempts: 0,
					job: 0,
					max_attempts: 0,
					name: "",
					retry_strategy: "",
					started: "",
					state: "",
					time_in_queue: 0,
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
				state.workflowErrorDetails = {
					description: "",
					details: [],
					id: 0,
					job_id: 0,
					processing_host: "",
					service_type: "",
					severity: "",
					technical_details: "",
					timestamp: "",
					title: "",
				};
				state.errorWorkflowOperationDetails = action.error;
				// todo: probably needs a Notification to the user
				console.error(action.error);
			})
			// fetchEventStatistics
			.addCase(fetchEventStatistics.pending, (state) => {
				state.statusStatistics = 'loading';
			})
			.addCase(fetchEventStatistics.fulfilled, (state, action: PayloadAction<{
				statistics: EventDetailsState["statistics"],
				hasError: EventDetailsState["hasStatisticsError"],
			}>) => {
				state.statusStatistics = 'succeeded';
				const eventDetails = action.payload;
				state.statistics = eventDetails.statistics;
				state.hasStatisticsError = eventDetails.hasError;
			})
			.addCase(fetchEventStatistics.rejected, (state, action) => {
				state.statusStatistics = 'failed';
				state.statistics = [];
				state.hasStatisticsError = true;
				state.errorStatistics = action.error;
				console.error(action.error);
			})
			//fetchEventStatisticsValueUpdate
			.addCase(fetchEventStatisticsValueUpdate.pending, (state) => {
				state.statusStatistics = 'loading';
			})
			.addCase(fetchEventStatisticsValueUpdate.fulfilled, (state, action: PayloadAction<
				any
			>) => {
				state.statusStatisticsValue = 'succeeded';
				state.statistics = action.payload;
			})
			.addCase(fetchEventStatisticsValueUpdate.rejected, (state, action) => {
				state.statusStatisticsValue = 'failed';
				state.statistics = [];
				state.errorStatisticsValue = action.error;
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
