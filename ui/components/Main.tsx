import { Box, Container, Divider } from "@material-ui/core";
import * as React from "react";
import { Language } from "../../common/l10n";
import { LocalizedProps, withL10n } from "../utils/L10n";
import { DirectoryPanel } from "./DirectoryPanel";
import { LanguageButton } from "./LanguageButton";
import "./Main.scss";

interface IOwnProps {
    setLanguage: (l: Language) => void;
}
type IProps = LocalizedProps<IOwnProps>;

class MainImpl extends React.Component<IProps> {
    handleChangeLanguage = (newLanguage: Language) => {
        this.props.setLanguage(newLanguage);
    };

    render() {
        return (
            <Container className="main__wrapper">
                <Box display="flex" flexDirection="column" height="100%">
                    <Box display="flex" justifyContent="flex-end" mb={1}>
                        <LanguageButton setLanguage={this.handleChangeLanguage} />
                    </Box>

                    <Divider variant="middle" />
                    <DirectoryPanel />
                </Box>
            </Container>
        );
    }
}

export const Main = withL10n(MainImpl);
