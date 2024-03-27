import { useTranslation } from "react-i18next";
import Notifications from "../../../shared/Notifications";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getSeriesDetailsTobiraData, getSeriesDetailsTobiraDataError } from "../../../../selectors/seriesDetailsSelectors";
import { addNotification } from "../../../../slices/notificationSlice";

/**
 * This component renders the theme page for new series in the new series wizard.
 */
const SeriesDetailsTobiraTab = ({

}: {

}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const tobiraData = useAppSelector(state => getSeriesDetailsTobiraData(state));
	const error = useAppSelector(state => getSeriesDetailsTobiraDataError(state));

	// const tobiraData = {
	// 	baseURL: "abc.de",
	// 	hostPages: [{
	// 		title: "Uno title",
	// 		path: "le path",
	// 		ancestors: [{
	// 			title: "One title"
	// 		}]
	// 	}],
	// };
	const resourceId = "???";
	const directTobiraLink = tobiraData.baseURL + '/!s/:' + resourceId;

	const copyTobiraDirectLink = () => {
		navigator.clipboard.writeText(directTobiraLink).then(function () {
			dispatch(addNotification({
				type: "info",
				key: "TOBIRA_COPIED_DIRECT_LINK",
				duration: 3000,
				parameter: null,
				context: 'series-tobira-details'
			}));
		}, function () {
			dispatch(addNotification({
				type: "error",
				key: "TOBIRA_FAILED_COPYING_DIRECT_LINK",
				duration: 3000,
				parameter: null,
				context: 'series-tobira-details'
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
							{t("EVENTS.SERIES.DETAILS.TABS.TOBIRA")}
						</header>
						{ !error &&
							<>
								<div className="obj-container">
									<a href={directTobiraLink}>
										{t("EVENTS.SERIES.DETAILS.TOBIRA.DIRECT_LINK")}
									</a>
									<button
										className="tobira-copy-direct-link"
										onClick={() => copyTobiraDirectLink()}
										aria-label={t('EVENTS.SERIES.DETAILS.TOBIRA.COPY_DIRECT_LINK')}
									>
										<i
											aria-hidden="true"
											className="fa fa-copy"
											title={t('EVENTS.SERIES.DETAILS.TOBIRA.COPY_DIRECT_LINK')}
										/>
									</button>
								</div>
								<div className="obj-container">
									<div className="obj tbl-list">
										<header>
											{t("EVENTS.SERIES.DETAILS.TOBIRA.PAGES")}
										</header>
										<div className="obj-container">
											<table className="main-tbl">
												<tbody>
													{(!tobiraData.hostPages || tobiraData.hostPages.length === 0) &&
														<tr>
															<td className="tobira-not-mounted">
															{t("EVENTS.SERIES.DETAILS.TOBIRA.NOT_MOUNTED")}
															</td>
														</tr>
													}
													{ tobiraData.hostPages.map((hostPage, key) => (
														<tr key={key}>
															<td>
																<a href={tobiraData.baseURL + hostPage.path}>
																	{ hostPage.path !== '/' &&
																		<div>
																			<span className="tobira-page-separator">/</span>
																			{ hostPage.ancestors.map((ancestor, key) => (
																				<span>
																					{ancestor.title}
																					<span className="tobira-page-separator">/</span>
																				</span>
																			))}
																		</div>
																	}
																	<span className="tobira-leaf-page">
																		{ hostPage.path !== '/' &&
																			<span>
																				{hostPage.title}
																			</span>
																		}
																		{ hostPage.path === '/' &&
																			<span>
																				{t("EVENTS.SERIES.DETAILS.TOBIRA.HOMEPAGE")}
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

export default SeriesDetailsTobiraTab;