import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cn from "classnames";
// @ts-expect-error TS(6142): Module '../Header' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Header from "../Header";
// @ts-expect-error TS(6142): Module '../Footer' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Footer from "../Footer";
// @ts-expect-error TS(6142): Module '../shared/MainNav' was resolved to '/home/... Remove this comment to see the full error message
import MainNav from "../shared/MainNav";
// @ts-expect-error TS(6142): Module '../shared/TimeSeriesStatistics' was resolv... Remove this comment to see the full error message
import TimeSeriesStatistics from "../shared/TimeSeriesStatistics";
import {
	getStatistics,
	hasStatistics,
	hasStatisticsError,
	isFetchingStatistics,
} from "../../selectors/statisticsSelectors";
import {
	getOrgId,
	getUserInformation,
} from "../../selectors/userInfoSelectors";
import {
	fetchStatisticsPageStatistics,
	fetchStatisticsPageStatisticsValueUpdate,
} from "../../thunks/statisticsThunks";
import { hasAccess } from "../../utils/utils";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
import { fetchUserInfo } from "../../thunks/userInfoThunks";

const Statistics = ({
// @ts-expect-error TS(7031): Binding element 'organizationId' implicitly has an... Remove this comment to see the full error message
	organizationId,
// @ts-expect-error TS(7031): Binding element 'statistics' implicitly has an 'an... Remove this comment to see the full error message
	statistics,
// @ts-expect-error TS(7031): Binding element 'isLoadingStatistics' implicitly h... Remove this comment to see the full error message
	isLoadingStatistics,
// @ts-expect-error TS(7031): Binding element 'hasStatistics' implicitly has an ... Remove this comment to see the full error message
	hasStatistics,
// @ts-expect-error TS(7031): Binding element 'hasError' implicitly has an 'any'... Remove this comment to see the full error message
	hasError,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'fetchUserInfo' implicitly has an ... Remove this comment to see the full error message
	fetchUserInfo,
// @ts-expect-error TS(7031): Binding element 'loadStatistics' implicitly has an... Remove this comment to see the full error message
	loadStatistics,
// @ts-expect-error TS(7031): Binding element 'recalculateStatistics' implicitly... Remove this comment to see the full error message
	recalculateStatistics,
}) => {
	const { t } = useTranslation();

	const [displayNavigation, setNavigation] = useState(false);

	useEffect(() => {
		// fetch user information for organization id, then fetch statistics
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
		fetchUserInfo().then((e) => {
			loadStatistics(organizationId).then();
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
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Header />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section className="action-nav-bar">
				{/* Include Burger-button menu */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<nav>
					{hasAccess("ROLE_UI_STATISTICS_ORGANIZATION_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div
				className="main-view"
				style={displayNavigation ? styleNavOpen : styleNavClosed}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="obj statistics">
					{/* heading */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="controls-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<h1>
							{" "}
							{t("STATISTICS.NAVIGATION.ORGANIZATION") /* Organisation */}{" "}
						</h1>
					</div>

					{!isLoadingStatistics &&
						(hasError || !hasStatistics ? (
							/* error message */
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="modal-alert danger">
									{t("STATISTICS.NOT_AVAILABLE")}
								</div>
							</div>
						) : (
							/* iterates over the different available statistics */
// @ts-expect-error TS(7006): Parameter 'stat' implicitly has an 'any' type.
							statistics.map((stat, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj" key={key}>
									{/* title of statistic */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<header className="no-expand">{t(stat.title)}</header>

									{stat.providerType === "timeSeries" ? (
										/* visualization of statistic for time series data */
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<TimeSeriesStatistics
												t={t}
												resourceId={organizationId}
												statTitle={t(stat.title)}
												providerId={stat.providerId}
												fromDate={stat.from}
												toDate={stat.to}
												timeMode={stat.timeMode: any}
												dataResolution={stat.dataResolution}
												statDescription={stat.description}
												onChange={recalculateStatistics}
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="modal-alert danger">
											{t("STATISTICS.UNSUPPORTED_TYPE")}
										</div>
									)}
								</div>
							))
						))}
				</div>
			</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Footer />
		</span>
    );
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	organizationId: getOrgId(state),
	hasStatistics: hasStatistics(state),
	isLoadingStatistics: isFetchingStatistics(state),
	statistics: getStatistics(state),
	hasError: hasStatisticsError(state),
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	fetchUserInfo: () => dispatch(fetchUserInfo()),
// @ts-expect-error TS(7006): Parameter 'organizationId' implicitly has an 'any'... Remove this comment to see the full error message
	loadStatistics: (organizationId) =>
		dispatch(fetchStatisticsPageStatistics(organizationId)),
	recalculateStatistics: (
// @ts-expect-error TS(7006): Parameter 'organizationId' implicitly has an 'any'... Remove this comment to see the full error message
		organizationId,
// @ts-expect-error TS(7006): Parameter 'providerId' implicitly has an 'any' typ... Remove this comment to see the full error message
		providerId,
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
		from,
// @ts-expect-error TS(7006): Parameter 'to' implicitly has an 'any' type.
		to,
// @ts-expect-error TS(7006): Parameter 'dataResolution' implicitly has an 'any'... Remove this comment to see the full error message
		dataResolution,
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
		timeMode
	) =>
		dispatch(
			fetchStatisticsPageStatisticsValueUpdate(
				organizationId,
				providerId,
				from,
				to,
				dataResolution,
				timeMode
			)
		),
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
