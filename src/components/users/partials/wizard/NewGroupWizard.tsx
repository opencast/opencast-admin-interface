import React, { useEffect } from "react";
import { Formik } from "formik";
import { initialFormValuesNewGroup } from "../../../../configs/modalConfig";
import WizardStepper from "../../../shared/wizard/WizardStepper";
import GroupMetadataPage from "./GroupMetadataPage";
import GroupRolesPage from "./GroupRolesPage";
import GroupUsersPage from "./GroupUsersPage";
import NewGroupSummaryPage from "./NewGroupSummaryPage";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { NewGroupSchema } from "../../../../utils/validate";
import { useAppDispatch } from "../../../../store";
import { postNewGroup } from "../../../../slices/groupSlice";

/**
 * This component renders the new group wizard
 */
const NewGroupWizard: React.FC<{
	close: () => void
}> = ({
	close,
}) => {
	const dispatch = useAppDispatch();

	const initialValues = initialFormValuesNewGroup;

	const {
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	} = usePageFunctions(0, initialValues);

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
		const response = dispatch(postNewGroup(values));
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
						formik.validateForm();
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
							/>
							<div>
								{page === 0 && (
									<GroupMetadataPage
										formik={formik}
										nextPage={nextPage}
									/>
								)}
								{page === 1 && (
									<GroupRolesPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 2 && (
									<GroupUsersPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 3 && (
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

export default NewGroupWizard;
