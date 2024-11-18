import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import MainNav from "../shared/MainNav";
import TimeSeriesStatistics from "../shared/TimeSeriesStatistics";
import {
	getStatistics,
	hasStatistics as getHasStatistics,
	hasStatisticsError,
	isFetchingStatistics,
} from "../../selectors/statisticsSelectors";
import {
	getOrgId,
	getUserInformation,
} from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { fetchUserInfo } from "../../slices/userInfoSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import {
	fetchStatisticsPageStatistics,
	fetchStatisticsPageStatisticsValueUpdate,
} from "../../slices/statisticsSlice";
import { createChartOptions } from "../../utils/statisticsUtils";

const Statistics: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayNavigation, setNavigation] = useState(false);

	const organizationId = useAppSelector(state => getOrgId(state));
	const user = useAppSelector(state => getUserInformation(state));
	const statistics = useAppSelector(state => getStatistics(state));
	const hasStatistics = useAppSelector(state => getHasStatistics(state));
	const hasError = useAppSelector(state => hasStatisticsError(state));
	const isLoadingStatistics = useAppSelector(state => isFetchingStatistics(state));

	// fetch user information for organization id, then fetch statistics
	useEffect(() => {
		dispatch(fetchUserInfo())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
			dispatch(fetchStatisticsPageStatistics(organizationId)).then();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [organizationId]);

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	/* generates file name for download-link for a statistic */
	const statisticsCsvFileName = (statsTitle: string) => {
		const sanitizedStatsTitle = statsTitle
			.replace(/[^0-9a-z]/gi, "_")
			.toLowerCase();
		return (
			"export_organization?_" +
			organizationId +
			"_" +
			sanitizedStatsTitle +
			".csv"
		);
	};

	return (
		<span>
			<Header />
			<NavBar>
				{/* Include Burger-button menu */}
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

				<nav>
					{hasAccess("ROLE_UI_STATISTICS_ORGANIZATION_VIEW", user) && (
						<Link
							to="/statistics/organization"
							className={cn({ active: true })}
							onClick={() => {}}
						>
							{t("STATISTICS.NAVIGATION.ORGANIZATION")}
						</Link>
					)}
				</nav>
			</NavBar>

			{/* main view of this page, displays statistics */}
			<MainView open={displayNavigation}>
				<div className="obj statistics">
					{/* heading */}
					<div className="controls-container">
						<h1>
							{" "}
							{t("STATISTICS.NAVIGATION.ORGANIZATION") /* Organisation */}{" "}
						</h1>
					</div>

					{!isLoadingStatistics &&
						(hasError || !hasStatistics ? (
							/* error message */
							<div className="obj">
								<div className="modal-alert danger">
									{t("STATISTICS.NOT_AVAILABLE")}
								</div>
							</div>
						) : (
							/* iterates over the different available statistics */
							statistics.map((stat, key) => (
								<div className="obj" key={key}>
									{/* title of statistic */}
									<header className="no-expand">{t(stat.title)}</header>

									{stat.providerType === "timeSeries" ? (
										/* visualization of statistic for time series data */
										<div className="obj-container">
											<TimeSeriesStatistics
												resourceId={organizationId}
												statTitle={t(stat.title)}
												providerId={stat.providerId}
												fromDate={stat.from}
												toDate={stat.to}
												timeMode={stat.timeMode}
												dataResolution={stat.dataResolution}
												statDescription={stat.description}
												onChange={fetchStatisticsPageStatisticsValueUpdate}
												exportUrl={stat.csvUrl}
												exportFileName={statisticsCsvFileName}
												totalValue={stat.totalValue}
												sourceData={stat.values}
												chartLabels={stat.labels}
												chartOptions={createChartOptions(stat.timeMode, stat.dataResolution)}
											/>
										</div>
									) : (
										/* unsupported type message */
										<div className="modal-alert danger">
											{t("STATISTICS.UNSUPPORTED_TYPE")}
										</div>
									)}
								</div>
							))
						))}
				</div>
			</MainView>
			<Footer />
		</span>
    );
};

export default Statistics;
