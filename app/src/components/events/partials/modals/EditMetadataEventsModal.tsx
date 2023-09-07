import React, { useEffect, useState } from "react";
import { Formik, Field } from "formik";
import { useTranslation } from "react-i18next";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import { connect } from "react-redux";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
	getCurrentLanguageInformation,
	hasAccess,
} from "../../../../utils/utils";
import cn from "classnames";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderField' was re... Remove this comment to see the full error message
import RenderField from "../../../shared/wizard/RenderField";
import {
	postEditMetadata,
	updateBulkMetadata,
} from "../../../../thunks/eventThunks";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderMultiField' w... Remove this comment to see the full error message
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";

// Get info about the current language and its date locale
const currentLanguage = getCurrentLanguageInformation();

/**
 * This component manges the edit metadata bulk action
 */
const EditMetadataEventsModal = ({
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
	close,
// @ts-expect-error TS(7031): Binding element 'selectedRows' implicitly has an '... Remove this comment to see the full error message
	selectedRows,
// @ts-expect-error TS(7031): Binding element 'updateBulkMetadata' implicitly ha... Remove this comment to see the full error message
	updateBulkMetadata,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();

	const [selectedEvents] = useState(selectedRows);
	const [metadataFields, setMetadataFields] = useState({});
	const [loading, setLoading] = useState(true);
	const [fatalError, setFatalError] = useState({});
	const [fetchedValues, setFetchedValues] = useState(null);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);

// @ts-expect-error TS(7034): Variable 'eventIds' implicitly has type 'any[]' in... Remove this comment to see the full error message
			let eventIds = [];
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
			selectedEvents.forEach((event) => eventIds.push(event.id));

			// Get merged metadata from backend
// @ts-expect-error TS(7005): Variable 'eventIds' implicitly has an 'any[]' type... Remove this comment to see the full error message
			const responseMetadataFields = await postEditMetadata(eventIds);

			// Set fatal error if response contains error
			if (!!responseMetadataFields.fatalError) {
				setFatalError(responseMetadataFields);
			} else {
				// Set initial values and save metadata field infos in state
				let initialValues = getInitialValues(responseMetadataFields);
// @ts-expect-error TS(2345): Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
				setFetchedValues(initialValues);
				setMetadataFields(responseMetadataFields);
			}
			setLoading(false);
		}
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		const response = updateBulkMetadata(metadataFields, values);
		console.info(response);
		close();
	};

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onChangeSelected = (e, fieldId) => {
		let selected = e.target.checked;
		let fields = metadataFields;
// @ts-expect-error TS(2339): Property 'mergedMetadata' does not exist on type '... Remove this comment to see the full error message
		fields.mergedMetadata = metadataFields.mergedMetadata.map((field) => {
			if (field.id === fieldId) {
				return {
					...field,
					selected: selected,
				};
			} else {
				return field;
			}
		});

		setMetadataFields(fields);
	};

	// Check if value of metadata field is changed
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
	const isTouchedOrSelected = (field, formikValues) => {
		if (field.selected) {
			return true;
		}

// @ts-expect-error TS(2531): Object is possibly 'null'.
		if (fetchedValues[field.id] !== formikValues[field.id]) {
			let fields = metadataFields;
// @ts-expect-error TS(2339): Property 'mergedMetadata' does not exist on type '... Remove this comment to see the full error message
			fields.mergedMetadata = metadataFields.mergedMetadata.map((f) => {
				if (f.id === field.id) {
					return {
						...f,
						selected: true,
					};
				} else {
					return f;
				}
			});

			setMetadataFields(fields);

			return true;
		}
		return false;
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section className="modal wizard modal-animation">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>{t("BULK_ACTIONS.EDIT_EVENTS_METADATA.CAPTION")}</h2>
				</header>

				{/* Loading spinner */}
				{loading && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="loading">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i className="fa fa-spinner fa-spin fa-2x fa-fw" />
							</div>
						</div>
					</div>
				)}

				{/* Fatal error view */}
// @ts-expect-error TS(2339): Property 'fatalError' does not exist on type '{}'.
				{!!fatalError.fatalError && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="alert sticky error">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>
										{t("BULK_ACTIONS.EDIT_EVENTS_METADATA.FATAL_ERROR", {
// @ts-expect-error TS(2339): Property 'fatalError' does not exist on type '{}'.
											fatalError: fatalError.fatalError,
										})}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* todo: Request Errors View and Update Errors View (not quite sure what this is used for) */}

// @ts-expect-error TS(2339): Property 'fatalError' does not exist on type '{}'.
				{!loading && fatalError.fatalError === undefined && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<MuiPickersUtilsProvider
						utils={DateFnsUtils}
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
						locale={currentLanguage.dateLocale}
					>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Formik
// @ts-expect-error TS(2322): Type 'null' is not assignable to type 'FormikValue... Remove this comment to see the full error message
							initialValues={fetchedValues}
							onSubmit={(values) => handleSubmit(values)}
						>
							{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="obj header-description">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<span>
														{t(
															"BULK_ACTIONS.EDIT_EVENTS_METADATA.EDIT.DESCRIPTION"
														)}
													</span>
												</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="obj tbl-details">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<span>
															{t(
																"BULK_ACTIONS.EDIT_EVENTS_METADATA.EDIT.TABLE.CAPTION"
															)}
														</span>
													</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th className="small" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th>
																		{t(
																			"BULK_ACTIONS.EDIT_EVENTS_METADATA.EDIT.TABLE.FIELDS"
																		)}
																	</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th>
																		{t(
																			"BULK_ACTIONS.EDIT_EVENTS_METADATA.EDIT.TABLE.VALUES"
																		)}
																	</th>
																</tr>
															</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tbody>
// @ts-expect-error TS(2339): Property 'mergedMetadata' does not exist on type '... Remove this comment to see the full error message
																{metadataFields.mergedMetadata.map(
// @ts-expect-error TS(7006): Parameter 'metadata' implicitly has an 'any' type.
																	(metadata, key) =>
																		!metadata.readOnly && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<tr
																				key={key}
																				className={cn({
																					info: metadata.differentValues,
																				})}
																			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																					<input
																						type="checkbox"
																						name="changes"
																						checked={isTouchedOrSelected(
																							metadata,
																							formik.values
																						)}
																						disabled={
																							(!metadata.differentValues &&
																								!metadata.selected) ||
																							(metadata.required &&
																								!metadata.selected)
																						}
																						onChange={(e) =>
																							onChangeSelected(e, metadata.id)
																						}
																						className="child-cbox"
																					/>
																				</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																					<span>{t(metadata.label)}</span>
																					{metadata.required && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<i className="required">*</i>
																					)}
																				</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<td className="editable ng-isolated-scope">
																					{/* Render single value or multi value input */}
																					{metadata.type === "mixed_text" &&
																					!!metadata.collection &&
																					metadata.collection.length !== 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<Field
																							name={metadata.id}
																							fieldInfo={metadata}
																							showCheck
																							component={RenderMultiField}
																						/>
																					) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<Field
																							name={metadata.id}
																							metadataField={metadata}
																							showCheck
																							component={RenderField}
																						/>
																					)}
																				</td>
																			</tr>
																		)
																)}
															</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Buttons for cancel and submit */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<button
											type="submit"
											onClick={() => formik.handleSubmit()}
											disabled={!(formik.dirty && formik.isValid)}
											className={cn("submit", {
												active:
													formik.dirty &&
													formik.isValid &&
													hasAccess(
														"ROLE_UI_EVENTS_DETAILS_METADATA_EDIT",
														user
													),
												inactive: !(
													formik.dirty &&
													formik.isValid &&
													hasAccess(
														"ROLE_UI_EVENTS_DETAILS_METADATA_EDIT",
														user
													)
												),
											})}
										>
											{t("WIZARD.UPDATE")}
										</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<button onClick={() => close()} className="cancel">
											{t("CLOSE")}
										</button>
									</footer>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="btm-spacer" />
								</>
							)}
						</Formik>
					</MuiPickersUtilsProvider>
				)}
			</section>
		</>
	);
};

// @ts-expect-error TS(7006): Parameter 'metadataFields' implicitly has an 'any'... Remove this comment to see the full error message
const getInitialValues = (metadataFields) => {
	// Transform metadata fields provided by backend (saved in redux)
	let initialValues = {};
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
	metadataFields.mergedMetadata.forEach((field) => {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
		initialValues[field.id] = field.value;
	});

	return initialValues;
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	selectedRows: getSelectedRows(state),
	user: getUserInformation(state),
});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'metadataFields' implicitly has an 'any'... Remove this comment to see the full error message
	updateBulkMetadata: (metadataFields, values) =>
		dispatch(updateBulkMetadata(metadataFields, values)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditMetadataEventsModal);
