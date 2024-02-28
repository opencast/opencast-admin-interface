import React from "react";
import {
	getOrgProperties,
	getUserInformation,
} from "../selectors/userInfoSelectors";
import { hasAccess } from "../utils/utils";
import { useAppSelector } from "../store";

/**
 * Component that renders the footer
 */

const Footer: React.FC = () => {
	const feedbackUrlPropertyId = "org.opencastproject.admin.feedback.url";

	const user = useAppSelector(state => getUserInformation(state));
	const orgProperties = useAppSelector(state => getOrgProperties(state));

	return (
		<footer id="main-footer">
			<div className="default-footer">
				{/* Only render if a version is set */}
				{!!user.ocVersion && (
					<div className="meta">
						Opencast {user.ocVersion.version}
						{hasAccess("ROLE_ADMIN", user) && (
							<span> - {user.ocVersion.buildNumber || "undefined"}</span>
						)}
					</div>
				)}
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
