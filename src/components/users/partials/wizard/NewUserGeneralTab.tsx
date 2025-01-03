import React from "react";
import { Field } from "../../../shared/Field";
import { FormikProps } from "formik";
import Notifications from "../../../shared/Notifications";
import { useTranslation } from "react-i18next";
import cn from "classnames";

/**
 * This component renders the general user information tab for new users in the new users wizard.
 */
interface RequiredFormProps {
	username: string,
	name: string,
	email: string,
	password: string,
	passwordConfirmation: string,
}

const NewUserGeneralTab = <T extends RequiredFormProps>({
	formik
}: {
	formik: FormikProps<T>
}) => {
	const { t } = useTranslation();

	return (
		<div className="modal-content">
			<div className="modal-body">
				<div className="form-container">
					<Notifications />
					{/* Fields for user information needed */}
					<div className="row">
						<label>
							{t("USERS.USERS.DETAILS.FORM.USERNAME")}
							<i className="required">*</i>
						</label>
						<Field
							type="text"
							name="username"
							autoFocus
							className={cn({
								error: formik.touched.username && formik.errors.username,
							})}
							placeholder={t("USERS.USERS.DETAILS.FORM.USERNAME") + "..."}
						/>
					</div>
					<div className="row">
						<label>
							{t("USERS.USERS.DETAILS.FORM.NAME")}
							<i className="required">*</i>
						</label>
						<Field
							type="text"
							name="name"
							className={cn({
								error: formik.touched.name && formik.errors.name,
							})}
							placeholder={t("USERS.USERS.DETAILS.FORM.NAME") + "..."}
						/>
					</div>
					<div className="row">
						<label>
							{t("USERS.USERS.DETAILS.FORM.EMAIL")}
							<i className="required">*</i>
						</label>
						<Field
							type="text"
							name="email"
							className={cn({
								error: formik.touched.email && formik.errors.email,
							})}
							placeholder={t("USERS.USERS.DETAILS.FORM.EMAIL") + "..."}
						/>
					</div>
					<div className="row">
						<label>
							{t("USERS.USERS.DETAILS.FORM.PASSWORD")}
							<i className="required">*</i>
						</label>
						<Field
							type="password"
							name="password"
							className={cn({
								error: formik.touched.password && formik.errors.password,
							})}
							placeholder={t("USERS.USERS.DETAILS.FORM.PASSWORD") + "..."}
						/>
					</div>
					<div className="row">
						<label>
							{t("USERS.USERS.DETAILS.FORM.REPEAT_PASSWORD")}
							<i className="required">*</i>
						</label>
						<Field
							type="password"
							name="passwordConfirmation"
							className={cn({
								error:
									formik.touched.passwordConfirmation &&
									formik.errors.passwordConfirmation,
							})}
							placeholder={
								t("USERS.USERS.DETAILS.FORM.REPEAT_PASSWORD") + "..."
							}
						/>
					</div>
					<PasswordStrengthIndicator
						password={formik.values.password}
					/>
				</div>
			</div>
		</div>
	);
};

const PasswordStrengthIndicator = ({
	password
}: {
	password: string
}) => {
	const { t } = useTranslation();

	// bad passwords from https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
	// plus Opencast"s default password
	const bad_passwords = ["0", "111111", "1111111", "123", "123123", "123321",
		"1234", "12345", "123456", "1234567", "12345678", "123456789", "1234567890",
		"12345679", "123qwe", "18atcskd2w", "1q2w3e", "1q2w3e4r", "1q2w3e4r5t",
		"3rjs1la7qe", "555555", "654321", "666666", "7777777", "888888",
		"987654321", "aa12345678", "abc123", "admin", "dragon", "Dragon", "google",
		"iloveyou", "Iloveyou", "lovely", "Monkey", "mynoob", "password",
		"password1", "password12", "password123", "princess", "qwerty", "qwerty123", "qwertyuiop",
		"Qwertyuiop", "welcome", "zxcvbnm", "opencast" ];

	function testPassword(regex: RegExp) {
		return !!password && regex.test(password);
	}

	const calcStrength = (password: string) => {
		if (bad_passwords.indexOf(password) > -1) {
			return 0;
		}

		const rules = [/[A-Z]/, /[a-z]/, /\d/, /\W/, /^.{8,}$/]

		const ruleScore: number = rules.reduce((acc, rule) => acc + Number(testPassword(rule)), 0);

		const usedRules = (ruleScore - rules.length) * rules.length;

		const uniqueChars = new Set(password).size * 2;
		const password_length = password.length * 4;
		const lowerCase = (password.length - password.replace(/[a-z]/g, "").length) * 2;
		const upperCase = (password.length - password.replace(/[A-Z]/g, "").length) * 2;
		const number = (password.length - password.replace(/[0-9]/g, "").length) * 4;
		const symbol = (password.length - password.replace(/\W/g, "").length) * 6;

		const strength = Math.max(1, usedRules + uniqueChars + password_length + lowerCase + upperCase + number + symbol);
		return Math.round(strength);
	}

	const setProgBar = (strength: number) => {
		if (strength >= 90) {
			return ["green", "USERS.USERS.DETAILS.STRENGTH.VERYSTRONG"]
		}
		else if (strength >= 70) {
			return ["#388ed6", "USERS.USERS.DETAILS.STRENGTH.STRONG"]
		}
		else if (strength >= 50) {
			return ["gold", "USERS.USERS.DETAILS.STRENGTH.GOOD"]
		}
		else if (strength >= 30) {
			return ["darkorange", "USERS.USERS.DETAILS.STRENGTH.WEAK"]
		}
		else if (strength > 1) {
			return ["red", "USERS.USERS.DETAILS.STRENGTH.VERYWEAK"]
		}
		else if (strength <= 1){
			return ["white", "USERS.USERS.DETAILS.STRENGTH.BAD"]
		}

		return ["", ""];
	}

	const strength = calcStrength(password);
	const [ barColor, barText ] = setProgBar(strength);

	const progressBarStyle = {
		background: barColor,
		width: strength + "%",
	}

	return (
		<div>
			<div className="progress pw-strength">
				<div id="bar" className="progress-bar" style={progressBarStyle}></div>
			</div>
			<label id="pw" style={{textAlign: "left"}}>{t(barText)}</label>
		</div>
	);
}

export default NewUserGeneralTab;
