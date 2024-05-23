import { useTranslation } from "react-i18next";

const RenderDate: React.FC<{ date: string }> = ({ date }) => {
    const { t } = useTranslation();
    return <>{t("dateFormats.dateTime.short", { dateTime: new Date(date) })}</>;
};

export default RenderDate;
