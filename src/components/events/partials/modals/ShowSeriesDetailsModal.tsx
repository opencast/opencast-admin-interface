import { useEffect, useState } from "react";
import SeriesDetailsModal from "./SeriesDetailsModal";
import { useAppDispatch } from "../../../../store";
import { fetchSeriesDetailsMetadata, fetchSeriesDetailsAcls, fetchSeriesDetailsFeeds, fetchSeriesDetailsTheme, fetchSeriesDetailsThemeNames, fetchSeriesDetailsTobira } from "../../../../slices/seriesDetailsSlice";

export const ShowSeriesDetailsModal = (props: Parameters<typeof SeriesDetailsModal>[0]) => {
	const dispatch = useAppDispatch();

	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			await dispatch(fetchSeriesDetailsMetadata(props.seriesId));
			await dispatch(fetchSeriesDetailsAcls(props.seriesId));
			await dispatch(fetchSeriesDetailsFeeds(props.seriesId));
			await dispatch(fetchSeriesDetailsTheme(props.seriesId));
			await dispatch(fetchSeriesDetailsThemeNames());
			await dispatch(fetchSeriesDetailsTobira(props.seriesId));

			setLoaded(true);
		};

		fetchData();
	});

	return loaded && <SeriesDetailsModal {...props} />;
};
