import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Notifications from "../../../shared/Notifications";
import { getPublications } from "../../../../selectors/eventDetailsSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchEventPublications } from "../../../../slices/eventDetailsSlice";
import ModalContentTable from "../../../shared/modals/ModalContentTable";

const EventDetailsPublicationTab = ({
	eventId,
}: {
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const publications = useAppSelector(state => getPublications(state));

	const styleSpan = {
		display: "inline-block",
		float: "right" as const,
		marginLeft: "auto",
	};

	useEffect(() => {
		dispatch(fetchEventPublications(eventId)).then((r) => console.info(r));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<ModalContentTable
				modalBodyChildren={<Notifications />}
			>
				<div className="obj list-obj">
					<header>{t("EVENTS.EVENTS.DETAILS.PUBLICATIONS.CAPTION")}</header>
					<div className="obj-container">
						{publications?.length > 0 ? (
							<>
								<p>
									{t(
										"EVENTS.EVENTS.DETAILS.PUBLICATIONS.PUBLICATION_DESCRIPTION"
									)}
								</p>
								{/* list all publications depending on their existing information */}
								<ul>
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
													// eslint-disable-next-line jsx-a11y/anchor-has-content
													<a className="play" href={publication.url} target="_blank" rel="noreferrer"/>
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
			</ModalContentTable>
		</>
	);
};

export default EventDetailsPublicationTab;
