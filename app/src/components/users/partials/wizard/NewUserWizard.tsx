import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import NewUserGeneralTab from "./NewUserGeneralTab";
import UserRolesTab from "./UserRolesTab";
import { initialFormValuesNewUser } from "../../../../configs/modalConfig";
import { getUsernames } from "../../../../selectors/userSelectors";
import { NewUserSchema } from "../../../../utils/validate";
import { postNewUser } from "../../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";

/**
 * This component renders the new user wizard
 */
const NewUserWizard = ({
	close,
}: {
	close: () => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const usernames = useAppSelector(state => getUsernames(state));

	const navStyle = {
		left: "0px",
		top: "auto",
		position: "initial" as const,
	};

	const [tab, setTab] = useState(0);

	const openTab = (tabNr: number) => {
		setTab(tabNr);
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		const response = dispatch(postNewUser(values));
		console.info(response);
		close();
	};

	return (
		<>
			{/*Head navigation*/}
			<nav className="modal-nav" id="modal-nav" style={navStyle}>
				<button
					className={"button-like-anchor " + cn("wider", { active: tab === 0 })}
					onClick={() => openTab(0)}
				>
					{t("USERS.USERS.DETAILS.TABS.USER")}
				</button>
				<button
					className={"button-like-anchor " + cn("wider", { active: tab === 1 })}
					onClick={() => openTab(1)}
					title={t("USERS.USERS.DETAILS.DESCRIPTION.ROLES")}
				>
					{t("USERS.USERS.DETAILS.TABS.ROLES")}
				</button>
			</nav>

			{/* Initialize overall form */}
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
						<>
							{tab === 0 && <NewUserGeneralTab formik={formik} />}
							{tab === 1 && <UserRolesTab formik={formik} />}

							{/* Navigation buttons and validation */}
							<footer>
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

export default NewUserWizard;
