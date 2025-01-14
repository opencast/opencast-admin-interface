import { Tooltip } from "@mui/material";
import { t } from "i18next";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { useAppSelector } from "../../../store";
import { hasAccess } from "../../../utils/utils";

export const SeriesDetailsAction = ({ onClick }: { onClick: () => void }) => {

	const user = useAppSelector(state => getUserInformation(state));

	return hasAccess("ROLE_UI_SERIES_DETAILS_VIEW", user) && (
		<Tooltip title={t("EVENTS.SERIES.TABLE.TOOLTIP.DETAILS")}>
			<button
				onClick={onClick}
				className="button-like-anchor more-series"
			/>
		</Tooltip>
	);
};
