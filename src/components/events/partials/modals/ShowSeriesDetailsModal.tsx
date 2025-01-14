import { useEffect, useState } from "react";
import SeriesDetailsModal from "./SeriesDetailsModal";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchSeriesDetailsMetadata, fetchSeriesDetailsAcls, fetchSeriesDetailsFeeds, fetchSeriesDetailsTheme, fetchSeriesDetailsThemeNames, fetchSeriesDetailsTobira } from "../../../../slices/seriesDetailsSlice";
import { useSearchParams } from "react-router-dom";
import { getSeriesDetailsMetadata } from "../../../../selectors/seriesDetailsSelectors";

export const ShowSeriesDetailsModal = () => {

	const [searchParams, setSearchParams] = useSearchParams();
	const seriesId = searchParams.get('seriesId');
	const metadata = useAppSelector(state => getSeriesDetailsMetadata(state));
	const title = metadata.fields.find(field => field.id === "title")?.value as string;

	const [loaded, setLoaded] = useState(false);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!seriesId) {
			setLoaded(false);
			return;
		}

		const fetchData = async () => {
			await dispatch(fetchSeriesDetailsMetadata(seriesId));
			await dispatch(fetchSeriesDetailsAcls(seriesId));
			await dispatch(fetchSeriesDetailsFeeds(seriesId));
			await dispatch(fetchSeriesDetailsTheme(seriesId));
			await dispatch(fetchSeriesDetailsThemeNames());
			await dispatch(fetchSeriesDetailsTobira(seriesId));

			setLoaded(true);
		};

		fetchData();
	}, [seriesId, dispatch]);

	const handleClose = () => {
		setSearchParams(params => {
			params.delete('seriesId');
			return params;
		});
	};

	return loaded && <SeriesDetailsModal
		seriesId={seriesId!}
		seriesTitle={title!}
		handleClose={handleClose}
	/>;
};
