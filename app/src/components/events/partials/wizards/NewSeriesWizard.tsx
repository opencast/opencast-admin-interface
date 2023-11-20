import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import NewThemePage from "../ModalTabsAndPages/NewThemePage";
import NewSeriesSummary from "./NewSeriesSummary";
import {
	getSeriesExtendedMetadata,
	getSeriesMetadata,
} from "../../../../selectors/seriesSeletctor";
import { connect } from "react-redux";
import NewMetadataPage from "../ModalTabsAndPages/NewMetadataPage";
import NewMetadataExtendedPage from "../ModalTabsAndPages/NewMetadataExtendedPage";
import NewAccessPage from "../ModalTabsAndPages/NewAccessPage";
import { postNewSeries } from "../../../../thunks/seriesThunks";
import WizardStepper from "../../../shared/wizard/WizardStepper";
import { initialFormValuesNewSeries } from "../../../../configs/modalConfig";
import { NewSeriesSchema } from "../../../../utils/validate";
import { getInitialMetadataFieldValues } from "../../../../utils/resourceUtils";

/**
 * This component manages the pages of the new series wizard and the submission of values
 */
const NewSeriesWizard = ({
// @ts-expect-error TS(7031): Binding element 'metadataFields' implicitly has an... Remove this comment to see the full error message
	metadataFields,
// @ts-expect-error TS(7031): Binding element 'extendedMetadata' implicitly has ... Remove this comment to see the full error message
	extendedMetadata,
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
	close,
// @ts-expect-error TS(7031): Binding element 'postNewSeries' implicitly has an ... Remove this comment to see the full error message
	postNewSeries,
}) => {
	const initialValues = getInitialValues(metadataFields, extendedMetadata);

	const [page, setPage] = useState(0);
	const [snapshot, setSnapshot] = useState(initialValues);
	const [pageCompleted, setPageCompleted] = useState({});

	// Caption of steps used by Stepper
	const steps = [
		{
			translation: "EVENTS.SERIES.NEW.METADATA.CAPTION",
			name: "metadata",
			hidden: false,
		},
		{
			translation: "EVENTS.EVENTS.DETAILS.TABS.EXTENDED-METADATA",
			name: "metadata-extended",
			hidden: !(!!extendedMetadata && extendedMetadata.length > 0),
		},
		{
			translation: "EVENTS.SERIES.NEW.ACCESS.CAPTION",
			name: "access",
			hidden: false,
		},
		{
			translation: "EVENTS.SERIES.NEW.THEME.CAPTION",
			name: "theme",
			hidden: false,
		},
		{
			translation: "EVENTS.SERIES.NEW.SUMMARY.CAPTION",
			name: "summary",
			hidden: false,
		},
	];

	// Validation schema of current page
	const currentValidationSchema = NewSeriesSchema[page];

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const nextPage = (values) => {
		setSnapshot(values);

		// set page as completely filled out
		let updatedPageCompleted = pageCompleted;
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
		// if previous page is hidden or not always shown, then go back two pages
		if (steps[page - 1].hidden || twoPagesBack) {
			setPage(page - 2);
		} else {
			setPage(page - 1);
		}
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		const response = postNewSeries(values, metadataFields, extendedMetadata);
		console.info(response);
		close();
	};

	return (
		<>
			{/* Initialize overall form */}
			<Formik
				initialValues={snapshot}
				validationSchema={currentValidationSchema}
				onSubmit={(values) => handleSubmit(values)}
			>
				{/* Render wizard pages depending on current value of page variable */}
				{(formik) => {
					// eslint-disable-next-line react-hooks/rules-of-hooks
					useEffect(() => {
						formik.validateForm().then();
						// eslint-disable-next-line react-hooks/exhaustive-deps
					}, [page]);

					return (
						<>
							{/* Stepper that shows each step of wizard as header */}
							<WizardStepper
								steps={steps}
								page={page}
								setPage={setPage}
								completed={pageCompleted}
								setCompleted={setPageCompleted}
								formik={formik}
								hasAccessPage
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
										nextPage={nextPage}
										previousPage={previousPage}
										formik={formik}
										extendedMetadataFields={extendedMetadata}
									/>
								)}
								{page === 2 && (
									<NewAccessPage
										nextPage={nextPage}
										previousPage={previousPage}
										formik={formik}
										editAccessRole="ROLE_UI_SERIES_DETAILS_ACL_EDIT"
									/>
								)}
								{page === 3 && (
									<NewThemePage
										nextPage={nextPage}
										previousPage={previousPage}
										formik={formik}
									/>
								)}
								{page === 4 && (
									<NewSeriesSummary
										previousPage={previousPage}
										formik={formik}
										metaDataExtendedHidden={steps[1].hidden}
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

// @ts-expect-error TS(7006): Parameter 'metadataFields' implicitly has an 'any'... Remove this comment to see the full error message
const getInitialValues = (metadataFields, extendedMetadata) => {
	// Transform metadata fields provided by backend (saved in redux)
	let initialValues = getInitialMetadataFieldValues(
		metadataFields,
		extendedMetadata
	);

	// Add all initial form values known upfront listed in newSeriesConfig
	for (const [key, value] of Object.entries(initialFormValuesNewSeries)) {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
		initialValues[key] = value;
	}

	return initialValues;
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	metadataFields: getSeriesMetadata(state),
	extendedMetadata: getSeriesExtendedMetadata(state),
});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	postNewSeries: (values, metadataFields, extendedMetadata) =>
		dispatch(postNewSeries(values, metadataFields, extendedMetadata)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewSeriesWizard);
