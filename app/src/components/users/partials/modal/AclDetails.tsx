import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import cn from "classnames";
import { connect } from "react-redux";
import AclAccessPage from "../wizard/AclAccessPage";
import AclMetadataPage from "../wizard/AclMetadataPage";
import { getAclDetails } from "../../../../selectors/aclDetailsSelectors";
import { NewAclSchema } from "../../../../utils/validate";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { checkAcls } from "../../../../thunks/aclThunks";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { updateAclDetails } from "../../../../slices/aclDetailsSlice";

/**
 * This component manages the pages of the acl details modal
 */
const AclDetails = ({
	close,
	checkAcls
}: any) => {
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

// @ts-expect-error TS(7006): Parameter 'tabNr' implicitly has an 'any' type.
	const openTab = (tabNr) => {
		setPage(tabNr);
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
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
								// @ts-expect-error: Type-checking gets confused by redux-connect in the child
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
									if (await checkAcls(formik.values.acls)) {
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

// getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({

});

// mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'acls' implicitly has an 'any' type.
	checkAcls: (acls) => dispatch(checkAcls(acls)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AclDetails);
