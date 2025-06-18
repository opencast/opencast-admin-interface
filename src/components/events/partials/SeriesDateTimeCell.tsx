import { useTranslation } from "react-i18next";
import { renderValidDate } from "../../../utils/dateUtils";
import { Series } from "../../../slices/seriesSlice";

/**
 * This component renders the creation date cells of series in the table view
 */
const SeriesDateTimeCell = ({
	row,
}: {
	row: Series
}) => {
	const { t } = useTranslation();

	return (
		// Link template for creation date of series
		<span>
			{t("dateFormats.date.short", {
				date: row.creation_date ? renderValidDate(row.creation_date) : "",
			})}
		</span>
	);
};

export default SeriesDateTimeCell;
