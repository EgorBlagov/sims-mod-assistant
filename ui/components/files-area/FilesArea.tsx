import { AppBar, Box, Fade, makeStyles, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import * as React from "react";
import { isOk } from "../../../common/tools";
import { ISearchResult } from "../../../common/types";
import { useL10n } from "../../utils/L10n";
import { DuplicatesList } from "./DuplicatesList";

interface IProps {
    searchInfo: ISearchResult;
}

enum Tabs {
    Duplicates = "Duplicates",
    Skips = "Skips",
}

const useStyles = makeStyles({
    tabScrollable: {
        overflow: "auto",
    },
});
export const FilesArea = ({ searchInfo }: IProps) => {
    const [l10n, __] = useL10n();
    const [tab, setTab] = React.useState<Tabs>(Tabs.Duplicates);
    const classes = useStyles();

    const handleChange = (___: React.ChangeEvent<{}>, newTab: Tabs) => {
        setTab(newTab);
    };

    return (
        <Fade in={isOk(searchInfo)}>
            <Box my={1} overflow="hidden" flexGrow={1} display="flex" flexDirection="column">
                <TabContext value={tab}>
                    <AppBar position="static">
                        <TabList onChange={handleChange} aria-label="simple tabs example">
                            <Tab label={l10n.duplicates} value={Tabs.Duplicates} />
                            <Tab label={l10n.skippedFiles} value={Tabs.Skips} />
                        </TabList>
                    </AppBar>
                    <TabPanel value={Tabs.Duplicates} className={classes.tabScrollable}>
                        <DuplicatesList searchInfo={searchInfo} />
                    </TabPanel>
                </TabContext>
            </Box>
        </Fade>
    );
};
