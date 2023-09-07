import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Formik } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardStepper' was ... Remove this comment to see the full error message
import WizardStepper from "../../../shared/wizard/WizardStepper";
// @ts-expect-error TS(6142): Module './AclMetadataPage' was resolved to '/home/... Remove this comment to see the full error message
import AclMetadataPage from "./AclMetadataPage";
// @ts-expect-error TS(6142): Module './NewAclSummaryPage' was resolved to '/hom... Remove this comment to see the full error message
import NewAclSummaryPage from "./NewAclSummaryPage";
import { postNewAcl } from "../../../../thunks/aclThunks";
import { initialFormValuesNewAcl } from "../../../../configs/modalConfig";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { NewAclSchema } from "../../../../utils/validate";
// @ts-expect-error TS(6142): Module './AclAccessPage' was resolved to '/home/ar... Remove this comment to see the full error message
import AclAccessPage from "./AclAccessPage";

/**
 * This component manages the pages of the new ACL wizard
 */
const NewAclWizard = ({
    close,
    postNewAcl
}: any) => {
	const initialValues = initialFormValuesNewAcl;

	const [
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	] = usePageFunctions(0, initialValues);

	const steps = [
		{
			name: "metadata",
			translation: "USERS.ACLS.NEW.TABS.METADATA",
		},
		{
			name: "access",
			translation: "USERS.ACLS.NEW.TABS.ACCESS",
		},
		{
			name: "summary",
			translation: "USERS.ACLS.NEW.TABS.SUMMARY",
		},
	];

	const currentValidationSchema = NewAclSchema[page];

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		const response = postNewAcl(values);
		console.info(response);
		close();
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* Initialize overall form */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<>
							{/* Stepper that shows each step of wizard as header */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<WizardStepper
								steps={steps}
								page={page}
								setPage={setPage}
								completed={pageCompleted}
								setCompleted={setPageCompleted}
								formik={formik}
								hasAccessPage
							/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div>
								{page === 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<AclMetadataPage formik={formik} nextPage={nextPage} />
								)}
								{page === 1 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<AclAccessPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 2 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<NewAclSummaryPage
										formik={formik}
										previousPage={previousPage}
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

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	postNewAcl: (values) => dispatch(postNewAcl(values)),
});

export default connect(null, mapDispatchToProps)(NewAclWizard);
