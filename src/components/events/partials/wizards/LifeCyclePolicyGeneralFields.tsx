import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FieldArray, FieldProps, FormikProps } from "formik";
import { Field } from "../../../shared/Field";
import RenderField from "../../../shared/wizard/RenderField";
import { ALL_TARGET_FILTER_TYPES, LifeCyclePolicy, TargetFilter } from "../../../../slices/lifeCycleSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getLifeCyclePolicyActions, getLifeCyclePolicyTargetTypes, getLifeCyclePolicyTimings } from "../../../../selectors/lifeCycleDetailsSelectors";
import DropDown from "../../../shared/DropDown";
import { getEventMetadata } from "../../../../selectors/eventSelectors";
import { fetchEventMetadata } from "../../../../slices/eventSlice";

/**
 * This component renders the metadata page for new events and series in the wizards.
 */
// interface RequiredFormProps {
// sourceMode: string,
// processingWorkflow: string,
// }

const LifeCyclePolicyGeneralFields = <T extends LifeCyclePolicy & {targetFiltersArray: (TargetFilter & { filter: string })[]}>({
	formik,
	isNew,
}: {
	formik: FormikProps<T>,
	isNew: boolean
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const actions = useAppSelector(state => getLifeCyclePolicyActions(state));
	const targetTypes = useAppSelector(state => getLifeCyclePolicyTargetTypes(state));
	const timings = useAppSelector(state => getLifeCyclePolicyTimings(state));
	const metadataFields = useAppSelector(state => getEventMetadata(state));

	useEffect(() => {
		dispatch(fetchEventMetadata())
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const ADDITIONAL_TARGET_FILTER_KEYS_EVENTS = [
		{
			id: 'series_name',
			type: 'text',
			collection: undefined
		},
		{
			id: 'presenter',
			type: 'text',
			collection: undefined
		},
		{
			id: 'start_date',
			type: 'date',
			collection: undefined
		},
		{
			id: 'end_date',
			type: 'date',
			collection: undefined
		},
		{
			id: 'created',
			type: 'date',
			collection: undefined
		},
		{
			id: 'source',
			type: 'text',
			collection: undefined
		},
		{
			id: 'rights',
			type: 'text',
			collection: undefined
		},
		{
			id: 'location',
			type: 'text',
			collection: undefined
		},
	]

	const eventFilterOptions: { id: string, type: string, collection?: unknown }[] = []
	for (const field of metadataFields.fields) {
		eventFilterOptions.push(field)
	}
	for (const field of ADDITIONAL_TARGET_FILTER_KEYS_EVENTS) {
		eventFilterOptions.push(field)
	}

	const createTargetFilter = (): TargetFilter => {
		return {
			value: "",
			type: "SEARCH",
			must: true
		}
	}

	const filterOptions = (targetType: string) => {
		switch (targetType) {
			case "EVENT":
				return eventFilterOptions
			default:
				return []
		}
	}

	return (
		<>
			<div className="obj tbl-list">
				<header className="no-expand">{t("LIFECYCLE.POLICIES.NEW.GENERAL.CAPTION")}</header>
				<table className="main-tbl">
					<tbody>

					<tr>
						<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TITLE")}<i className="required">*</i></td>
						<td className="editable">
							<Field
									type="text"
									name="title"
									metadataField={{
										type: "text",
										required: true,
										collection: undefined,
										id: undefined,
									}}
									component={RenderField}
									isFirstField
								/>
							</td>
					</tr>
					<tr>
						<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ISACTIVE")}<i className="required">*</i></td>
						<td className="editable">
							<Field
								type="checkbox"
								name="isActive"
								metadataField={{
									type: "boolean",
									required: true,
									collection: undefined,
									id: undefined
								}}
								component={RenderField}
							/>
						</td>
					</tr>
					{!isNew &&
						<tr>
							<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ISCREATEDFROMCONFIG")}</td>
							<td className="editable">
								<Field
									type="checkbox"
									name="isCreatedFromConfig"
									disabled={true}
								/>
							</td>
						</tr>
					}
					<tr>
						<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TARGETTYPE")}<i className="required">*</i></td>
						<td className="editable">
							<Field
								name="targetType"
								metadataField={{
									type: "text",
									required: true,
									collection: targetTypes.map((element) => ({ value: element, name: element }) ),
									id: "language",
								}}
								component={RenderField}
							/>
						</td>
					</tr>
					<tr>
						<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TIMING")}<i className="required">*</i></td>
						<td className="editable">
							<Field
								name={"timing"}
								metadataField={{
									type: "text",
									required: true,
									collection: timings.map((element) => ({ value: element, name: element }) ),
									id: "language",
								}}
								component={RenderField}
							/>
						</td>
					</tr>
					<tr>
						<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ACTION")}<i className="required">*</i></td>
						<td className="editable">
							<Field
								name={"action"}
								metadataField={{
									type: "text",
									required: true,
									collection: actions.map((element) => ({ value: element, name: element }) ),
									id: "language"
								}}
								component={RenderField}
							/>
						</td>
					</tr>
					<tr>
						<td>
							{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ACTIONDATE")}
							{formik.values.timing === "SPECIFIC_DATE" && <i className="required">*</i>}
						</td>
						<td className="editable">
							<Field
								name={"actionDate"}
								// component={DateTimePickerField}
								metadataField={{
									type: "date",
									required: false,
									collection: undefined,
									id: undefined
								}}
								component={RenderField}
							/>
						</td>
					</tr>
					<tr>
						<td>
							{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.CRONTRIGGER")}
							{formik.values.timing === "REPEATING" && <i className="required">*</i>}
						</td>
						<td>
							<Field
								type="cron"
								name="cronTrigger"
								metadataField={{
									type: "cron",
									required: false,
									collection: undefined,
									id: undefined
								}}
								component={RenderField}
							/>
						</td>
					</tr>
					{!isNew &&
						<tr>
							<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ID")}</td>
							<td className="editable">
								{formik.values.id}
							</td>
						</tr>
					}

					</tbody>
				</table>
			</div>

			<div></div>


			{/* Target Filters like the ACLs
						Can we make "key" a dropdown?
						Type of "Value" should depend on key, e.g. for key "start_date" show a date picker
			*/}
			<div className="obj tbl-list">
				<header>
					{ t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TARGETFILTERS.CAPTION") }
				</header>

				<table className="main-tbl">
					{/* column headers */}
					<thead>
						<tr>
							<th>
								{ t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TARGETFILTERS.FILTER") }
							</th>
							<th className="fit">
								{ t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TARGETFILTERS.VALUE") }
							</th>
							<th className="fit">
								{ t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TARGETFILTERS.TYPE") }
							</th>
							<th className="fit">
								{ t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TARGETFILTERS.MUST") }
							</th>
							<th className="fit">
								{ t("EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.ACTION") }
							</th>
						</tr>
					</thead>

					<tbody>
						<FieldArray name="targetFiltersArray">
							{({ replace, remove, push }) => (
								<>
									{Object.entries(formik.values.targetFiltersArray).map(([key, filter], index) => {
										return(
											<tr key={index}>
												<td className="editable">
													<Field
														type="time"
														name={`targetFiltersArray.${key}.filter`}
														value={filter.filter}
														values={filterOptions(formik.values.targetType).map(e => e.id)}
														creatable={true}
														clearFieldName={`targetFiltersArray.${key}.value`}
														component={DropdownField}
													/>
												</td>
												<td className="editable">
													<Field
														name={`targetFiltersArray.${key}.value`}
														metadataField={{
															type: getTargetFilterRenderType(filter.filter, filterOptions(formik.values.targetType)),
															required: false,
															collection: getTargetFilterRenderCollection(filter.filter, filterOptions(formik.values.targetType)),
															id: undefined
														}}
														component={RenderField}
													/>
												</td>
												<td className="editable">
													<Field
														name={`targetFiltersArray.${key}.type`}
														value={filter.type}
														values={ALL_TARGET_FILTER_TYPES}
														component={DropdownField}
													/>
												</td>
												<td className="editable">
													<Field
														type="checkbox"
														name={`targetFiltersArray.${key}.must`}
													/>
												</td>
												<td>
													<button
														onClick={() => remove(index)}
														className="button-like-anchor remove"
													/>
												</td>
											</tr>
										)
									})}
									<tr>
										<td colSpan={5}>
											<button
												onClick={() =>
													push(createTargetFilter())
												}
												className="button-like-anchor"
											>
												+{" "}
												{t(
													"LIFECYCLE.POLICIES.DETAILS.GENERAL.TARGETFILTERS.NEW"
												)}
											</button>
										</td>
									</tr>
								</>
							)}
						</FieldArray>
					</tbody>
				</table>
			</div>

			{formik.values.action === "START_WORKFLOW" &&
				<div className="obj tbl-list">
					<header>
						{ t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ACTIONPARAMETERS.CAPTION") }
					</header>
						<table className="main-tbl">
							<tbody>
								<tr>
									<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ACTIONPARAMETERS.WORKFLOW_ID")}<i className="required">*</i></td>
									<td>
									<Field
										type="text"
										name={`actionParameters.workflowId`}
										metadataField={{
											type: "text",
											required: true,
											collection: undefined,
											id: undefined,
										}}
										component={RenderField}
									/>
									</td>
								</tr>
								<tr>
								<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ACTIONPARAMETERS.WORKFLOW_PARAMETERS")}</td>
									<td>
										<Field
											type="text"
											// component="textarea"
											name="actionParameters.workflowParameters"
											className="editable vertical-resize"

											metadataField={{
												type: "text_long",
												required: false,
												collection: undefined,
												id: undefined,
											}}
											component={RenderField}
										/>
										{/* Using our "WorkflowConfig" component would be nice, but it does not allow us to add or remove config options */}
										{/* <WorkflowConfig
											// @ts-expect-error TS(7006):
											formik={formik}
											configPanel={formik.values.workflowParameters}
											description={""}
										/> */}
									</td>
								</tr>
							</tbody>
						</table>
				</div>
			}
		</>
	);
};


export default LifeCyclePolicyGeneralFields;

const DropdownField = ({
	field,
	form: { setFieldValue },
	value,
	values,
	clearFieldName,
	creatable = false
}: {
	field: FieldProps["field"]
	form: FieldProps["form"]
	value: string,
	values: string[]
	clearFieldName: string
	creatable: boolean
}) => {
	const { t } = useTranslation();

	return (
		<DropDown
			value={field.value}
			text={value}
			options={values ? values : []}
			type={"policyAction"}
			required={true}
			handleChange={(element) => {
				setFieldValue(clearFieldName, undefined)
				element && setFieldValue(field.name, element.value)
			}}
			placeholder={`-- ${t("SELECT_NO_OPTION_SELECTED")} --`}
			creatable={creatable}
		/>
	)
};

const getTargetFilterRenderType = (filterName: string, targetFilterOptions: { id: string, type: string, collection?: unknown }[] ) => {
	const option = targetFilterOptions.find(e => e.id === filterName);
	if (option === undefined) {
		return "text";
	}
	// Simplify types like "long_text" or "mixed_text"
	if (option.type.includes("text")) {
		return "text";
	}
	return option.type;
}

const getTargetFilterRenderCollection = (filterName: string, targetFilterOptions: { id: string, type: string, collection?: unknown }[] ) => {
	const option = targetFilterOptions.find(e => e.id === filterName);
	return option !== undefined ? option.collection : undefined
}
