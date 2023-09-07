import React from "react";
import {
	getStatistics,
	hasStatisticsError,
} from "../../../../selectors/eventDetailsSelectors";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../../../shared/TimeSeriesStatistics' was ... Remove this comment to see the full error message
import TimeSeriesStatistics from "../../../shared/TimeSeriesStatistics";
import { fetchEventStatisticsValueUpdate } from "../../../../thunks/eventDetailsThunks";

/**
 * This component manages the statistics tab of the event details modal
 */
const EventDetailsStatisticsTab = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 'header' implicitly has an 'any' t... Remove this comment to see the full error message
	header,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'statistics' implicitly has an 'an... Remove this comment to see the full error message
	statistics,
// @ts-expect-error TS(7031): Binding element 'hasError' implicitly has an 'any'... Remove this comment to see the full error message
	hasError,
// @ts-expect-error TS(7031): Binding element 'recalculateStatistics' implicitly... Remove this comment to see the full error message
	recalculateStatistics,
}) => {
	/* generates file name for download-link for a statistic */
// @ts-expect-error TS(7006): Parameter 'statsTitle' implicitly has an 'any' typ... Remove this comment to see the full error message
	const statisticsCsvFileName = (statsTitle) => {
		const sanitizedStatsTitle = statsTitle
			.replace(/[^0-9a-z]/gi, "_")
			.toLowerCase();
		return "export_event_" + eventId + "_" + sanitizedStatsTitle + ".csv";
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
					{hasError ? (
						/* error message */
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>{t(header) /* Statistics */}</header>
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
											resourceId={eventId}
											statTitle={t(stat.title)}
											providerId={stat.providerId}
											fromDate={stat.from}
											toDate={stat.to}
											timeMode={stat.timeMode}
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
					)}
				</div>
			</div>
		</div>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	statistics: getStatistics(state),
	hasError: hasStatisticsError(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	recalculateStatistics: (
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
		eventId,
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
			fetchEventStatisticsValueUpdate(
				eventId,
				providerId,
				from,
				to,
				dataResolution,
				timeMode
			)
		),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsStatisticsTab);
