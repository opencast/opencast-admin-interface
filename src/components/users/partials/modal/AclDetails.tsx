import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import cn from "classnames";
import AclAccessPage from "../wizard/AclAccessPage";
import AclMetadataPage from "../wizard/AclMetadataPage";
import { getAclDetails } from "../../../../selectors/aclDetailsSelectors";
import { NewAclSchema } from "../../../../utils/validate";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { checkAcls } from "../../../../slices/aclSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { TransformedAcl, updateAclDetails } from "../../../../slices/aclDetailsSlice";

/**
 * This component manages the pages of the acl details modal
 */
const AclDetails = ({
	close,
} : {
	close: () => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [page, setPage] = useState(0);

	const aclDetails = useAppSelector(state => getAclDetails(state));

	// set initial values
	const initialValues = {
		name: aclDetails.name,
		aclTemplate: "",
		acls: aclDetails.acl,
	};

	// information about tabs
	const tabs = [
		{
			tabTranslation: "USERS.ACLS.DETAILS.TABS.METADATA",
			accessRole: "ROLE_UI_ACLS_EDIT",
			name: "metadata",
		},
		{
			tabTranslation: "USERS.ACLS.DETAILS.TABS.ACCESS",
			accessRole: "ROLE_UI_ACLS_EDIT",
			name: "access",
		},
	];

	const openTab = (tabNr: number) => {
		setPage(tabNr);
	};

	const handleSubmit = (
		values: {
			name: string,
			acls: TransformedAcl[],
		}
	) => {
		dispatch(updateAclDetails({values: values, aclId: aclDetails.id}));
		close();
	};

	return (
		<>
			{/* Navigation */}
			<ModalNavigation tabInformation={tabs} openTab={openTab} page={page} />

			{/* formik form used in entire modal */}
			<Formik
				initialValues={initialValues}
				validationSchema={NewAclSchema[0]}
				onSubmit={(values) => handleSubmit(values)}
			>
				{(formik) => (
					<>
						{page === 0 && <AclMetadataPage formik={formik} isEdit />}
						{page === 1 && (
							<AclAccessPage
								formik={formik}
								isEdit
							/>
						)}

						{/* Navigation buttons and validation */}
						<footer>
							<button
								className={cn("submit", {
									active: formik.dirty && formik.isValid,
									inactive: !(formik.dirty && formik.isValid),
								})}
								disabled={!(formik.dirty && formik.isValid)}
								onClick={async () => {
									if (await dispatch(checkAcls(formik.values.acls))) {
										formik.handleSubmit();
									}
								}}
								type="submit"
							>
								{t("SUBMIT")}
							</button>
							<button className="cancel" onClick={() => close()}>
								{t("CANCEL")}
							</button>
						</footer>
					</>
				)}
			</Formik>
		</>
	);
};

export default AclDetails;
