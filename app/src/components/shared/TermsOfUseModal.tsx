import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Formik } from "formik";
import cn from "classnames";
import axios from "axios";


const TermsOfUseModal = () => {
	const { t } = useTranslation();
	const [initialValues, setInitialValues] = useState({});

	// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = async (values) => {
		let body = new URLSearchParams();
		body.append("agreedToTerms", values.agreedToTerms);

		await axios.post("/admin-ng/termsofuse", body, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
	};

	return (
		<>
			<div className="modal-animation modal-overlay" />
			<section id="registration-modal" className="modal active modal-open modal-animation">
				<header>
					<h2>{t("TERMSOFUSE")}</h2>
				</header>

				<div className="modal-content" style={{ display: "block" }}>
					<div className="modal-body">
						<div>
							<div className="row">
								<div className="scrollbox">
									Terms Of Use ..
								</div>
							</div>
						</div>
					</div>
				</div>

				<Formik
					initialValues={initialValues}
					enableReinitialize
					onSubmit={(values) => handleSubmit(values)}
				>
					{(formik) => (
						<>
						<div className="modal-content" style={{ display: "block" }}>
							<div className="modal-body">
								<div>
									<fieldset>
										<legend>Terms of Use</legend>
										<div className="form-group form-group-checkbox">
											<Field
												type="checkbox"
												name="agreedToTerms"
												id="agreedToTerms"
												className="form-control"
											/>
											<label htmlFor="agreedToTerms">
												<span>I have read and agree to the terms of use</span>
											</label>
										</div>
									</fieldset>
								</div>
							</div>
						</div>

						<footer>
							<div className="pull-right">
								<button
									disabled={
										// @ts-expect-error TS(2339): Property 'agreedToTerms' does not exist on type '... Remove this comment to see the full error message
										!(formik.isValid && formik.values.agreedToTerms)
									}
									onClick={() => formik.handleSubmit()}
									className={cn("submit", {
										active:
											// @ts-expect-error TS(2339): Property 'agreedToTerms' does not exist on type '... Remove this comment to see the full error message
											formik.isValid && formik.values.agreedToTerms,
										inactive: !(
											// @ts-expect-error TS(2339): Property 'agreedToTerms' does not exist on type '... Remove this comment to see the full error message
											formik.isValid && formik.values.agreedToTerms
										),
									})}
								>
									Submit
								</button>
							</div>
						</footer>
						</>
					)}
				</Formik>
			</section>
		</>
	);
};

export default TermsOfUseModal;
