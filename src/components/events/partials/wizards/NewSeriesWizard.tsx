import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import NewThemePage from "../ModalTabsAndPages/NewThemePage";
import NewSeriesSummary from "./NewSeriesSummary";
import {
	getSeriesExtendedMetadata,
	getSeriesMetadata,
	getSeriesTobiraPageError,
	getSeriesTobiraPageStatus,
} from "../../../../selectors/seriesSeletctor";
import NewMetadataExtendedPage from "../ModalTabsAndPages/NewMetadataExtendedPage";
import NewAccessPage from "../ModalTabsAndPages/NewAccessPage";
import WizardStepper from "../../../shared/wizard/WizardStepper";
import { initialFormValuesNewSeries } from "../../../../configs/modalConfig";
import { MetadataSchema, NewSeriesSchema } from "../../../../utils/validate";
import { getInitialMetadataFieldValues } from "../../../../utils/resourceUtils";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { TobiraPage, fetchSeriesDetailsTobiraNew, postNewSeries } from "../../../../slices/seriesSlice";
import { MetadataCatalog } from "../../../../slices/eventSlice";
import NewTobiraPage from "../ModalTabsAndPages/NewTobiraPage";
import { getOrgProperties, getUserInformation } from "../../../../selectors/userInfoSelectors";
import { UserInfoState } from "../../../../slices/userInfoSlice";
import { TransformedAcl } from "../../../../slices/aclDetailsSlice";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import NewMetadataCommonPage from "../ModalTabsAndPages/NewMetadataCommonPage";
import { hasAccess } from "../../../../utils/utils";

/**
 * This component manages the pages of the new series wizard and the submission of values
 */
const NewSeriesWizard: React.FC<{
	close: () => void
}> = ({
	close,
}) => {
	const dispatch = useAppDispatch();

	const metadataFields = useAppSelector(state => getSeriesMetadata(state));
	const extendedMetadata = useAppSelector(state => getSeriesExtendedMetadata(state));
	const tobiraStatus = useAppSelector(state => getSeriesTobiraPageStatus(state));
	const tobiraError = useAppSelector(state => getSeriesTobiraPageError(state));
	const user = useAppSelector(state => getUserInformation(state));
	const orgProperties = useAppSelector(state => getOrgProperties(state));

	useEffect(() => {
		dispatch(removeNotificationWizardForm());

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const themesEnabled = (orgProperties['admin.themes.enabled'] || 'false').toLowerCase() === 'true';

	const initialValues = getInitialValues(metadataFields, extendedMetadata, user);

	const [page, setPage] = useState(0);
	const [snapshot, setSnapshot] = useState(initialValues);
	const [pageCompleted, setPageCompleted] = useState<{ [key: number]: boolean }>({});

	useEffect(() => {
		// This should set off a web request that will intentionally fail, in order
		// to check if tobira is available at all
		dispatch(fetchSeriesDetailsTobiraNew(""));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			hidden: !themesEnabled,
		},
		{
			translation: "EVENTS.SERIES.NEW.TOBIRA.CAPTION",
			name: "tobira",
			hidden: !hasAccess("ROLE_UI_SERIES_DETAILS_TOBIRA_EDIT", user) || !!(tobiraStatus === "failed" && tobiraError?.message?.includes("503")),
		},
		{
			translation: "EVENTS.SERIES.NEW.SUMMARY.CAPTION",
			name: "summary",
			hidden: false,
		},
	];

	// Validation schema of current page
	let currentValidationSchema;
	if (page === 0 || page === 1) {
		currentValidationSchema = MetadataSchema(metadataFields);
	} else {
		currentValidationSchema = NewSeriesSchema[page];
	}

	const nextPage = (
		values: {
			acls: TransformedAcl[];
			theme: string;
			breadcrumbs: TobiraPage[];
			selectedPage?: TobiraPage;
		}
	) => {
		setSnapshot(values);

		// set page as completely filled out
		let updatedPageCompleted = pageCompleted;
		updatedPageCompleted[page] = true;
		setPageCompleted(updatedPageCompleted);

		let newPage = page;
		do {
			newPage = newPage + 1;
		} while(steps[newPage] && steps[newPage]!.hidden);
		if (steps[newPage]) {
			setPage(newPage)
		}
	};

	const previousPage = (
		values: {
			acls: TransformedAcl[];
			theme: string;
			breadcrumbs: TobiraPage[];
			selectedPage?: TobiraPage;
		},
		twoPagesBack?: boolean
	) => {
		setSnapshot(values);

		let newPage = page;
		do {
			newPage = newPage - 1;
		} while(steps[newPage] && steps[newPage]!.hidden);
		if (steps[newPage]) {
			setPage(newPage)
		}
	};

	const handleSubmit = (
		values:
			{
				[key: string]: any;
				acls: TransformedAcl[];
				theme: string;
			}
	) => {
		const response = dispatch(postNewSeries({values, metadataInfo: metadataFields, extendedMetadata}));
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
									<NewMetadataCommonPage
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
									// @ts-expect-error TS(7006):
										nextPage={nextPage}
										// @ts-expect-error TS(7006):
										previousPage={previousPage}
										// @ts-expect-error TS(7006):
										formik={formik}
										editAccessRole="ROLE_UI_SERIES_DETAILS_ACL_EDIT"
										initEventAclWithSeriesAcl={false}
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
									<NewTobiraPage
										mode={{ mount: true }}
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 5 && (
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

const getInitialValues = (
	metadataFields: MetadataCatalog,
	extendedMetadata: MetadataCatalog[],
	user: UserInfoState,
) => {
	let initialValues = initialFormValuesNewSeries;

	// Transform metadata fields provided by backend (saved in redux)
	let metadataInitialValues = getInitialMetadataFieldValues(
		metadataFields,
	);

	for (const catalog of extendedMetadata) {
		metadataInitialValues = {...metadataInitialValues, ...getInitialMetadataFieldValues(
			catalog
		)};
	}

	initialValues = { ...initialValues, ...metadataInitialValues };

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

export default NewSeriesWizard;
