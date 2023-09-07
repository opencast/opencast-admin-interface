import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(2305): Module '"react-router-dom"' has no exported member... Remove this comment to see the full error message
import { useHistory } from "react-router-dom";
import { Field, Formik } from "formik";
import languages from "../i18n/languages";
import i18n from "../i18n/i18n";
import cn from "classnames";
import axios from "axios";

//Get code, flag and name of the current language
let currentLang = languages.find(({ code }) => code === i18n.language);
if (typeof currentLang === "undefined") {
	currentLang = languages.find(({ code }) => code === "en-GB");
}
const currentLanguage = currentLang;

// References for detecting a click outside of the container of the dropdown menu of languages
const containerLang = React.createRef();

// @ts-expect-error TS(7006): Parameter 'code' implicitly has an 'any' type.
function changeLanguage(code) {
	// Load json-file of the language with provided code
	i18n.changeLanguage(code);
	// Reload window for updating the flag of the language dropdown menu
	window.location.reload();
}

/**
 * This component renders the login page
 */
const Login = () => {
	const { t } = useTranslation();
	// State for opening (true) and closing (false) the dropdown menus for language
	const [displayMenuLang, setMenuLang] = useState(false);
	const [isError, setError] = useState(false);

	let history = useHistory();

	let initialValues = {
		j_username: "",
		j_password: "",
		_spring_security_remember_me: true,
	};

	useEffect(() => {
		// Function for handling clicks outside of an open dropdown menu
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
		const handleClickOutside = (e) => {
// @ts-expect-error TS(2571): Object is of type 'unknown'.
			if (containerLang.current && !containerLang.current.contains(e.target)) {
				setMenuLang(false);
			}
		};

		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Handle submission of login data to backend
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		console.log(values);
		let data = new URLSearchParams();
		data.append("j_username", values.j_username);
		data.append("j_password", values.j_password);
		data.append(
			"_spring_security_remember_me",
			values._spring_security_remember_me
		);

		axios
			.post("/admin-ng/j_spring_security_check", data)
			.then((response) => {
				console.info(response);
				history.push("/events/events");
			})
			.catch((response) => {
				console.error(response);
				setError(true);
			});
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/*Todo: find equivalent to ng-cloak*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="login-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<section className="login-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="login-form">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="form-container">
							{/*Login form*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<Formik
								onSubmit={(values) => handleSubmit(values)}
								initialValues={initialValues}
							>
								{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="formik-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<span>{t("LOGIN.WELCOME")}</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<br />
											</p>
										</div>

										{/*Only show if error occurs on login*/}
										{isError && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="error-container">{t("LOGIN.ERROR")}</div>
										)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<Field
												name="j_username"
												type="text"
												id="email"
												placeholder={t("LOGIN.USERNAME")}
												className={cn("login-input", {
													error:
														(formik.touched.j_username &&
															formik.errors.j_username) ||
														isError,
												})}
												autoFocus="autoFocus"
											/>
										</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<Field
												name="j_password"
												type="password"
												id="password"
												placeholder={t("LOGIN.PASSWORD")}
												className={cn("login-input", {
													error:
														(formik.touched.j_password &&
															formik.errors.j_password) ||
														isError,
												})}
											/>
										</div>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="row remember-me">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<Field
												type="checkbox"
												id="remember"
												name="_spring_security_remember_me"
											/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<label htmlFor="remember">{t("LOGIN.REMEMBER")}</label>
										</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<button
												className={cn("submit", {
													active: formik.dirty && formik.isValid,
													inactive: !(formik.dirty && formik.isValid),
												})}
												disabled={!(formik.dirty && formik.isValid)}
												onClick={() => formik.handleSubmit()}
												type="submit"
											>
												{t("LOGIN.LOGIN")}
											</button>
										</div>
									</div>
								)}
							</Formik>
						</div>

						{/*Language dropdown menu*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<nav className="login-nav nav-dd-container" id="nav-dd-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div
								className="nav-dd lang-dd"
								id="lang-dd"
// @ts-expect-error TS(2322): Type 'RefObject<unknown>' is not assignable to typ... Remove this comment to see the full error message
								ref={containerLang}
								onClick={() => setMenuLang(!displayMenuLang)}
							>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<img
									className="lang-flag"
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
									src={currentLanguage.flag}
// @ts-expect-error TS(2532): Object is possibly 'undefined'.
									alt={currentLanguage.code}
								/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<span>{currentLanguage.long}</span>
								{displayMenuLang && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<ul className="dropdown-ul">
										{languages.map((language, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<li key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<a
													href="#"
													onClick={() => changeLanguage(language.code)}
												>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<img
														className="lang-flag"
														src={language.flag}
														alt={language.code}
													/>
													{language.long}
												</a>
											</li>
										))}
									</ul>
								)}
							</div>
						</nav>
					</div>
				</section>
			</div>
		</>
	);
};

export default Login;
