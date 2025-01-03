import React, { useEffect } from "react";
import { Formik } from "formik";
import WizardStepper from "../../../shared/wizard/WizardStepper";
import AclMetadataPage from "./AclMetadataPage";
import NewAclSummaryPage from "./NewAclSummaryPage";
import { postNewAcl } from "../../../../slices/aclSlice";
import { initialFormValuesNewAcl } from "../../../../configs/modalConfig";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { NewAclSchema } from "../../../../utils/validate";
import AclAccessPage from "./AclAccessPage";
import { useAppDispatch } from "../../../../store";

/**
 * This component manages the pages of the new ACL wizard
 */
const NewAclWizard = ({
	close,
} : {
	close: () => void,
}) => {
	const dispatch = useAppDispatch();

	const initialValues = {
		...initialFormValuesNewAcl,
		aclTemplate: "",
	}

	const {
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	} = usePageFunctions(0, initialValues);

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

	const handleSubmit = (values: typeof initialFormValuesNewAcl) => {
		const response = dispatch(postNewAcl(values));
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
								hasAccessPage
							/>
							<div>
								{page === 0 && (
									<AclMetadataPage
										formik={formik}
										nextPage={nextPage}
									/>
								)}
								{page === 1 && (
									<AclAccessPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 2 && (
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

export default NewAclWizard;
