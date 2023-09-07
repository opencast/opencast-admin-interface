import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import cn from "classnames";
// @ts-expect-error TS(6142): Module './NewUserGeneralTab' was resolved to '/hom... Remove this comment to see the full error message
import NewUserGeneralTab from "./NewUserGeneralTab";
// @ts-expect-error TS(6142): Module './UserRolesTab' was resolved to '/home/arn... Remove this comment to see the full error message
import UserRolesTab from "./UserRolesTab";
import { initialFormValuesNewUser } from "../../../../configs/modalConfig";
import { getUsernames } from "../../../../selectors/userSelectors";
import { postNewUser } from "../../../../thunks/userThunks";
import { NewUserSchema } from "../../../../utils/validate";

/**
 * This component renders the new user wizard
 */
const NewUserWizard = ({
    close,
    usernames,
    postNewUser
}: any) => {
	const { t } = useTranslation();

	const navStyle = {
		left: "0px",
		top: "auto",
		position: "initial",
	};

	const [tab, setTab] = useState(0);

// @ts-expect-error TS(7006): Parameter 'tabNr' implicitly has an 'any' type.
	const openTab = (tabNr) => {
		setTab(tabNr);
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		const response = postNewUser(values);
		console.info(response);
		close();
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/*Head navigation*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<nav className="modal-nav" id="modal-nav" style={navStyle}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					className={"button-like-anchor " + cn("wider", { active: tab === 0 })}
					onClick={() => openTab(0)}
				>
					{t("USERS.USERS.DETAILS.TABS.USER")}
				</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					className={"button-like-anchor " + cn("wider", { active: tab === 1 })}
					onClick={() => openTab(1)}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("USERS.USERS.DETAILS.DESCRIPTION.ROLES")}
				>
					{t("USERS.USERS.DETAILS.TABS.ROLES")}
				</button>
			</nav>

			{/* Initialize overall form */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Formik
				initialValues={initialFormValuesNewUser}
				validationSchema={NewUserSchema(usernames)}
				onSubmit={(values) => handleSubmit(values)}
			>
				{/* Render wizard tabs depending on current value of tab variable */}
				{(formik) => {
					// eslint-disable-next-line react-hooks/rules-of-hooks
					useEffect(() => {
						formik.validateForm();
					}, [tab]);

					return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							{tab === 0 && <NewUserGeneralTab formik={formik} />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							{tab === 1 && <UserRolesTab formik={formik} />}

							{/* Navigation buttons and validation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<button
									className={cn("submit", {
										active: formik.dirty && formik.isValid,
										inactive: !(formik.dirty && formik.isValid),
									})}
									disabled={!(formik.dirty && formik.isValid)}
									onClick={() => formik.handleSubmit()}
								>
									{t("SUBMIT")}
								</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<button className="cancel" onClick={() => close()}>
									{t("CANCEL")}
								</button>
							</footer>
						</>
					);
				}}
			</Formik>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	usernames: getUsernames(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	postNewUser: (values) => dispatch(postNewUser(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewUserWizard);
