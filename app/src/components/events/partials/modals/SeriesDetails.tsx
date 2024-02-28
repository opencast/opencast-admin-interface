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
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
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

/**
 * This component manages the tabs of the series details modal
 */
const SeriesDetails = ({
// @ts-expect-error TS(7031): Binding element 'seriesId' implicitly has an 'any'... Remove this comment to see the full error message
	seriesId,
// @ts-expect-error TS(7031): Binding element 'policyChanged' implicitly has an ... Remove this comment to see the full error message
	policyChanged,
// @ts-expect-error TS(7031): Binding element 'setPolicyChanged' implicitly has ... Remove this comment to see the full error message
	setPolicyChanged,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const extendedMetadata = useAppSelector(state => getSeriesDetailsExtendedMetadata(state));
	const feeds = useAppSelector(state => getSeriesDetailsFeeds(state));
	const metadataFields = useAppSelector(state => getSeriesDetailsMetadata(state));
	const theme = useAppSelector(state => getSeriesDetailsTheme(state));
	const themeNames = useAppSelector(state => getSeriesDetailsThemeNames(state));
	const hasStatistics = useAppSelector(state => seriesHasStatistics(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const updateSeriesMetadataWrapper = (id: any, values: any) => {
		dispatch(updateSeriesMetadata({id, values}));
	}
	const updateExtendedSeriesMetadataWrapper = (id: any, values: any, catalog: any) => {
		dispatch(updateExtendedSeriesMetadata({id, values, catalog}));
	}

	useEffect(() => {
		dispatch(fetchSeriesStatistics(seriesId)).then();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [page, setPage] = useState(0);

	const user = useAppSelector(state => getUserInformation(state));

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
		},
		{
			tabNameTranslation: "EVENTS.SERIES.DETAILS.TABS.STATISTICS",
			accessRole: "ROLE_UI_SERIES_DETAILS_STATISTICS_VIEW",
			name: "statistics",
			hidden: !hasStatistics,
		},
		{
			tabNameTranslation: "Feeds",
			name: "feeds",
		},
	];

// @ts-expect-error TS(7006): Parameter 'tabNr' implicitly has an 'any' type.
	const openTab = (tabNr) => {
		setPage(tabNr);
	};

	return (
		<>
			{/* navigation for navigating between tabs */}
			<nav className="modal-nav" id="modal-nav">
				{hasAccess(tabs[0].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 0 })} onClick={() => openTab(0)}>
						{t(tabs[0].tabNameTranslation)}
					</button>
				)}
				{!tabs[1].hidden && hasAccess(tabs[1].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 1 })} onClick={() => openTab(1)}>
						{t(tabs[1].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[2].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 2 })} onClick={() => openTab(2)}>
						{t(tabs[2].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[3].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 3 })} onClick={() => openTab(3)}>
						{t(tabs[3].tabNameTranslation)}
					</button>
				)}
				{!tabs[4].hidden && hasAccess(tabs[4].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 4 })} onClick={() => openTab(4)}>
						{t(tabs[4].tabNameTranslation)}
					</button>
				)}
				{feeds.length > 0 && (
					<button className={"button-like-anchor " + cn({ active: page === 5 })} onClick={() => openTab(5)}>
						{t(tabs[5].tabNameTranslation)}
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
						updateResource={updateSeriesMetadataWrapper}
						editAccessRole="ROLE_UI_SERIES_DETAILS_METADATA_EDIT"
					/>
				)}
				{page === 1 && (
					<DetailsExtendedMetadataTab
						resourceId={seriesId}
						metadata={extendedMetadata}
						updateResource={updateExtendedSeriesMetadataWrapper}
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
					<SeriesDetailsStatisticTab
						seriesId={seriesId}
						header={tabs[page].tabNameTranslation}
					/>
				)}
				{page === 5 && <SeriesDetailsFeedsTab feeds={feeds} />}
			</div>
		</>
	);
};

export default SeriesDetails;
