import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Formik } from "formik";
import cn from "classnames";
import axios from "axios";
import i18n from "../../i18n/i18n";
import DOMPurify from "dompurify";


const TermsOfUseModal = () => {
	const { t } = useTranslation();
	const initialValues = {};
	const [termsContent, setTermsContent] = useState<string>("");
	const [agreedToTerms, setAgreedToTerms] = useState(true);

	// Check if already accepted terms
	useEffect(() => {
		const checkTerms = async () => {
		  try {
			const response = await axios.get("/admin-ng/user-settings/settings.json");
			// @ts-expect-error TS(7006): Parameter 'result' implicitly has an 'any' type.
			const isAgreed = response.data.results.some(result => result.key === "agreedToTerms" && result.value === "true");
			setAgreedToTerms(isAgreed);
		  } catch (error) {
			console.error("Fehler beim Abrufen der Daten:", error);
			setAgreedToTerms(false);
		  }
		};

		checkTerms();
	}, []);

	// Fetch terms
	useEffect(() => {
		const getURL = (language: string) => {
			return `ui/config/admin-ui/terms.${language}.html`;
		};

		axios.get(getURL(i18n.language))
			.then(response => {
				setTermsContent(response.data);
			})
			.catch(error => {
				axios.get(getURL(typeof i18n.options.fallbackLng === 'string' ? i18n.options.fallbackLng : 'en-US'))
					.then(response => {
						setTermsContent(response.data);
					})
					.catch(error => {
						console.error('Error while fetching data:', error);
						setTermsContent(t("TERMS.NOCONTENT").toString());
					});
			});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agreedToTerms]); // Listen to changes in agreedToTerms

	// Set terms to user settings
	// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = async (values) => {
		let body = new URLSearchParams();
		body.append("key", "agreedToTerms");
		body.append("value", values.agreedToTerms);

		await axios.post("/admin-ng/user-settings/setting", body, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		setAgreedToTerms(true);
	};

	// If already accepted terms, dont display anything
	if (agreedToTerms) {
		return null;
	}

	// Else display terms
	return (
		<>
			<div className="modal-animation modal-overlay" />
			<section id="registration-modal" className="modal active modal-open modal-animation">
				<header>
					<h2>{t("TERMS.TITLE")}</h2>
				</header>

				<div className="modal-content" style={{ display: "block" }}>
					<div className="modal-body">
						<div>
							<div className="row">
								<div className="scrollbox">
									<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(termsContent) }} ></div>
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
										<legend>{t("TERMS.TITLE")}</legend>
										<div className="form-group form-group-checkbox">
											<Field
												type="checkbox"
												name="agreedToTerms"
												id="agreedToTerms"
												className="form-control"
											/>
											<label htmlFor="agreedToTerms">
												<span>{t("TERMS.AGREE")}</span>
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
