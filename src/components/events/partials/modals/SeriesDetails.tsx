import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import {
	getSeriesDetailsExtendedMetadata,
	getSeriesDetailsFeeds,
	getSeriesDetailsMetadata,
	getSeriesDetailsTheme,
	getSeriesDetailsThemeNames,
	hasStatistics as seriesHasStatistics,
} from "../../../../selectors/seriesDetailsSelectors";
import { getOrgProperties, getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
import SeriesDetailsAccessTab from "../ModalTabsAndPages/SeriesDetailsAccessTab";
import SeriesDetailsThemeTab from "../ModalTabsAndPages/SeriesDetailsThemeTab";
import SeriesDetailsStatisticTab from "../ModalTabsAndPages/SeriesDetailsStatisticTab";
import SeriesDetailsFeedsTab from "../ModalTabsAndPages/SeriesDetailsFeedsTab";
import DetailsMetadataTab from "../ModalTabsAndPages/DetailsMetadataTab";
import DetailsExtendedMetadataTab from "../ModalTabsAndPages/DetailsExtendedMetadataTab";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	fetchSeriesStatistics,
	updateExtendedSeriesMetadata,
	updateSeriesMetadata,
} from "../../../../slices/seriesDetailsSlice";
import DetailsTobiraTab from "../ModalTabsAndPages/DetailsTobiraTab";

/**
 * This component manages the tabs of the series details modal
 */
const SeriesDetails = ({
	seriesId,
	policyChanged,
	setPolicyChanged,
}: {
	seriesId: string
	policyChanged: boolean
	setPolicyChanged: (policyChanged: boolean) => void
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const extendedMetadata = useAppSelector(state => getSeriesDetailsExtendedMetadata(state));
	const feeds = useAppSelector(state => getSeriesDetailsFeeds(state));
	const metadataFields = useAppSelector(state => getSeriesDetailsMetadata(state));
	const theme = useAppSelector(state => getSeriesDetailsTheme(state));
	const themeNames = useAppSelector(state => getSeriesDetailsThemeNames(state));
	const hasStatistics = useAppSelector(state => seriesHasStatistics(state));

	useEffect(() => {
		dispatch(fetchSeriesStatistics(seriesId));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [page, setPage] = useState(0);

	const user = useAppSelector(state => getUserInformation(state));
	const orgProperties = useAppSelector(state => getOrgProperties(state));
	const themesEnabled = (orgProperties['admin.themes.enabled'] || 'false').toLowerCase() === 'true';

	// information about each tab
	const tabs = [
		{
			tabNameTranslation: "EVENTS.SERIES.DETAILS.TABS.METADATA",
			accessRole: "ROLE_UI_SERIES_DETAILS_METADATA_VIEW",
			name: "metadata",
		},
		{
			tabNameTranslation: "EVENTS.SERIES.DETAILS.TABS.EXTENDED_METADATA",
			accessRole: "ROLE_UI_SERIES_DETAILS_METADATA_VIEW",
			name: "extended-metadata",
			hidden: !extendedMetadata || !(extendedMetadata.length > 0),
		},
		{
			tabNameTranslation: "EVENTS.SERIES.DETAILS.TABS.PERMISSIONS",
			accessRole: "ROLE_UI_SERIES_DETAILS_ACL_VIEW",
			name: "permissions",
		},
		{
			tabNameTranslation: "EVENTS.SERIES.DETAILS.TABS.THEME",
			accessRole: "ROLE_UI_SERIES_DETAILS_THEMES_VIEW",
			name: "theme",
			hidden: !theme && !themesEnabled
		},
		{
			tabNameTranslation: "EVENTS.SERIES.DETAILS.TABS.TOBIRA",
			accessRole: "ROLE_UI_SERIES_DETAILS_TOBIRA_VIEW",
			name: "tobira",
			hidden: false, // TODO: Set to true if there no tobira data
		},
		{
			tabNameTranslation: "EVENTS.SERIES.DETAILS.TABS.STATISTICS",
			accessRole: "ROLE_UI_SERIES_DETAILS_STATISTICS_VIEW",
			name: "statistics",
			hidden: !hasStatistics,
		},
	];

	const openTab = (tabNr: number) => {
		setPage(tabNr);
	};

	return (
		<>
			{/* navigation for navigating between tabs */}
			<nav className="modal-nav" id="modal-nav">
				{tabs.map((tab, index) => !tab.hidden && hasAccess(tab.accessRole, user) && (
					<button
						key={tab.name}
						className={"button-like-anchor " + cn({ active: page === index })}
						onClick={() => openTab(index)}
					>
						{t(tab.tabNameTranslation)}
					</button>
				))}
				{feeds.length > 0 && (
					<button className={"button-like-anchor " + cn({ active: page === 6 })} onClick={() => openTab(6)}>
						{"Feeds"}
					</button>
				)}
			</nav>

			{/* render modal content depending on current page */}
			<div>
				{page === 0 && (
					<DetailsMetadataTab
						metadataFields={metadataFields}
						resourceId={seriesId}
						header={tabs[page].tabNameTranslation}
						updateResource={updateSeriesMetadata}
						editAccessRole="ROLE_UI_SERIES_DETAILS_METADATA_EDIT"
					/>
				)}
				{page === 1 && (
					<DetailsExtendedMetadataTab
						resourceId={seriesId}
						metadata={extendedMetadata}
						updateResource={updateExtendedSeriesMetadata}
						editAccessRole="ROLE_UI_SERIES_DETAILS_METADATA_EDIT"
					/>
				)}
				{page === 2 && (
					<SeriesDetailsAccessTab
						seriesId={seriesId}
						header={tabs[page].tabNameTranslation}
						policyChanged={policyChanged}
						setPolicyChanged={setPolicyChanged}
					/>
				)}
				{page === 3 && (
					<SeriesDetailsThemeTab
						theme={theme}
						themeNames={themeNames}
						seriesId={seriesId}
					/>
				)}
				{page === 4 && (
					<DetailsTobiraTab
						kind="series"
						id={seriesId}
					/>
				)}
				{page === 5 && (
					<SeriesDetailsStatisticTab
						seriesId={seriesId}
						header={tabs[page].tabNameTranslation}
					/>
				)}
				{page === 6 && <SeriesDetailsFeedsTab feeds={feeds} />}
			</div>
		</>
	);
};

export default SeriesDetails;
