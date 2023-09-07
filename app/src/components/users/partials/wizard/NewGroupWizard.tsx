import React, { useEffect } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { initialFormValuesNewGroup } from "../../../../configs/modalConfig";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardStepper' was ... Remove this comment to see the full error message
import WizardStepper from "../../../shared/wizard/WizardStepper";
// @ts-expect-error TS(6142): Module './GroupMetadataPage' was resolved to '/hom... Remove this comment to see the full error message
import GroupMetadataPage from "./GroupMetadataPage";
// @ts-expect-error TS(6142): Module './GroupRolesPage' was resolved to '/home/a... Remove this comment to see the full error message
import GroupRolesPage from "./GroupRolesPage";
// @ts-expect-error TS(6142): Module './GroupUsersPage' was resolved to '/home/a... Remove this comment to see the full error message
import GroupUsersPage from "./GroupUsersPage";
// @ts-expect-error TS(6142): Module './NewGroupSummaryPage' was resolved to '/h... Remove this comment to see the full error message
import NewGroupSummaryPage from "./NewGroupSummaryPage";
import { postNewGroup } from "../../../../thunks/groupThunks";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { NewGroupSchema } from "../../../../utils/validate";

/**
 * This component renders the new group wizard
 */
const NewGroupWizard = ({
    close,
    postNewGroup
}: any) => {
	const initialValues = initialFormValuesNewGroup;

	const [
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	] = usePageFunctions(0, initialValues);

	// Caption of steps used by Stepper
	const steps = [
		{
			translation: "USERS.GROUPS.DETAILS.TABS.METADATA",
			name: "metadata",
		},
		{
			translation: "USERS.GROUPS.DETAILS.TABS.ROLES",
			name: "roles",
		},
		{
			translation: "USERS.GROUPS.DETAILS.TABS.USERS",
			name: "users",
		},
		{
			translation: "USERS.GROUPS.DETAILS.TABS.SUMMARY",
			name: "summary",
		},
	];

	// Validation schema of current page
	const currentValidationSchema = NewGroupSchema[page];

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		const response = postNewGroup(values);
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
							/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div>
								{page === 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<GroupMetadataPage formik={formik} nextPage={nextPage} />
								)}
								{page === 1 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<GroupRolesPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 2 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<GroupUsersPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 3 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<NewGroupSummaryPage
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
	postNewGroup: (values) => dispatch(postNewGroup(values)),
});

export default connect(null, mapDispatchToProps)(NewGroupWizard);
