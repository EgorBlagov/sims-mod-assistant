import * as React from "react";
import { LocalizedProps, withL10n } from "../utils/L10n";

interface IOwnProps {
    info1: string;
    info2: string;
}
type IProps = LocalizedProps<IOwnProps>;

class MainImpl extends React.Component<IProps> {
    render() {
        return (
            <div>
                Test Localization, this should be localized:
                <br />
                {this.props.l10n.fetchedInfo}
                {this.props.info1}
                <br />
                This as well
                <br />
                {this.props.l10n.systemInfo(this.props.info2)}
            </div>
        );
    }
}

export const Main = withL10n(MainImpl);
