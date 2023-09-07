import React from "react";
import { useTranslation } from "react-i18next";
import {
	getAssetUploadOptions,
	getEventMetadata,
	getExtendedEventMetadata,
} from "../../../../selectors/eventSelectors";
import { connect } from "react-redux";
import { getWorkflowDef } from "../../../../selectors/workflowSelectors";
// @ts-expect-error TS(6142): Module './summaryTables/MetadataSummaryTable' was ... Remove this comment to see the full error message
import MetadataSummaryTable from "./summaryTables/MetadataSummaryTable";
// @ts-expect-error TS(6142): Module './summaryTables/MetadataExtendedSummaryTab... Remove this comment to see the full error message
import MetadataExtendedSummaryTable from "./summaryTables/MetadataExtendedSummaryTable";
// @ts-expect-error TS(6142): Module './summaryTables/AccessSummaryTable' was re... Remove this comment to see the full error message
import AccessSummaryTable from "./summaryTables/AccessSummaryTable";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";

/**
 * This component renders the summary page for new events in the new event wizard.
 */
const NewEventSummary = ({
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'metaDataExtendedHidden' implicitl... Remove this comment to see the full error message
	metaDataExtendedHidden,
// @ts-expect-error TS(7031): Binding element 'assetUploadHidden' implicitly has... Remove this comment to see the full error message
	assetUploadHidden,
// @ts-expect-error TS(7031): Binding element 'metadataEvents' implicitly has an... Remove this comment to see the full error message
	metadataEvents,
// @ts-expect-error TS(7031): Binding element 'extendedMetadata' implicitly has ... Remove this comment to see the full error message
	extendedMetadata,
// @ts-expect-error TS(7031): Binding element 'workflowDef' implicitly has an 'a... Remove this comment to see the full error message
	workflowDef,
// @ts-expect-error TS(7031): Binding element 'uploadAssetOptions' implicitly ha... Remove this comment to see the full error message
	uploadAssetOptions,
}) => {
	const { t } = useTranslation();

	// Get upload assets that are not of type track
	const uploadAssetsOptionsNonTrack = uploadAssetOptions.filter(
// @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
		(asset) => asset.type !== "track"
	);

	// upload asset that user has provided
// @ts-expect-error TS(7034): Variable 'uploadAssetsNonTrack' implicitly has typ... Remove this comment to see the full error message
	let uploadAssetsNonTrack = [];
	for (let i = 0; uploadAssetsOptionsNonTrack.length > i; i++) {
		let fieldValue = formik.values[uploadAssetsOptionsNonTrack[i].id];
		if (!!fieldValue) {
// @ts-expect-error TS(7005): Variable 'uploadAssetsNonTrack' implicitly has an ... Remove this comment to see the full error message
			uploadAssetsNonTrack = uploadAssetsNonTrack.concat({
				name: uploadAssetsOptionsNonTrack[i].id,
				translate: !!uploadAssetsOptionsNonTrack[i].displayOverride
					? t(uploadAssetsOptionsNonTrack[i].displayOverride)
					: t(uploadAssetsOptionsNonTrack[i].title),
				type: uploadAssetsOptionsNonTrack[i].type,
				flavorType: uploadAssetsOptionsNonTrack[i].flavorType,
				flavorSubType: uploadAssetsOptionsNonTrack[i].flavorSubType,
				value: fieldValue,
			});
		}
	}

	// Get additional information about chosen workflow definition
	const workflowDefinition = workflowDef.find(
// @ts-expect-error TS(7006): Parameter 'workflow' implicitly has an 'any' type.
		(workflow) => workflow.id === formik.values.processingWorkflow
	);

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
						{/*Summary metadata*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<MetadataSummaryTable
							metadataFields={metadataEvents.fields}
							formikValues={formik.values}
							header={"EVENTS.EVENTS.NEW.METADATA.CAPTION"}
						/>

						{/*Summary metadata extended*/}
						{!metaDataExtendedHidden ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<MetadataExtendedSummaryTable
								extendedMetadata={extendedMetadata}
								formikValues={formik.values}
								formikInitialValues={formik.initialValues}
								header={"EVENTS.EVENTS.NEW.METADATA_EXTENDED.CAPTION"}
							/>
						) : null}

						{/*Summary upload assets*/}
						{/*Show only if asset upload page is not hidden, the sourceMode is UPLOAD and the there
                        are actually upload assets provided by the user*/}
						{!assetUploadHidden &&
						formik.values.sourceMode === "UPLOAD" &&
						uploadAssetsNonTrack.length > 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<header className="no-expand">
									{t("EVENTS.EVENTS.NEW.UPLOAD_ASSET.CAPTION")}
								</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tbody>
											{/*Insert row for each upload asset user has provided*/}
											{uploadAssetsNonTrack.map((asset, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
														{asset.translate}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<span className="ui-helper-hidden">
                              { // eslint-disable-next-line react/jsx-no-comment-textnodes
                              } ({asset.type} "{asset.flavorType}//
															{asset.flavorSubType}")
														</span>
													</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>{asset.value.name}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						) : null}

						{/* Summary source */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header className="no-expand">
								{t("EVENTS.EVENTS.NEW.SOURCE.CAPTION")}
							</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container">
								{/*Summary source mode UPLOAD*/}
								{formik.values.sourceMode === "UPLOAD" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tbody>
											{/*Insert row for each upload asset of type track user has provided*/}
// @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
											{formik.values.uploadAssetsTrack.map((asset, key) =>
												!!asset.file ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
															{t(
																asset.title + ".SHORT",
																asset["displayOverride.SHORT"]
															)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<span className="ui-helper-hidden">
                                { // eslint-disable-next-line react/jsx-no-comment-textnodes
                                } ({asset.type} "{asset.flavorType}//
																{asset.flavorSubType}")
															</span>
														</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>{asset.file[0].name}</td>
													</tr>
												) : null
											)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_DATE")}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{t("dateFormats.date.short", {
														date: new Date(formik.values.startDate),
													})}
												</td>
											</tr>
										</tbody>
									</table>
								)}
								{/*Summary source mode SCHEDULE-SINGLE/SCHEDULE-MULTIPLE*/}
								{(formik.values.sourceMode === "SCHEDULE_SINGLE" ||
									formik.values.sourceMode === "SCHEDULE_MULTIPLE") && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_DATE")}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{t("dateFormats.date.short", {
														date: formik.values.scheduleStartDate,
													})}
												</td>
											</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.START_TIME")}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{formik.values.scheduleStartHour}:
													{formik.values.scheduleStartMinute}
												</td>
											</tr>
											{formik.values.sourceMode === "SCHEDULE_MULTIPLE" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
														{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.END_DATE")}
													</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
														{t("dateFormats.date.short", {
															date: formik.values.scheduleEndDate,
														})}
													</td>
												</tr>
											)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.END_TIME")}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{formik.values.scheduleEndHour}:
													{formik.values.scheduleEndMinute}
												</td>
											</tr>
											{formik.values.sourceMode === "SCHEDULE_MULTIPLE" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
														{t(
															"EVENTS.EVENTS.NEW.SOURCE.SCHEDULE_MULTIPLE.WEEKDAYS"
														)}
													</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
														{formik.values.repeatOn
// @ts-expect-error TS(7006): Parameter 'day' implicitly has an 'any' type.
															.map((day) =>
																t("EVENTS.EVENTS.NEW.WEEKDAYSLONG." + day)
															)
															.join(", ")}
													</td>
												</tr>
											)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{t("EVENTS.EVENTS.NEW.SOURCE.DATE_TIME.DURATION")}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{formik.values.scheduleDurationHours}:
													{formik.values.scheduleDurationMinutes}
												</td>
											</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{t("EVENTS.EVENTS.NEW.SOURCE.PLACEHOLDER.LOCATION")}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{formik.values.location}</td>
											</tr>
											{!!formik.values.deviceInputs && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>{t("EVENTS.EVENTS.NEW.SUMMARY.SOURCE.INPUT")}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>{formik.values.deviceInputs.join(", ")}</td>
												</tr>
											)}
										</tbody>
									</table>
								)}
							</div>
						</div>

						{/* Summary processing configuration */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header className="no-expand">
								{t("EVENTS.EVENTS.NEW.PROCESSING.CAPTION")}
							</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<td>{t("EVENTS.EVENTS.NEW.PROCESSING.WORKFLOW")}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<td>
											{!!workflowDefinition ? workflowDefinition.title : ""}
										</td>
									</tr>
									{/* Repeat entry for each configuration key/value pair */}
									{Object.keys(formik.values.configuration).map(
										(config, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{config}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{formik.values.configuration[config].toString()}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>

						{/*Summary access configuration*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<AccessSummaryTable
							policies={formik.values.acls}
							header={"EVENTS.EVENTS.NEW.ACCESS.CAPTION"}
						/>
					</div>
				</div>
			</div>

			{/* Button for navigation to next page and previous page */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<WizardNavigationButtons
				isLast
				previousPage={previousPage}
				formik={formik}
			/>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	metadataEvents: getEventMetadata(state),
	extendedMetadata: getExtendedEventMetadata(state),
	workflowDef: getWorkflowDef(state),
	uploadAssetOptions: getAssetUploadOptions(state),
});

export default connect(mapStateToProps)(NewEventSummary);
