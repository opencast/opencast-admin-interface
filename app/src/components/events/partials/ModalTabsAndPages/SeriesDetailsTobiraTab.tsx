import { useTranslation } from "react-i18next";

/**
 * This component renders the theme page for new series in the new series wizard.
 */
const SeriesDetailsTobiraTab = ({

}: {

}) => {
	const { t } = useTranslation();

	const tobiraData = {
		error: false,
		baseURL: "abc.de",
		hostPages: [{
			title: "Uno title",
			path: "le path",
			ancestors: [{
				title: "One title"
			}]
		}],
	};
	const directTobiraLink = "";

	const copyTobiraDirectLink = () => {

	}

	console.log(!tobiraData.hostPages)
	console.log(tobiraData.hostPages.length === 0)

	return (
		<div className="modal-content">
			<div className="modal-body">
				<div className="full-col">
					<div className="obj list-obj">
						<header>
							{t("EVENTS.SERIES.DETAILS.TABS.TOBIRA")}
						</header>
						{ !tobiraData.error &&
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