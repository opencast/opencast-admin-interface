import React from "react";
import { useTranslation } from "react-i18next";

const TermsOfUsePage = () => {
	const { t } = useTranslation();

	const paragraphStyle = {
		paddingBottom: "15px",
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<h1
				style={{
					fontSize: "x-large",
// @ts-expect-error TS(2322): Type '{ fontSize: string; marginButton: string; }'... Remove this comment to see the full error message
					marginButton: "15px",
				}}
			>
				{t("ADOPTER_REGISTRATION.MODAL.LEGAL_INFO_STATE.HEADER")}
			</h1>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p style={paragraphStyle}>
				Thank you for using Opencast. We really appreciate your registration.
				You can change the data you provided at any time. To do so, go to the
				“Opencast Registration” in the menu “Help” of the administrative user
				interface. If you deleted your Opencast installation, want to remove
				your account but cannot anymore, please write an email to
				support@opencast.org.
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p style={paragraphStyle}>
				Although Opencast is free, open-source software it is important for us,
				to know how Opencast is used. For instance, hardware vendors want to
				know how large the market is before they make their devices Opencast
				compatible. Even public funding for further development relies on such
				data.
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p style={paragraphStyle}>
				Note that you can choose which data you want to provide and do not have
				to agree to sending data from all categories.
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<h1
				style={{
					fontSize: "x-large",
					margin: "15px 0",
				}}
			>
				What Happens With Your Data
			</h1>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p
				style={{
					paddingBottom: "10px",
					fontWeight: "bold",
				}}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<span>Personal/Organizational Data</span>
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p style={paragraphStyle}>
				If provided, we will publish the name of your institution on
				opencast.org and set a geographical marker for your institution on the
				Opencast adopter’s map.
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p
				style={{
					paddingBottom: "10px",
					fontWeight: "bold",
				}}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<span>Usage Statistics and Technical Data</span>
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p style={paragraphStyle}>
				This data is anonymized and will be stored without any relation to your
				organizational or personal data. The data will be sent in a regular
				interval. The data sent may include the following information:
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<ul
				style={{
					paddingLeft: "30px",
					listStyle: "disc",
					paddingBottom: "15px",
					color: "#333",
				}}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>A timestamp at which this data has been created</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>
					An identifier marking the data source but is impossible to link to
					your personal or organizational data
				</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>The number and status of events in your Opencast system</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>The total duration of all media in your Opencast system</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>The number of series in your Opencast system</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>The number of capture agents connected to your Opencast system</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>The version of your Opencast system</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>
					Technical data regarding servers in your Opencast system
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<ul
						style={{
							paddingLeft: "80px",
							listStyle: "circle",
						}}
					>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<li>A unique anonymous identifier for each server</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<li>The number of CPU cores of each server</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<li>The system memory of each server</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<li>The disk space of each server</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<li>The Opencast services running on each server</li>
					</ul>
				</li>
			</ul>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p
				style={{
					paddingBottom: "10px",
					fontWeight: "bold",
				}}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<span>Error Reports</span>
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p style={paragraphStyle}>
				Error reports can be automatically sent so that we can monitor if there
				are systematic errors within Opencast that were not detected in our QA.
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p style={paragraphStyle}>
				Note that this data will be linked to your organization so that we are
				able to warn you in case we found a critical behavior. The error reports
				may also contain information about your content. This data will not be
				public. It will only be accessible to Opencast committers.
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p
				style={{
					paddingBottom: "10px",
				}}
			>
				The data sent may include the following information:
			</p>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<ul
				style={{
					paddingLeft: "30px",
					listStyle: "disc",
					paddingBottom: "15px",
					color: "#333",
				}}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<span>Stack traces</span>
				</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>Error messages</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>A timestamp when the error occurred</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<li>The Opencast version</li>
			</ul>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<h1
				style={{
					fontSize: "x-large",
					margin: "15px 0",
				}}
			>
				Thanks!
			</h1>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<p
				style={{
					paddingBottom: "25px",
				}}
			>
				We highly appreciate any feedback, as even some of the data that we
				gather about the Opencast usage will help us to create better software,
				have better chances for additional funding and attract more companies to
				provide services around Opencast.
			</p>
		</>
	);
};

export default TermsOfUsePage;
