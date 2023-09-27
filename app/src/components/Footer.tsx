import React from "react";
import { connect } from "react-redux";
import {
	getOrgProperties,
	getUserInformation,
} from "../selectors/userInfoSelectors";
import { hasAccess } from "../utils/utils";

/**
 * Component that renders the footer
 */

// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
const Footer = ({ user, orgProperties }) => {
	const feedbackUrlPropertyId = "org.opencastproject.admin.feedback.url";

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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
	orgProperties: getOrgProperties(state),
});

export default connect(mapStateToProps)(Footer);
