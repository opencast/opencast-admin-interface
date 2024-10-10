import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Tooltip } from "../../shared/Tooltip";
import { LifeCyclePolicy } from "../../../slices/lifeCycleSlice";
import DetailsModal from "../../shared/modals/DetailsModal";
import LifeCyclePolicyDetails from "./modals/LifeCyclePolicyDetails";
import { hasAccess } from "../../../utils/utils";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { fetchLifeCyclePolicyDetails } from "../../../slices/lifeCycleDetailsSlice";

/**
 * This component renders the title cells of series in the table view
 */
const LifeCyclePolicyActionCell = ({
	row,
}: {
	row: LifeCyclePolicy
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayLifeCyclePolicyDetails, setLifeCyclePolicyDetails] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const showLifeCyclePolicyDetails = async () => {
		await dispatch(fetchLifeCyclePolicyDetails(row.id));

		setLifeCyclePolicyDetails(true);
	};

	const hideLifeCyclePolicyDetails = () => {
		setLifeCyclePolicyDetails(false);
	};

	return (
		<>
			{/* view details location/recording */}
			{hasAccess("ROLE_UI_LIFECYCLEPOLICY_DETAILS_VIEW", user) && (
				<Tooltip title={t("LIFECYCLE.POLICIES.TABLE.TOOLTIP.DETAILS")}>
					<button
						className="button-like-anchor more"
						onClick={() => showLifeCyclePolicyDetails()}
					/>
				</Tooltip>
			)}

			{displayLifeCyclePolicyDetails && (
				<DetailsModal
					handleClose={hideLifeCyclePolicyDetails}
					title={row.title}
					prefix={"LIFECYCLE.POLICIES.DETAILS.HEADER"}
				>
					<LifeCyclePolicyDetails />
				</DetailsModal>
			)}
		</>
	);
};

export default LifeCyclePolicyActionCell;
