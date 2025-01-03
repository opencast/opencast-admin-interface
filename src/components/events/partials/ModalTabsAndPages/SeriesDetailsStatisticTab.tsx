import React from "react";
import { useTranslation } from "react-i18next";
import {
	getStatistics,
	hasStatisticsError,
} from "../../../../selectors/seriesDetailsSelectors";
import { fetchSeriesStatisticsValueUpdate } from "../../../../slices/seriesDetailsSlice";
import TimeSeriesStatistics from "../../../shared/TimeSeriesStatistics";
import { useAppDispatch, useAppSelector } from "../../../../store";

const SeriesDetailsStatisticTab = ({
	seriesId,
	header,
}: {
	seriesId: string,
	header: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const statistics = useAppSelector(state => getStatistics(state));
	const hasError = useAppSelector(state => hasStatisticsError(state));

		// TODO: Get rid of the wrappers when modernizing redux is done
		const fetchSeriesStatisticsValueUpdateWrapper = (seriesId: any, providerId: any, from: any, to: any, dataResolution: any, timeMode: any) => {
			dispatch(fetchSeriesStatisticsValueUpdate({seriesId, providerId, from, to, dataResolution, timeMode}));
		}

	/* generates file name for download-link for a statistic */
	const statisticsCsvFileName = (statsTitle: string) => {
		const sanitizedStatsTitle = statsTitle
			.replace(/[^0-9a-z]/gi, "_")
			.toLowerCase();
		return "export_series_" + seriesId + "_" + sanitizedStatsTitle + ".csv";
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
											resourceId={seriesId}
											statTitle={t(stat.title)}
											providerId={stat.providerId}
											fromDate={stat.from}
											toDate={stat.to}
											timeMode={stat.timeMode}
											dataResolution={stat.dataResolution}
											statDescription={stat.description}
											onChange={fetchSeriesStatisticsValueUpdateWrapper}
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
export default SeriesDetailsStatisticTab;
