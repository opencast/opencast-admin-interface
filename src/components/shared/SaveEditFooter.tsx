import { useTranslation } from "react-i18next"

type SaveEditFooterProps = {
    active: boolean;
    reset: () => void;
    submit: () => void;
    isValid?: boolean;
}

export const SaveEditFooter: React.FC<SaveEditFooterProps> = ({
    active,
    reset,
    submit,
    isValid,
}) => {
    const { t } = useTranslation();

    return <footer style={{ padding: "0 15px" }}>
        {active && isValid && (
            <div className="pull-left">
                <button
                    type="reset"
                    onClick={reset}
                    className="cancel"
                >{t("CANCEL")}</button>
            </div>
        )}
        <div className="pull-right">
            <button
                onClick={submit}
                disabled={!isValid || !active}
                className={`save green ${
                    !isValid || !active ? "disabled" : ""
                }`}
            >{t("SAVE")}</button>
        </div>
    </footer>;
}