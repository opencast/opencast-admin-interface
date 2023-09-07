import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Formik } from "formik";
// @ts-expect-error TS(6142): Module './modals/TermsOfUsePage' was resolved to '... Remove this comment to see the full error message
import TermsOfUsePage from "./modals/TermsOfUsePage";
import { countries, states } from "../../configs/adopterRegistrationConfig";
import cn from "classnames";
import { AdopterRegistrationSchema } from "../../utils/validate";
import {
	deleteAdopterRegistration,
	fetchAdopterRegistration,
	postRegistration,
} from "../../utils/adopterRegistrationUtils";

/**
 * This component renders the adopter registration modal. This modal has various states.
 */
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
const RegistrationModal = ({ close }) => {
	const { t } = useTranslation();

	// current state of the modal that is shown
	const [state, setState] = useState("form");
	// initial values for Formik
	const [initialValues, setInitialValues] = useState({});

	const handleClose = () => {
		close();
	};

	useEffect(() => {
		fetchRegistrationInfos().then((r) => console.log(r));
	}, []);

	const onClickContinue = async () => {
		// if state is delete_submit then delete infos about adaptor else show next state
		if (state === "delete_submit") {
			await resetRegistrationData();
		} else {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			setState(states[state].nextState[1]);
		}
	};

	const fetchRegistrationInfos = async () => {
		let registrationInfo = await fetchAdopterRegistration();

		// set response as initial values for formik
		setInitialValues(registrationInfo);
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		// post request for adopter information
		postRegistration(values)
			.then(() => {
				// show thank you state
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				return setState(states[state].nextState[0]);
			})
			.catch(() => {
				// show error state
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				return setState(states[state].nextState[1]);
			});
	};

	const resetRegistrationData = () => {
		// delete adopter information
		deleteAdopterRegistration()
			.then(() => {
				// show thank you state
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				return setState(states[state].nextState[0]);
			})
			.catch(() => {
				// show error state
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				return setState(states[state].nextState[1]);
			});
	};

	// style of label when input has content
	const styleWithContent = {
		fontSize: "70%",
		fontWeight: "700",
		transform: "translate3d(0, -35%, 0)",
		opacity: 1,
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section
				id="registration-modal"
				className="modal active modal-open modal-animation"
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						onClick={() => handleClose()}
						className="button-like-anchor fa fa-times close-modal"
					/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>{t("ADOPTER_REGISTRATION.MODAL.CAPTION")}</h2>
				</header>

				{/* shows information about the registration*/}
				{state === "information" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content" style={{ display: "block" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div
								className="registration-header"
								style={{ padding: "5px 0 15px 0" }}
							>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<h2>
									{t("ADOPTER_REGISTRATION.MODAL.INFORMATION_STATE.HEADER")}
								</h2>
							</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>
										{t(
											"ADOPTER_REGISTRATION.MODAL.INFORMATION_STATE.INFORMATION_PARAGRAPH_1"
										)}
									</p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<br />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>
										{t(
											"ADOPTER_REGISTRATION.MODAL.INFORMATION_STATE.INFORMATION_PARAGRAPH_2"
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* shows terms of use */}
				{state === "legal_info" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content" style={{ display: "block" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="scrollbox">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<TermsOfUsePage />
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* shows state after skipping the registration */}
				{state === "skip" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content" style={{ display: "block" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="registration-header">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<h2>{t("ADOPTER_REGISTRATION.MODAL.SKIP_STATE.HEADER")}</h2>
							</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span>
											{t("ADOPTER_REGISTRATION.MODAL.SKIP_STATE.TEXT")}
										</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<br />
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* shows delete confirmation */}
				{state === "delete_submit" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content" style={{ display: "block" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<span>
									{t("ADOPTER_REGISTRATION.MODAL.DELETE_SUBMIT_STATE.TEXT")}
								</span>
							</p>
						</div>
					</div>
				)}

				{/* shows spinner while API requests are processed */}
				{(state === "save" || state === "delete" || state === "update") && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content" style={{ display: "block" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="row spinner-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<i className="fa fa-spinner fa-spin fa-4x fa-fw" />
								</div>
							</div>
						</div>
					</div>
				)}

				{/* shows thank you after registration */}
				{state === "thank_you" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content" style={{ display: "block" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="registration-header">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<h2>
									{t("ADOPTER_REGISTRATION.MODAL.THANK_YOU_STATE.HEADER")}
								</h2>
							</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span>
											{t(
												"ADOPTER_REGISTRATION.MODAL.THANK_YOU_STATE.TEXT_LEADING_TO_PATH"
											)}
										</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<b>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											(<span>{t("HELP.HELP")}</span>)
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<span className="fa fa-question-circle" />>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<span>{t("HELP.ADOPTER_REGISTRATION")}</span>
										</b>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span>
											{" "}
											{t(
												"ADOPTER_REGISTRATION.MODAL.THANK_YOU_STATE.TEXT_LEADING_AFTER_PATH"
											)}
										</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* shows error */}
				{state === "error" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content" style={{ display: "block" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="registration-header">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<h2>{t("ADOPTER_REGISTRATION.MODAL.ERROR.HEADER")}</h2>
							</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span>{t("ADOPTER_REGISTRATION.MODAL.ERROR.TEXT")}</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* shows registration form containing adaptor information */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Formik
					initialValues={initialValues}
					enableReinitialize
					validationSchema={AdopterRegistrationSchema}
					onSubmit={(values) => handleSubmit(values)}
				>
					{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<>
							{state === "form" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="modal-content" style={{ display: "block" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<fieldset>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<legend>
													{t(
														"ADOPTER_REGISTRATION.MODAL.FORM_STATE.ORGANISATION"
													)}
												</legend>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<Field
																type="text"
																name="organisationName"
																id="adopter_organisation"
																className="form-control"
															/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<label
																className="form-control-placeholder"
																htmlFor="adopter_organisation"
																style={
// @ts-expect-error TS(2339): Property 'organisationName' does not exist on type... Remove this comment to see the full error message
																	formik.values.organisationName
																		? styleWithContent
																		: {}
																}
															>
																{t(
																	"ADOPTER_REGISTRATION.MODAL.FORM_STATE.ORGANISATION"
																)}
															</label>
														</div>
													</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<Field
																type="text"
																name="departmentName"
																id="adopter_department"
																className="form-control"
															/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<label
																className="form-control-placeholder"
																htmlFor="adopter_department"
																style={
// @ts-expect-error TS(2339): Property 'departmentName' does not exist on type '... Remove this comment to see the full error message
																	formik.values.departmentName
																		? styleWithContent
																		: {}
																}
															>
																{t(
																	"ADOPTER_REGISTRATION.MODAL.FORM_STATE.DEPARTMENT"
																)}
															</label>
														</div>
													</div>
												</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<Field
																style={{ color: "#666", fontWeight: "600" }}
																id="adopter_country"
																name="country"
																as="select"
																className="form-control"
															>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<option value="" />
																{countries.map((country, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<option key={key} value={country.code}>
																		{country.name}
																	</option>
																))}
															</Field>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<label
																className="form-control-placeholder"
																htmlFor="adopter_country"
																style={
// @ts-expect-error TS(2339): Property 'country' does not exist on type '{}'.
																	formik.values.country ? styleWithContent : {}
																}
															>
																{t(
																	"ADOPTER_REGISTRATION.MODAL.FORM_STATE.COUNTRY"
																)}
															</label>
														</div>
													</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group-pair">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<Field
																	type="text"
																	name="postalCode"
																	id="adopter_postalcode"
																	className="form-control"
																/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<label
																	className="form-control-placeholder"
																	htmlFor="adopter_postalcode"
																	style={
// @ts-expect-error TS(2339): Property 'postalCode' does not exist on type '{}'.
																		formik.values.postalCode
																			? styleWithContent
																			: {}
																	}
																>
																	{t(
																		"ADOPTER_REGISTRATION.MODAL.FORM_STATE.POSTAL_CODE"
																	)}
																</label>
															</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<Field
																	type="text"
																	name="city"
																	id="adopter_city"
																	className="form-control"
																/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<label
																	className="form-control-placeholder"
																	htmlFor="adopter_city"
																	style={
// @ts-expect-error TS(2339): Property 'city' does not exist on type '{}'.
																		formik.values.city ? styleWithContent : {}
																	}
																>
																	{t(
																		"ADOPTER_REGISTRATION.MODAL.FORM_STATE.CITY"
																	)}
																</label>
															</div>
														</div>
													</div>
												</div>
											</fieldset>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<fieldset>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<legend>
													{t(
														"ADOPTER_REGISTRATION.MODAL.FORM_STATE.CONTACT_INFO"
													)}
												</legend>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<Field
																type="text"
																name="firstName"
																id="adopter_firstname"
																className="form-control"
															/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<label
																className="form-control-placeholder"
																htmlFor="adopter_firstname"
																style={
// @ts-expect-error TS(2339): Property 'firstName' does not exist on type '{}'.
																	formik.values.firstName
																		? styleWithContent
																		: {}
																}
															>
																{t(
																	"ADOPTER_REGISTRATION.MODAL.FORM_STATE.FIRST_NAME"
																)}
															</label>
														</div>
													</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<Field
																type="text"
																name="lastName"
																id="adopter_lastname"
																className="form-control"
															/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<label
																className="form-control-placeholder"
																htmlFor="adopter_lastname"
																style={
// @ts-expect-error TS(2339): Property 'lastName' does not exist on type '{}'.
																	formik.values.lastName ? styleWithContent : {}
																}
															>
																{t(
																	"ADOPTER_REGISTRATION.MODAL.FORM_STATE.LAST_NAME"
																)}
															</label>
														</div>
													</div>
												</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<Field
																type="text"
																name="street"
																id="adopter_street"
																className="form-control"
															/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<label
																className="form-control-placeholder"
																htmlFor="adopter_street"
																style={
// @ts-expect-error TS(2339): Property 'street' does not exist on type '{}'.
																	formik.values.street ? styleWithContent : {}
																}
															>
																{t(
																	"ADOPTER_REGISTRATION.MODAL.FORM_STATE.STREET"
																)}
															</label>
														</div>
													</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<Field
																type="text"
																name="streetNo"
																id="adopter_streetnumber"
																className="form-control"
															/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<label
																className="form-control-placeholder"
																htmlFor="adopter_streetnumber"
																style={
// @ts-expect-error TS(2339): Property 'streetNo' does not exist on type '{}'.
																	formik.values.streetNo ? styleWithContent : {}
																}
															>
																{t(
																	"ADOPTER_REGISTRATION.MODAL.FORM_STATE.NUMBER"
																)}
															</label>
														</div>
													</div>
												</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<Field
																id="adopter_emailadr"
																name="email"
																type="email"
																className="form-control"
															/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<label
																className="form-control-placeholder"
																htmlFor="adopter_emailadr"
																style={
// @ts-expect-error TS(2339): Property 'email' does not exist on type '{}'.
																	formik.values.email ? styleWithContent : {}
																}
															>
																{t(
																	"ADOPTER_REGISTRATION.MODAL.FORM_STATE.MAIL"
																)}
															</label>
														</div>
													</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="form-group form-group-checkbox">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<Field
																type="checkbox"
																name="contactme"
																id="adopter_contactme"
																className="form-control"
															/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<label htmlFor="adopter_contactme">
																{t(
																	"ADOPTER_REGISTRATION.MODAL.FORM_STATE.CONTACT_ME"
																)}
															</label>
														</div>
													</div>
												</div>
											</fieldset>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<fieldset>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<legend>
													{t(
														"ADOPTER_REGISTRATION.MODAL.FORM_STATE.WHICH_DATA_TO_SHARE"
													)}
												</legend>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="form-group form-group-checkbox">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<Field
														type="checkbox"
														name="allowsStatistics"
														id="adopter_allows_statistics"
														className="form-control"
													/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<label htmlFor="adopter_allows_statistics">
														{t(
															"ADOPTER_REGISTRATION.MODAL.FORM_STATE.USAGE_STATISTICS"
														)}
													</label>
												</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="form-group form-group-checkbox">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<Field
														type="checkbox"
														name="allowsErrorReports"
														id="adopter_allows_err_reports"
														className="form-control"
													/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<label htmlFor="adopter_allows_err_reports">
														{t(
															"ADOPTER_REGISTRATION.MODAL.FORM_STATE.ERROR_REPORTS"
														)}
													</label>
												</div>
											</fieldset>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<fieldset>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<legend>
													{t(
														"ADOPTER_REGISTRATION.MODAL.FORM_STATE.POLICY_HEADLINE"
													)}
												</legend>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="form-group form-group-checkbox">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<Field
														type="checkbox"
														name="agreedToPolicy"
														id="agreedToPolicy"
														className="form-control"
													/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<label htmlFor="agreedToPolicy">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<span>
															{t(
																"ADOPTER_REGISTRATION.MODAL.FORM_STATE.READ_TERMS_OF_USE_BEFORE"
															)}
														</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<span
															className="link"
															onClick={() =>
																setState(states[state].nextState[2])
															}
														>
															{t(
																"ADOPTER_REGISTRATION.MODAL.FORM_STATE.READ_TERMS_OF_USE_LINK"
															)}
														</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<span>
															{t(
																"ADOPTER_REGISTRATION.MODAL.FORM_STATE.READ_TERMS_OF_USE_AFTER"
															)}
														</span>
													</label>
												</div>
											</fieldset>
										</div>
									</div>
								</div>
							)}

							{/* navigation buttons depending on state of modal */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<footer>
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
								{states[state].buttons.submit && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="pull-right">
										{/* submit of form content */}
										{state === "form" ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<button
												disabled={
// @ts-expect-error TS(2339): Property 'agreedToPolicy' does not exist on type '... Remove this comment to see the full error message
													!(formik.isValid && formik.values.agreedToPolicy)
												}
												onClick={() => formik.handleSubmit()}
												className={cn("submit", {
													active:
// @ts-expect-error TS(2339): Property 'agreedToPolicy' does not exist on type '... Remove this comment to see the full error message
														formik.isValid && formik.values.agreedToPolicy,
													inactive: !(
// @ts-expect-error TS(2339): Property 'agreedToPolicy' does not exist on type '... Remove this comment to see the full error message
														formik.isValid && formik.values.agreedToPolicy
													),
												})}
											>
												{t(states[state].buttons.submitButtonText)}
											</button>
										) : (
											// continue button or confirm button (depending on state)
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<button
												className="continue-registration"
												onClick={() => onClickContinue()}
											>
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
												{t(states[state].buttons.submitButtonText)}
											</button>
										)}
									</div>
								)}

								{/* back, delete or cancel button depending on state */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="pull-left">
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
									{state !== "form" && states[state].buttons.back && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<button
											className="cancel"
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
											onClick={() => setState(states[state].nextState[5])}
										>
											{t("ADOPTER_REGISTRATION.MODAL.BACK")}
										</button>
									)}
// @ts-expect-error TS(2339): Property 'registered' does not exist on type '{}'.
									{state === "form" && formik.values.registered && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<button
											className="danger"
											onClick={() => setState(states[state].nextState[4])}
										>
											{t("WIZARD.DELETE")}
										</button>
									)}
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
									{states[state].buttons.skip && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<button
											className="cancel"
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
											onClick={() => setState(states[state].nextState[2])}
										>
											{t("ADOPTER_REGISTRATION.MODAL.SKIP")}
										</button>
									)}
								</div>
							</footer>
						</>
					)}
				</Formik>
			</section>
		</>
	);
};

export default RegistrationModal;
