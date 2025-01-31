import React from "react";
import { FormikProps } from "formik";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { MetadataCatalog } from "../../../../slices/eventSlice";
import NewMetadataPage from "./NewMetadataPage";

/**
 * This component renders the metadata page for new events and series in the wizards.
 */
const NewMetadataCommonPage = <T,>({
	formik,
	nextPage,
	metadataFields,
	header
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
	metadataFields: MetadataCatalog,
	header: string
}) => {

	return (
		<>
			<NewMetadataPage
				metadataCatalogs={[metadataFields]}
				header={header}
			/>

			{/* Button for navigation to next page */}
			<WizardNavigationButtons
				isFirst
				formik={formik}
				nextPage={nextPage}
			/>
		</>
	);
};

export default NewMetadataCommonPage;
