import * as React from "react";
import { l10n, Language, Translation } from "../../common/l10n";

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
