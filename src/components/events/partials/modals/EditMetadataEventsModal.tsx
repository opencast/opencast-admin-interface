import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Field } from "../../../shared/Field";
import { useTranslation } from "react-i18next";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import {
	hasAccess,
} from "../../../../utils/utils";
import cn from "classnames";
import RenderField from "../../../shared/wizard/RenderField";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	MetadataFieldSelected,
	postEditMetadata,
	updateBulkMetadata,
} from "../../../../slices/eventSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";
import { isEvent } from "../../../../slices/tableSlice";

/**
 * This component manges the edit metadata bulk action
 */
const EditMetadataEventsModal = ({
	close,
}: {
	close: () => void
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const selectedRows = useAppSelector(state => getSelectedRows(state));

	const [selectedEvents] = useState(selectedRows);
	const [metadataFields, setMetadataFields] = useState<{
		merged: string[],
		mergedMetadata: MetadataFieldSelected[],
		notFound?: string[],
		runningWorkflow?: string[],
	}>({
		merged: [],
		mergedMetadata: []
	});
	const [loading, setLoading] = useState(true);
	const [fatalError, setFatalError] = useState<string | undefined>(undefined);
	const [fetchedValues, setFetchedValues] = useState<{ [key: string]: string | string[] }>({});

	const user = useAppSelector(state => getUserInformation(state));

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => close(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[close],
  	);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);

			let eventIds: string[] = [];
			selectedEvents.forEach((event) => isEvent(event) &&  eventIds.push(event.id));

			// Get merged metadata from backend
			// const responseMetadataFields = await dispatch(postEditMetadata(eventIds))
			await dispatch(postEditMetadata(eventIds))
			.then(unwrapResult)
			.then((result) => {
				// Set initial values and save metadata field infos in state
				let initialValues = getInitialValues(result.mergedMetadata);
				setFetchedValues(initialValues);
				setMetadataFields({
					merged: result.merged,
					mergedMetadata: result.mergedMetadata,
					notFound: result.notFound,
					runningWorkflow: result.runningWorkflow,
				});
			})
			// Set fatal error if response contains error
			.catch((e: Error) => {
				setFatalError(e.message);
			});
			setLoading(false);
		}
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = (values: { [key: string]: unknown }) => {
		const response = dispatch(updateBulkMetadata({metadataFields, values}));
		console.info(response);
		close();
	};

	const onChangeSelected = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
		let selected = e.target.checked;
		let fields = metadataFields;
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
	const isTouchedOrSelected = (field: MetadataFieldSelected, formikValues: { [key: string]: string | string[] }) => {
		if (field.selected) {
			return true;
		}

		let fetched = fetchedValues[field.id];
		let inForm = formikValues[field.id];
		let same = false;
		if (fetched === inForm) {
			same = true;
		} else if (Array.isArray(fetched) && Array.isArray(inForm)) {
			same = fetched.length === inForm.length && fetched.every((e, i) => e === inForm[i]);
		}
		if (!same) {
			let fields = metadataFields;
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
				{!!fatalError && (
					<div className="modal-content">
						<div className="modal-body">
							<div className="row">
								<div className="alert sticky error">
									<p>
										{t("BULK_ACTIONS.EDIT_EVENTS_METADATA.FATAL_ERROR", {
											fatalError: fatalError,
										})}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* todo: Request Errors View and Update Errors View (not quite sure what this is used for) */}

				{!loading && fatalError === undefined && (
					<Formik
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
															{metadataFields.mergedMetadata.map(
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
				)}
			</section>
		</>
	);
};

const getInitialValues = (metadataFields: MetadataFieldSelected[]) => {
	// Transform metadata fields provided by backend (saved in redux)
	let initialValues: { [key: string]: string | string[] } = {};
	metadataFields.forEach((field) => {
		initialValues[field.id] = field.value;
	});

	return initialValues;
};

export default EditMetadataEventsModal;
