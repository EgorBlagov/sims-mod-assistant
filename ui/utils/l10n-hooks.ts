import { useSelector } from "react-redux";
import { l10n, Language, Translation } from "../../common/l10n";
import { TState } from "../redux/reducers";

export function useL10n(): [Translation, Language] {
    const language = useSelector((state: TState) => state.language.language);
    return [l10n[language], language];
}
