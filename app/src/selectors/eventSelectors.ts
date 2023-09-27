/**
 * This file contains selectors regarding events
 */

export const getEvents = (state: any) => state.events.results;
export const getVisibilityEventColumns = (state: any) => state.events.columns;
export const isShowActions = (state: any) => state.events.showActions;
export const isLoading = (state: any) => state.events.isLoading;
export const getEventMetadata = (state: any) => state.events.metadata;
export const getExtendedEventMetadata = (state: any) => state.events.extendedMetadata;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isLoadingScheduling = (state) =>
	state.events.schedulingInfo.isLoading;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSchedulingEditedEvents = (state) =>
	state.events.schedulingInfo.editedEvents;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSchedulingSeriesOptions = (state) =>
	state.events.schedulingInfo.seriesOptions;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getTotalEvents = (state) => state.events.total;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetUploadOptions = (state) => state.events.uploadAssetOptions;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingAssetUploadOptions = (state) =>
	state.events.isFetchingAssetUploadOptions;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getAssetUploadWorkflow = (state) =>
	state.events.uploadAssetWorkflow;
