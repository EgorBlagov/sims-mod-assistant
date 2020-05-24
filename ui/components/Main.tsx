import classnames from "classnames";
import * as _ from "lodash";
import * as React from "react";
import { Language } from "../../common/l10n";
import { LocalizedProps, withL10n } from "../utils/L10n";
import "./Main.scss";
interface IOwnProps {
    setLanguage: (l: Language) => void;
}
type IProps = LocalizedProps<IOwnProps>;

class MainImpl extends React.Component<IProps> {
    handleChangeLanguage = (newLanguage: Language) => () => {
        this.props.setLanguage(newLanguage);
    };
    render() {
        const { l10n, lang } = this.props;
        return (
            <div className="uk-container uk-flex uk-flex-column main-wrapper uk-panel">
                <div uk-grid="true">
                    <div className="uk-width-expand" />
                    <div className="uk-width-auto">
                        <button className="uk-button uk-button-small" type="button">
                            {l10n.language}
                        </button>
                        <div uk-dropdown="mode: click" className="uk-padding-small">
                            <ul className="uk-nav uk-dropdown-nav">
                                {_.map(Object.values(Language), (x) => (
                                    <li key={x} className={classnames({ "uk-active": x === lang })}>
                                        <a href="#" onClick={this.handleChangeLanguage(x)}>
                                            {x}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <hr />

                <div uk-grid="true">
                    <div className="uk-width-expand">{l10n.chooseDir}</div>
                    <div className="uk-width-auto">
                        <button className="uk-button uk-button-small">Open</button>
                    </div>
                </div>

                <div uk-grid="true">
                    <div className="uk-width-expand uk-text-center">{l10n.dirInfo(1000, 1000)}</div>
                </div>

                <form>
                    <div className="uk-flex uk-flex-column uk-margin-top">
                        <label>
                            <input className="uk-checkbox uk-margin-small-right" type="checkbox" />
                            {l10n.searchExactDoubles}
                        </label>
                        <label>
                            <input className="uk-checkbox uk-margin-small-right" type="checkbox" />
                            {l10n.searchCatalogueConflicts}
                        </label>
                    </div>
                </form>
                <progress className="uk-progress" value="10" max="100" />
                <div className="uk-flex-1 uk-panel-scrollable">
                    <ul className="uk-list uk-list-divider uk-list-striped uk-list-large">
                        {_.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0], (x, i) => (
                            <li key={i}>
                                File {x} {i}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export const Main = withL10n(MainImpl);
