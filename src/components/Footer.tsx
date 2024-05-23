import React from "react";
import {
	getOrgProperties,
	getUserInformation,
} from "../selectors/userInfoSelectors";
import { hasAccess } from "../utils/utils";
import { useAppSelector } from "../store";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Component that renders the footer
 */

const Footer: React.FC = () => {
	const { t } = useTranslation();
	const feedbackUrlPropertyId = "org.opencastproject.admin.feedback.url";

	const user = useAppSelector(state => getUserInformation(state));
	const orgProperties = useAppSelector(state => getOrgProperties(state));

	return (
		<footer id="main-footer">
			<div className="default-footer">
				<ul>
					{/* Only render if a version is set */}
					{!!user.ocVersion && (
						<li>
							Opencast {user.ocVersion.version}
							{hasAccess("ROLE_ADMIN", user) && (
								<span> - {user.ocVersion.buildNumber || "undefined"}</span>
							)}
						</li>
					)}
					{!!orgProperties && !!orgProperties["org.opencastproject.admin.display_about"] && (
						<>
						<li><Link to="/about/imprint">{t("ABOUT.IMPRINT")}</Link></li>
						<li><Link to="/about/privacy">{t("ABOUT.PRIVACY")}</Link></li>
						</>
					)}
				</ul>

				{/* Only render if a feedback URL is set*/}
				{!!orgProperties && !!orgProperties[feedbackUrlPropertyId] && (
					<div className="feedback-btn" id="feedback-btn">
						<a href={orgProperties[feedbackUrlPropertyId]}>Feedback</a>
					</div>
				)}
			</div>
		</footer>
	);
};

export default Footer;
