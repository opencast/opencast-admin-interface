import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import {
	checkForEventsDeleteSeriesModal,
	deleteSeries,
} from "../../../thunks/seriesThunks";
import { connect } from "react-redux";
import SeriesDetailsModal from "./modals/SeriesDetailsModal";
import {
	fetchNamesOfPossibleThemes,
	fetchSeriesDetailsAcls,
	fetchSeriesDetailsFeeds,
	fetchSeriesDetailsMetadata,
	fetchSeriesDetailsTheme,
} from "../../../thunks/seriesDetailsThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import {
	getSeriesHasEvents,
	isSeriesDeleteAllowed,
} from "../../../selectors/seriesSeletctor";
import { useAppSelector } from "../../../store";

/**
 * This component renders the action cells of series in the table view
 */
const SeriesActionsCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'deleteSeries' implicitly has an '... Remove this comment to see the full error message
	deleteSeries,
// @ts-expect-error TS(7031): Binding element 'fetchSeriesDetailsMetadata' impli... Remove this comment to see the full error message
	fetchSeriesDetailsMetadata,
// @ts-expect-error TS(7031): Binding element 'fetchSeriesDetailsAcls' implicitl... Remove this comment to see the full error message
	fetchSeriesDetailsAcls,
// @ts-expect-error TS(7031): Binding element 'checkDeleteAllowed' implicitly ha... Remove this comment to see the full error message
	checkDeleteAllowed,
// @ts-expect-error TS(7031): Binding element 'fetchSeriesDetailsFeeds' implicit... Remove this comment to see the full error message
	fetchSeriesDetailsFeeds,
// @ts-expect-error TS(7031): Binding element 'fetchSeriesDetailsTheme' implicit... Remove this comment to see the full error message
	fetchSeriesDetailsTheme,
// @ts-expect-error TS(7031): Binding element 'fetchSeriesDetailsThemeNames' imp... Remove this comment to see the full error message
	fetchSeriesDetailsThemeNames,
// @ts-expect-error TS(7031): Binding element 'deleteAllowed' implicitly has an ... Remove this comment to see the full error message
	deleteAllowed,
// @ts-expect-error TS(7031): Binding element 'hasEvents' implicitly has an 'any... Remove this comment to see the full error message
	hasEvents,
}) => {
	const { t } = useTranslation();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displaySeriesDetailsModal, setSeriesDetailsModal] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

	const showDeleteConfirmation = async () => {
		await checkDeleteAllowed(row.id);

		setDeleteConfirmation(true);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingSeries = (id) => {
		deleteSeries(id);
	};

	const hideSeriesDetailsModal = () => {
		setSeriesDetailsModal(false);
	};

	const showSeriesDetailsModal = async () => {
		await fetchSeriesDetailsMetadata(row.id);
		await fetchSeriesDetailsAcls(row.id);
		await fetchSeriesDetailsFeeds(row.id);
		await fetchSeriesDetailsTheme(row.id);
		await fetchSeriesDetailsThemeNames();

		setSeriesDetailsModal(true);
	};

	return (
		<>
			{/* series details */}
			{hasAccess("ROLE_UI_SERIES_DETAILS_VIEW", user) && (
				<button
					onClick={() => showSeriesDetailsModal()}
					className="button-like-anchor more-series"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("EVENTS.SERIES.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{displaySeriesDetailsModal && (
				<SeriesDetailsModal
					handleClose={hideSeriesDetailsModal}
					seriesId={row.id}
					seriesTitle={row.title}
				/>
			)}

			{/* delete series */}
			{hasAccess("ROLE_UI_SERIES_DELETE", user) && (
				<button
					onClick={() => showDeleteConfirmation()}
					className="button-like-anchor remove"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("EVENTS.SERIES.TABLE.TOOLTIP.DELETE")}
				/>
			)}

			{displayDeleteConfirmation && (
				<ConfirmModal
					close={hideDeleteConfirmation}
					resourceName={row.title}
					resourceType="SERIES"
					resourceId={row.id}
					deleteMethod={deletingSeries}
					deleteAllowed={deleteAllowed}
					showCautionMessage={hasEvents}
					deleteNotAllowedMessage={
						"CONFIRMATIONS.ERRORS.SERIES_HAS_EVENTS"
					} /* The highlighted series cannot be deleted as they still contain events */
					deleteWithCautionMessage={
						"CONFIRMATIONS.WARNINGS.SERIES_HAS_EVENTS"
					} /* This series does contain events. Deleting the series will not delete the events. */
				/>
			)}
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	deleteAllowed: isSeriesDeleteAllowed(state),
	hasEvents: getSeriesHasEvents(state),
});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	deleteSeries: (id) => dispatch(deleteSeries(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	fetchSeriesDetailsMetadata: (id) => dispatch(fetchSeriesDetailsMetadata(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	fetchSeriesDetailsAcls: (id) => dispatch(fetchSeriesDetailsAcls(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	fetchSeriesDetailsFeeds: (id) => dispatch(fetchSeriesDetailsFeeds(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	fetchSeriesDetailsTheme: (id) => dispatch(fetchSeriesDetailsTheme(id)),
	fetchSeriesDetailsThemeNames: () => dispatch(fetchNamesOfPossibleThemes()),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	checkDeleteAllowed: (id) => dispatch(checkForEventsDeleteSeriesModal(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SeriesActionsCell);
