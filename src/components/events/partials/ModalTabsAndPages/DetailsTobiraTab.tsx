import { useTranslation } from "react-i18next";
import Notifications from "../../../shared/Notifications";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getSeriesDetailsTobiraData, getSeriesDetailsTobiraDataError } from "../../../../selectors/seriesDetailsSelectors";
import { addNotification } from "../../../../slices/notificationSlice";
import { NOTIFICATION_CONTEXT } from "../../../../configs/modalConfig";
import { getEventDetailsTobiraData, getEventDetailsTobiraDataError } from "../../../../selectors/eventDetailsSelectors";

/**
 * This component renders the Tobira tab for new series and events
 * in their respective details modal.
 */
type DetailsTobiraTabProps = {
	kind: "series" | "event";
	id: string;
}
const DetailsTobiraTab = ({ kind, id }: DetailsTobiraTabProps) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const tobiraData = useAppSelector(state => kind === "series"
		? getSeriesDetailsTobiraData(state)
		: getEventDetailsTobiraData(state)
	);
	const error = useAppSelector(state => kind === "series"
		? getSeriesDetailsTobiraDataError(state)
		: getEventDetailsTobiraDataError(state)
	);

	const i18nKey = kind === "series" ? "SERIES" : "EVENTS";
	const prefix = kind === "series" ? "s" : "v";
	const directTobiraLink = tobiraData.baseURL + `/!${prefix}/:` + id;

	const copyTobiraDirectLink = () => {
		navigator.clipboard.writeText(directTobiraLink).then(function () {
			dispatch(addNotification({
				type: "info",
				key: "TOBIRA_COPIED_DIRECT_LINK",
				duration: 3000,
				parameter: undefined,
				context: NOTIFICATION_CONTEXT
			}));
		}, function () {
			dispatch(addNotification({
				type: "error",
				key: "TOBIRA_FAILED_COPYING_DIRECT_LINK",
				duration: 3000,
				parameter: undefined,
				context: NOTIFICATION_CONTEXT
			}));
		});
	}

	return (
		<div className="modal-content">
			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />
				<div className="full-col">
					<div className="obj list-obj">
						<header>
							{t(`EVENTS.${i18nKey}.DETAILS.TABS.TOBIRA`)}
						</header>
						{ !error &&
							<>
								<div className="obj-container">
									<a href={directTobiraLink}>
										{t(`EVENTS.${i18nKey}.DETAILS.TOBIRA.DIRECT_LINK`)}
									</a>
									<button
										className="tobira-copy-direct-link"
										onClick={() => copyTobiraDirectLink()}
										aria-label={t(`EVENTS.${i18nKey}.DETAILS.TOBIRA.COPY_DIRECT_LINK`)}
									>
										<i
											aria-hidden="true"
											className="fa fa-copy"
											title={t(`EVENTS.${i18nKey}.DETAILS.TOBIRA.COPY_DIRECT_LINK`)}
										/>
									</button>
								</div>
								<div className="obj-container">
									<div className="obj tbl-list">
										<header>
											{t(`EVENTS.${i18nKey}.DETAILS.TOBIRA.PAGES`)}
										</header>
										<div className="obj-container">
											<table className="main-tbl">
												<tbody>
													{(!tobiraData.hostPages || tobiraData.hostPages.length === 0) &&
														<tr>
															<td className="tobira-not-mounted">
															{t(`EVENTS.${i18nKey}.DETAILS.TOBIRA.NOT_MOUNTED`)}
															</td>
														</tr>
													}
													{tobiraData.hostPages.map(hostPage => (
														<tr key={hostPage.path}>
															<td>
																<a href={tobiraData.baseURL + hostPage.path}>
																	{hostPage.path !== '/' &&
																		<div>
																			<span className="tobira-page-separator">/</span>
																			{ hostPage.ancestors.map((ancestor, key) => (
																				<span key={key}>
																					{ancestor.title}
																					<span className="tobira-page-separator">/</span>
																				</span>
																			))}
																		</div>
																	}
																	<span className="tobira-leaf-page">
																		{hostPage.path !== '/' &&
																			<span>
																				{hostPage.title}
																			</span>
																		}
																		{hostPage.path === '/' &&
																			<span>
																				{t(`EVENTS.${i18nKey}.DETAILS.TOBIRA.HOMEPAGE`)}
																			</span>
																		}
																	</span>
																</a>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</>
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export default DetailsTobiraTab;
