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
import RenderField from "../../../shared/wizard/RenderField";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	postEditMetadata,
	updateBulkMetadata,
} from "../../../../slices/eventSlice";
import { unwrapResult } from "@reduxjs/toolkit";

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
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [selectedEvents] = useState(selectedRows);
	const [metadataFields, setMetadataFields] = useState({});
	const [loading, setLoading] = useState(true);
	const [fatalError, setFatalError] = useState({});
	const [fetchedValues, setFetchedValues] = useState(null);

	const user = useAppSelector(state => getUserInformation(state));

	useEffect(() => {
		async function fetchData() {
			setLoading(true);

// @ts-expect-error TS(7034): Variable 'eventIds' implicitly has type 'any[]' in... Remove this comment to see the full error message
			let eventIds = [];
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
			selectedEvents.forEach((event) => eventIds.push(event.id));

			// Get merged metadata from backend
// @ts-expect-error TS(7005): Variable 'eventIds' implicitly has an 'any[]' type... Remove this comment to see the full error message
			// const responseMetadataFields = await dispatch(postEditMetadata(eventIds))
			await dispatch(postEditMetadata(eventIds))
			.then(unwrapResult)
			.then((result) => {
				// Set fatal error if response contains error
				if (!!result.fatalError) {
					setFatalError(result);
				} else {
					// Set initial values and save metadata field infos in state
					let initialValues = getInitialValues(result);
	// @ts-expect-error TS(2345): Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
					setFetchedValues(initialValues);
					setMetadataFields(result);
				}
			});
			setLoading(false);
		}
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		const response = dispatch(updateBulkMetadata({metadataFields, values}));
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
		<>
			<div className="modal-animation modal-overlay" />
			<section className="modal wizard modal-animation">
				<header>
					<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
					<h2>{t("BULK_ACTIONS.EDIT_EVENTS_METADATA.CAPTION")}</h2>
				</header>

				{/* Loading spinner */}
				{loading && (
					<div className="modal-content">
						<div className="modal-body">
							<div className="loading">
								<i className="fa fa-spinner fa-spin fa-2x fa-fw" />
							</div>
						</div>
					</div>
				)}

				{/* Fatal error view */}
{/* @ts-expect-error TS(2339): Property 'fatalError' does not exist on type '{}'. */}
				{!!fatalError.fatalError && (
					<div className="modal-content">
						<div className="modal-body">
							<div className="row">
								<div className="alert sticky error">
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

{/* @ts-expect-error TS(2339): Property 'fatalError' does not exist on type '{}'. */}
				{!loading && fatalError.fatalError === undefined && (
					<MuiPickersUtilsProvider
						utils={DateFnsUtils}
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
						locale={currentLanguage.dateLocale}
					>
						<Formik
// @ts-expect-error TS(2322): Type 'null' is not assignable to type 'FormikValue... Remove this comment to see the full error message
							initialValues={fetchedValues}
							onSubmit={(values) => handleSubmit(values)}
						>
							{(formik) => (
								<>
									<div className="modal-content">
										<div className="modal-body">
											<div className="full-col">
												<div className="obj header-description">
													<span>
														{t(
															"BULK_ACTIONS.EDIT_EVENTS_METADATA.EDIT.DESCRIPTION"
														)}
													</span>
												</div>
												<div className="obj tbl-details">
													<header>
														<span>
															{t(
																"BULK_ACTIONS.EDIT_EVENTS_METADATA.EDIT.TABLE.CAPTION"
															)}
														</span>
													</header>
													<div className="obj-container">
														<table className="main-tbl">
															<thead>
																<tr>
																	<th className="small" />
																	<th>
																		{t(
																			"BULK_ACTIONS.EDIT_EVENTS_METADATA.EDIT.TABLE.FIELDS"
																		)}
																	</th>
																	<th>
																		{t(
																			"BULK_ACTIONS.EDIT_EVENTS_METADATA.EDIT.TABLE.VALUES"
																		)}
																	</th>
																</tr>
															</thead>
															<tbody>
{/* @ts-expect-error TS(2339): Property 'mergedMetadata' does not exist on type '... Remove this comment to see the full error message */}
																{metadataFields.mergedMetadata.map(
// @ts-expect-error TS(7006): Parameter 'metadata' implicitly has an 'any' type.
																	(metadata, key) =>
																		!metadata.readOnly && (
																			<tr
																				key={key}
																				className={cn({
																					info: metadata.differentValues,
																				})}
																			>
																				<td>
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
																				<td>
																					<span>{t(metadata.label)}</span>
																					{metadata.required && (
																						<i className="required">*</i>
																					)}
																				</td>
																				<td className="editable ng-isolated-scope">
																					{/* Render single value or multi value input */}
																					{metadata.type === "mixed_text" &&
																					!!metadata.collection &&
																					metadata.collection.length !== 0 ? (
																						<Field
																							name={metadata.id}
																							fieldInfo={metadata}
																							showCheck
																							component={RenderMultiField}
																						/>
																					) : (
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
									<footer>
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
										<button onClick={() => close()} className="cancel">
											{t("CLOSE")}
										</button>
									</footer>

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
});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditMetadataEventsModal);
