/* selectors for metadata */
export const getMetadata = (state: any) => state.eventDetails.metadata;
export const getExtendedMetadata = (state: any) => state.eventDetails.extendedMetadata;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingMetadata = (state) =>
	state.eventDetails.fetchingMetadataInProgress;

/* selectors for assets */
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssets = (state) => state.eventDetails.assets;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingAssets = (state) =>
	state.eventDetails.fetchingAssetsInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isTransactionReadOnly = (state) =>
	state.eventDetails.transactionsReadOnly;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getUploadAssetOptions = (state) =>
	state.eventDetails.uploadAssetOptions;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetAttachments = (state) =>
	state.eventDetails.assetAttachments;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetAttachmentDetails = (state) =>
	state.eventDetails.assetAttachmentDetails;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetCatalogs = (state) => state.eventDetails.assetCatalogs;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetCatalogDetails = (state) =>
	state.eventDetails.assetCatalogDetails;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetMedia = (state) => state.eventDetails.assetMedia;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetMediaDetails = (state) =>
	state.eventDetails.assetMediaDetails;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetPublications = (state) =>
	state.eventDetails.assetPublications;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetPublicationDetails = (state) =>
	state.eventDetails.assetPublicationDetails;

/* selectors for policies */
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getPolicies = (state) => state.eventDetails.policies;

/* selectors for comments */
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getComments = (state) => state.eventDetails.comments;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getCommentReasons = (state) => state.eventDetails.commentReasons;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingComments = (state) =>
	state.eventDetails.fetchingCommentsInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isSavingComment = (state) =>
	state.eventDetails.savingCommentInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isSavingCommentReply = (state) =>
	state.eventDetails.savingCommentReplyInProgress;

/* selectors for scheduling */
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSchedulingProperties = (state) =>
	state.eventDetails.scheduling.hasProperties;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingScheduling = (state) =>
	state.eventDetails.fetchingSchedulingInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isSavingScheduling = (state) =>
	state.eventDetails.savingSchedulingInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSchedulingSource = (state) =>
	state.eventDetails.schedulingSource;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSchedulingConflicts = (state) =>
	state.eventDetails.schedulingConflicts;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isCheckingConflicts = (state) =>
	state.eventDetails.checkingConflicts;

/* selectors for workflows */
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getWorkflows = (state) => state.eventDetails.workflows;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingWorkflows = (state) =>
	state.eventDetails.fetchingWorkflowsInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getWorkflowDefinitions = (state) =>
	state.eventDetails.workflowDefinitions;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getWorkflowConfiguration = (state) =>
	state.eventDetails.workflowConfiguration;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getWorkflow = (state) => state.eventDetails.workflows.workflow;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingWorkflowDetails = (state) =>
	state.eventDetails.fetchingWorkflowDetailsInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getBaseWorkflow = (state) => state.eventDetails.baseWorkflow;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const performingWorkflowAction = (state) =>
	state.eventDetails.workflowActionInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const deletingWorkflow = (state) =>
	state.eventDetails.deleteWorkflowInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getWorkflowOperations = (state) =>
	state.eventDetails.workflowOperations;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingWorkflowOperations = (state) =>
	state.eventDetails.fetchingWorkflowOperationsInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getWorkflowOperationDetails = (state) =>
	state.eventDetails.workflowOperationDetails;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingWorkflowOperationDetails = (state) =>
	state.eventDetails.fetchingWorkflowOperationDetailsInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getWorkflowErrors = (state) => state.eventDetails.workflowErrors;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingWorkflowErrors = (state) =>
	state.eventDetails.fetchingWorkflowErrorsInProgress;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getWorkflowErrorDetails = (state) =>
	state.eventDetails.workflowErrorDetails;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingWorkflowErrorDetails = (state) =>
	state.eventDetails.fetchingWorkflowErrorDetailsInProgress;

/* selectors for publications */
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getPublications = (state) => state.eventDetails.publications;

/* selectors for statistics */
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const hasStatistics = (state) =>
	state.eventDetails.statistics.length > 0;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getStatistics = (state) => state.eventDetails.statistics;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const hasStatisticsError = (state) =>
	state.eventDetails.hasStatisticsError;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingStatistics = (state) =>
	state.eventDetails.fetchingStatisticsInProgress;
