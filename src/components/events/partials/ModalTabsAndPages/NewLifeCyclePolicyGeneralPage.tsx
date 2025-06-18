import React from "react";
import { FormikProps } from "formik";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import LifeCyclePolicyGeneralFields from "../wizards/LifeCyclePolicyGeneralFields";
import { LifeCyclePolicy, TargetFilter } from "../../../../slices/lifeCycleSlice";

/**
 * This component renders the metadata page for new events and series in the wizards.
 */
const NewLifeCyclePolicyGeneralPage = <T extends LifeCyclePolicy & {targetFiltersArray: (TargetFilter & { filter: string })[]}>({
	formik,
	nextPage,
	header,
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
	header: string
}) => {

	return (
		<>
			<div className="modal-content">
				<div className="modal-body">
					<div className="full-col">
							{/* Table view containing input fields for metadata */}
							<LifeCyclePolicyGeneralFields
								formik={formik}
								isNew={true}
							/>
					</div>
				</div>
			</div>

			{/* Button for navigation to next page */}
			<WizardNavigationButtons isFirst formik={formik} nextPage={nextPage} />
		</>
	);
};

export default NewLifeCyclePolicyGeneralPage;
