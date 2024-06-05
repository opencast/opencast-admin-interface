import { useTranslation } from "react-i18next";
import { renderValidDate } from "../../utils/dateUtils";

const RenderDate: React.FC<{ date: string }> = ({ date }) => {
    const { t } = useTranslation();
    return <>{t("dateFormats.dateTime.short", { dateTime: renderValidDate(date) })}</>;
};

export default RenderDate;
