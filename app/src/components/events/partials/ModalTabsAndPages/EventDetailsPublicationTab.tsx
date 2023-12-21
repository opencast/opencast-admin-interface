import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
		float: "right" as const,
		marginLeft: "auto",
	};

	useEffect(() => {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		fetchPublications(eventId).then((r) => console.info(r));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="modal-content">
				<div className="modal-body">
					<Notifications />
					<div className="full-col">
						<div className="obj list-obj">
							<header>{t("EVENTS.EVENTS.DETAILS.PUBLICATIONS.CAPTION")}</header>
							<div className="obj-container">
								{publications.length > 0 ? (
									<>
										<p>
											{t(
												"EVENTS.EVENTS.DETAILS.PUBLICATIONS.PUBLICATION_DESCRIPTION"
											)}
										</p>
										{/* list all publications depending on their existing information */}
										<ul>
{/* @ts-expect-error TS(7006): Parameter 'publication' implicitly has an 'any' ty... Remove this comment to see the full error message */}
											{publications.map((publication, key) => (
												<li key={key}>
													<div className="v-container">
														<span className="icon-container">
															{!!publication.icon ? (
																<i
																	className="custom-icon"
																	style={{
																		backgroundImage:
																			"url(" + publication.icon + ")",
																	}}
																/>
															) : (
																<i className="video-icon" />
															)}
														</span>
														<div>
															<span>{t(publication.name)}</span>
															{publication.description && (
																<p className="description">
																	{publication.description}
																</p>
															)}
														</div>

														{publication.enabled ? (
															<a className="play" href={publication.url} />
														) : (
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
