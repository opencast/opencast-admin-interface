import React from "react";
import {
	getStatistics,
	hasStatisticsError,
} from "../../../../selectors/eventDetailsSelectors";
import TimeSeriesStatistics from "../../../shared/TimeSeriesStatistics";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchEventStatisticsValueUpdate } from "../../../../slices/eventDetailsSlice";

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
}) => {
	const dispatch = useAppDispatch();

	const statistics = useAppSelector(state => getStatistics(state));
	const hasError = useAppSelector(state => hasStatisticsError(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchEventStatisticsValueUpdateWrapper = (eventId: any, providerId: any, from: any, to: any, dataResolution: any, timeMode: any) => {
		dispatch(fetchEventStatisticsValueUpdate({eventId, providerId, from, to, dataResolution, timeMode}));
	}

	/* generates file name for download-link for a statistic */
// @ts-expect-error TS(7006): Parameter 'statsTitle' implicitly has an 'any' typ... Remove this comment to see the full error message
	const statisticsCsvFileName = (statsTitle) => {
		const sanitizedStatsTitle = statsTitle
			.replace(/[^0-9a-z]/gi, "_")
			.toLowerCase();
		return "export_event_" + eventId + "_" + sanitizedStatsTitle + ".csv";
	};

	return (
		<div className="modal-content">
			<div className="modal-body">
				<div className="full-col">
					{hasError ? (
						/* error message */
						<div className="obj">
							<header>{t(header) /* Statistics */}</header>
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
											resourceId={eventId}
											statTitle={t(stat.title)}
											providerId={stat.providerId}
											fromDate={stat.from}
											toDate={stat.to}
											timeMode={stat.timeMode}
											dataResolution={stat.dataResolution}
											statDescription={stat.description}
											onChange={fetchEventStatisticsValueUpdateWrapper}
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
					)}
				</div>
			</div>
		</div>
	);
};

export default EventDetailsStatisticsTab;
