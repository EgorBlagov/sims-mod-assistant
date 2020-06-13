import * as React from "react";
import { useSelector } from "react-redux";
import { l10n, Language, Translation } from "../../common/l10n";
import { TState } from "../redux/reducers";

export const LanguageContext = React.createContext(Language.English);

export type LocalizedProps<T> = T & { l10n: Translation; lang: Language };

export function withL10n<T extends object>(
    WrappedComponent: React.ComponentType<LocalizedProps<T>>,
): React.ComponentClass<T> {
    return class extends React.Component<T> {
        static contextType = LanguageContext;
        declare context: React.ContextType<typeof LanguageContext>;
        render() {
            return <WrappedComponent l10n={l10n[this.context]} lang={this.context} {...this.props} />;
        }
    };
}

export function useL10n(): [Translation, Language] {
    const language = useSelector((state: TState) => state.language.language);
    return [l10n[language], language];
}
