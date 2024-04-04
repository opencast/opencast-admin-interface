import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import NewEventSummary from "./NewEventSummary";
import NewAssetUploadPage from "../ModalTabsAndPages/NewAssetUploadPage";
import NewMetadataExtendedPage from "../ModalTabsAndPages/NewMetadataExtendedPage";
import NewMetadataPage from "../ModalTabsAndPages/NewMetadataPage";
import NewAccessPage from "../ModalTabsAndPages/NewAccessPage";
import NewProcessingPage from "../ModalTabsAndPages/NewProcessingPage";
import NewSourcePage from "../ModalTabsAndPages/NewSourcePage";
import { NewEventSchema } from "../../../../utils/validate";
import WizardStepperEvent from "../../../shared/wizard/WizardStepperEvent";
import { getInitialMetadataFieldValues } from "../../../../utils/resourceUtils";
import { sourceMetadata } from "../../../../configs/sourceConfig";
import { initialFormValuesNewEvents } from "../../../../configs/modalConfig";
import {
	getAssetUploadOptions,
	getEventMetadata,
	getExtendedEventMetadata,
} from "../../../../selectors/eventSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { postNewEvent } from "../../../../slices/eventSlice";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";

/**
 * This component manages the pages of the new event wizard and the submission of values
 */
const NewEventWizard: React.FC<{
	close: () => void
}> = ({
	close,
}) => {
	const dispatch = useAppDispatch();

	const uploadAssetOptions = useAppSelector(state => getAssetUploadOptions(state));
	const metadataFields = useAppSelector(state => getEventMetadata(state));
	const extendedMetadata = useAppSelector(state => getExtendedEventMetadata(state));
	const user = useAppSelector(state => getUserInformation(state));

	const initialValues = getInitialValues(
		metadataFields,
		extendedMetadata,
		uploadAssetOptions,
		user
	);
	let workflowPanelRef = React.useRef();

	const [page, setPage] = useState(0);
	const [snapshot, setSnapshot] = useState(initialValues);
	const [pageCompleted, setPageCompleted] = useState<{ [key: number]: boolean }>({});

	// Caption of steps used by Stepper
	const steps = [
		{
			translation: "EVENTS.EVENTS.NEW.METADATA.CAPTION",
			name: "metadata",
			hidden: false,
		},
		{
			translation: "EVENTS.EVENTS.DETAILS.TABS.EXTENDED-METADATA",
			name: "metadata-extended",
			hidden: !(!!extendedMetadata && extendedMetadata.length > 0),
		},
		{
			translation: "EVENTS.EVENTS.NEW.SOURCE.CAPTION",
			name: "source",
			hidden: false,
		},
		{
			translation: "EVENTS.EVENTS.NEW.UPLOAD_ASSET.CAPTION",
			name: "upload-asset",
			hidden:
				uploadAssetOptions.filter((asset) => asset.type !== "track").length ===
				0,
		},
		{
			translation: "EVENTS.EVENTS.NEW.PROCESSING.CAPTION",
			name: "processing",
			hidden: false,
		},
		{
			translation: "EVENTS.EVENTS.NEW.ACCESS.CAPTION",
			name: "access",
			hidden: false,
		},
		{
			translation: "EVENTS.EVENTS.NEW.SUMMARY.CAPTION",
			name: "summary",
			hidden: false,
		},
	];

	// Validation schema of current page
	const currentValidationSchema = NewEventSchema[page];

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const nextPage = (values) => {
		setSnapshot(values);

		// set page as completely filled out
		let updatedPageCompleted = pageCompleted;
		updatedPageCompleted[page] = true;
		setPageCompleted(updatedPageCompleted);

		if (steps[page + 1].hidden) {
			setPage(page + 2);
		} else {
			setPage(page + 1);
		}
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const previousPage = (values, twoPagesBack) => {
		setSnapshot(values);
		// if previous page is hidden or not always shown, than go back two pages
		if (steps[page - 1].hidden || twoPagesBack) {
			setPage(page - 2);
		} else {
			setPage(page - 1);
		}
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
// @ts-expect-error TS(2339): Property 'submitForm' does not exist on type 'neve... Remove this comment to see the full error message
		workflowPanelRef.current?.submitForm();
		const response = dispatch(postNewEvent({values, metadataInfo: metadataFields, extendedMetadata}));
		console.info(response);
		close();
	};

	return (
		<>
			<Formik
				initialValues={snapshot}
				validationSchema={currentValidationSchema}
				onSubmit={(values) => handleSubmit(values)}
			>
				{/* Render wizard pages depending on current value of page variable */}
				{(formik) => {
					// eslint-disable-next-line react-hooks/rules-of-hooks
					useEffect(() => {
						formik.validateForm();
						// eslint-disable-next-line react-hooks/exhaustive-deps
					}, [page]);

					return (
						<>
							{/* Stepper that shows each step of wizard as header */}
							<WizardStepperEvent
								steps={steps}
								page={page}
								setPage={setPage}
								completed={pageCompleted}
								setCompleted={setPageCompleted}
								formik={formik}
							/>
							<div>
								{page === 0 && (
									<NewMetadataPage
										nextPage={nextPage}
										formik={formik}
										metadataFields={metadataFields}
										header={steps[page].translation}
									/>
								)}
								{page === 1 && (
									<NewMetadataExtendedPage
										previousPage={previousPage}
										nextPage={nextPage}
										formik={formik}
										extendedMetadataFields={extendedMetadata}
									/>
								)}
								{page === 2 && (
									<NewSourcePage
										previousPage={previousPage}
										nextPage={nextPage}
										formik={formik}
									/>
								)}
								{page === 3 && (
									<NewAssetUploadPage
										previousPage={previousPage}
										nextPage={nextPage}
										formik={formik}
									/>
								)}
								{page === 4 && (
									<NewProcessingPage
										previousPage={previousPage}
										nextPage={nextPage}
// @ts-expect-error TS(2322): Type '{ previousPage: (values: any, twoPagesBack: ... Remove this comment to see the full error message
										workflowPanelRef={workflowPanelRef}
										formik={formik}
									/>
								)}
								{page === 5 && (
									<NewAccessPage
										previousPage={previousPage}
										nextPage={nextPage}
										formik={formik}
										editAccessRole="ROLE_UI_SERIES_DETAILS_ACL_EDIT"
									/>
								)}
								{page === 6 && (
									<NewEventSummary
										previousPage={previousPage}
										formik={formik}
										metaDataExtendedHidden={steps[1].hidden}
										assetUploadHidden={steps[3].hidden}
									/>
								)}
							</div>
						</>
					);
				}}
			</Formik>
		</>
	);
};

// Transform all initial values needed from information provided by backend
const getInitialValues = (
// @ts-expect-error TS(7006): Parameter 'metadataFields' implicitly has an 'any'... Remove this comment to see the full error message
	metadataFields,
// @ts-expect-error TS(7006): Parameter 'extendedMetadata' implicitly has an 'an... Remove this comment to see the full error message
	extendedMetadata,
// @ts-expect-error TS(7006): Parameter 'uploadAssetOptions' implicitly has an '... Remove this comment to see the full error message
	uploadAssetOptions,
// @ts-expect-error TS(7006): Parameter 'uploadAssetOptions' implicitly has an '... Remove this comment to see the full error message
	user
) => {
	// Transform metadata fields provided by backend (saved in redux)
	let initialValues = getInitialMetadataFieldValues(
		metadataFields,
		extendedMetadata
	);

	// Transform additional metadata for source (provided by constant in newEventConfig)
	if (!!sourceMetadata.UPLOAD) {
		sourceMetadata.UPLOAD.metadata.forEach((field) => {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			initialValues[field.id] = field.value;
		});
	}
// @ts-expect-error TS(2339): Property 'SINGLE_SCHEDULE' does not exist on type ... Remove this comment to see the full error message
	if (!!sourceMetadata.SINGLE_SCHEDULE) {
// @ts-expect-error TS(2339): Property 'SINGLE_SCHEDULE' does not exist on type ... Remove this comment to see the full error message
		sourceMetadata.SINGLE_SCHEDULE.metadata.forEach((field) => {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			initialValues[field.id] = field.value;
		});
	}
// @ts-expect-error TS(2339): Property 'MULTIPLE_SCHEDULE' does not exist on typ... Remove this comment to see the full error message
	if (!!sourceMetadata.MULTIPLE_SCHEDULE) {
// @ts-expect-error TS(2339): Property 'MULTIPLE_SCHEDULE' does not exist on typ... Remove this comment to see the full error message
		sourceMetadata.MULTIPLE_SCHEDULE.metadata.forEach((field) => {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			initialValues[field.id] = field.value;
		});
	}

	// Add possible files that can be uploaded in source step
	if (!!uploadAssetOptions) {
// @ts-expect-error TS(2339): Property 'uploadAssetsTrack' does not exist on typ... Remove this comment to see the full error message
		initialValues.uploadAssetsTrack = [];
		// initial value of upload asset needs to be null, because object (file) is saved there
// @ts-expect-error TS(7006): Parameter 'option' implicitly has an 'any' type.
		uploadAssetOptions.forEach((option) => {
			if (option.type === "track") {
// @ts-expect-error TS(2339): Property 'uploadAssetsTrack' does not exist on typ... Remove this comment to see the full error message
				initialValues.uploadAssetsTrack.push({
					...option,
					file: null,
				});
			} else {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				initialValues[option.id] = null;
			}
		});
	}

	// Add all initial form values known upfront listed in newEventsConfig
	for (const [key, value] of Object.entries(initialFormValuesNewEvents)) {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
		initialValues[key] = value;
	}

	const defaultDate = new Date();

	// fill times with some default values
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
	initialValues["scheduleStartHour"] = (defaultDate.getHours() + 1).toString();
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
	initialValues["scheduleStartMinute"] = "00";
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
	initialValues["scheduleDurationHours"] = "00";
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
	initialValues["scheduleDurationMinutes"] = "55";
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
	initialValues["scheduleEndHour"] = (defaultDate.getHours() + 1).toString();
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
	initialValues["scheduleEndMinute"] = "55";

// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
	initialValues["acls"] = [
		{
			role: user.userRole,
			read: true,
			write: true,
			actions: [],
		},
	];

	return initialValues;
};

export default NewEventWizard;
