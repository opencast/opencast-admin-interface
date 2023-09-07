import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import { getPublications } from "../../../../selectors/eventDetailsSelectors";
import { fetchEventPublications } from "../../../../thunks/eventDetailsThunks";
import { connect } from "react-redux";

const EventDetailsPublicationTab = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 'fetchPublications' implicitly has... Remove this comment to see the full error message
	fetchPublications,
// @ts-expect-error TS(7031): Binding element 'publications' implicitly has an '... Remove this comment to see the full error message
	publications,
}) => {
	const { t } = useTranslation();

	const styleSpan = {
		display: "inline-block",
		float: "right",
		marginLeft: "auto",
	};

	useEffect(() => {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		fetchPublications(eventId).then((r) => console.info(r));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<Notifications />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>{t("EVENTS.EVENTS.DETAILS.PUBLICATIONS.CAPTION")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container">
								{publications.length > 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<p>
											{t(
												"EVENTS.EVENTS.DETAILS.PUBLICATIONS.PUBLICATION_DESCRIPTION"
											)}
										</p>
										{/* list all publications depending on their existing information */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<ul>
// @ts-expect-error TS(7006): Parameter 'publication' implicitly has an 'any' ty... Remove this comment to see the full error message
											{publications.map((publication, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<li key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="v-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<span className="icon-container">
															{!!publication.icon ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<i
																	className="custom-icon"
																	style={{
																		backgroundImage:
																			"url(" + publication.icon + ")",
																	}}
																/>
															) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<i className="video-icon" />
															)}
														</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<span>{t(publication.name)}</span>
															{publication.description && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<p className="description">
																	{publication.description}
																</p>
															)}
														</div>

														{publication.enabled ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<a className="play" href={publication.url} />
														) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<span style={styleSpan}>
																{t(
																	"EVENTS.EVENTS.DETAILS.PUBLICATIONS.LIVE_EVENT_NOT_IN_PROGRESS"
																)}
															</span>
														)}
													</div>
												</li>
											))}
										</ul>
									</>
								) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>
										{t(
											"EVENTS.EVENTS.DETAILS.PUBLICATIONS.NO_PUBLICATIONS_AVAILABLE"
										)}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	publications: getPublications(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchPublications: (eventId) => dispatch(fetchEventPublications(eventId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsPublicationTab);
