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

	const lastModified = user?.ocVersion?.['last-modified']
		? new Date(user.ocVersion['last-modified']).toISOString().substring(0, 10)
		: 'unknown';
	const aboutEnabled = orgProperties['org.opencastproject.admin.display_about']?.toLowerCase() === 'true';

	return (
		<footer id="main-footer">
			<div className="default-footer">
				<ul>
					{/* Only render if a version is set */}
					{!!user.ocVersion && (
						<li>
							{"Opencast "}
							<span title={t('BUILD.VERSION')}>{user.ocVersion.version}</span>
							{hasAccess("ROLE_ADMIN", user) && (
								<span>
								{" – "} <span title={t('BUILD.COMMIT')}>{user.ocVersion.buildNumber || "undefined"}</span>
								{" – "} <span title={t('BUILD.DATE_DESC')}>{t("BUILD.BUILT_ON")} {lastModified}</span>
								</span>
							)}
						</li>
					)}
					{aboutEnabled && (
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
