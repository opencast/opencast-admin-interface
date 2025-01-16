import { Tooltip } from "@mui/material";
import { t } from "i18next";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { useAppSelector } from "../../../store";
import { hasAccess } from "../../../utils/utils";
import { useSearchParams } from "react-router";

export const SeriesDetailsAction = ({ id }: {
	id: string,
}) => {

	const user = useAppSelector(state => getUserInformation(state));
	const [, setSearchParams] = useSearchParams();

	const onClick = () => {
		setSearchParams(params => {
			params.set('seriesId', id);
			return params;
		});
	};

	return hasAccess("ROLE_UI_SERIES_DETAILS_VIEW", user) && (
		<Tooltip title={t("EVENTS.SERIES.TABLE.TOOLTIP.DETAILS")}>
			<button
				onClick={onClick}
				className="button-like-anchor more-series"
			/>
		</Tooltip>
	);
};
