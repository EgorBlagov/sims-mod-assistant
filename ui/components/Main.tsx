import classnames from "classnames";
import * as _ from "lodash";
import * as React from "react";
import { Language } from "../../common/l10n";
import { LocalizedProps, withL10n } from "../utils/L10n";

interface IOwnProps {
    setLanguage: (l: Language) => void;
}
type IProps = LocalizedProps<IOwnProps>;

class MainImpl extends React.Component<IProps> {
    handleChangeLanguage = (newLanguage: Language) => () => {
        this.props.setLanguage(newLanguage);
    };
    render() {
        return (
            <div className="uk-container">
                <div uk-grid="true">
                    <div className="uk-width-expand" />
                    <div className="uk-width-auto">
                        <button className="uk-button uk-button-small" type="button">
                            {this.props.l10n.language}
                        </button>
                        <div uk-dropdown="mode: click" className="uk-padding-small">
                            <ul className="uk-nav uk-dropdown-nav">
                                {_.map(Object.values(Language), (x) => (
                                    <li key={x} className={classnames({ "uk-active": x === this.props.lang })}>
                                        <a href="#" onClick={this.handleChangeLanguage(x)}>
                                            {x}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const Main = withL10n(MainImpl);
