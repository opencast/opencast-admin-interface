import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import Header from "../Header";
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
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
import { fetchUserInfo } from "../../slices/userInfoSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import {
	fetchStatisticsPageStatistics,
	fetchStatisticsPageStatisticsValueUpdate,
} from "../../slices/statisticsSlice";

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

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchStatisticsPageStatisticsValueUpdateWrapper = (organizationId: any, providerId: any, from: any, to: any, dataResolution: any, timeMode: any) => {
		dispatch(fetchStatisticsPageStatisticsValueUpdate({organizationId, providerId, from, to, dataResolution, timeMode}))
	}

	useEffect(() => {
		// fetch user information for organization id, then fetch statistics
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
		fetchUserInfo().then((e) => {
			dispatch(fetchStatisticsPageStatistics(organizationId)).then();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	/* generates file name for download-link for a statistic */
// @ts-expect-error TS(7006): Parameter 'statsTitle' implicitly has an 'any' typ... Remove this comment to see the full error message
	const statisticsCsvFileName = (statsTitle) => {
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
			<section className="action-nav-bar">
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
			</section>

			{/* main view of this page, displays statistics */}
			<div
				className="main-view"
				style={displayNavigation ? styleNavOpen : styleNavClosed}
			>
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
												t={t}
												resourceId={organizationId}
												statTitle={t(stat.title)}
												providerId={stat.providerId}
												fromDate={stat.from}
												toDate={stat.to}
												timeMode={stat.timeMode}
												dataResolution={stat.dataResolution}
												statDescription={stat.description}
												onChange={fetchStatisticsPageStatisticsValueUpdateWrapper}
												exportUrl={stat.csvUrl}
												exportFileName={statisticsCsvFileName}
												totalValue={stat.totalValue}
												sourceData={stat.values}
												chartLabels={stat.labels}
												chartOptions={stat.options}
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
			</div>
			<Footer />
		</span>
    );
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
