import { AppBar, Box, Fade, makeStyles, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import * as _ from "lodash";
import * as React from "react";
import { isOk } from "../../../common/tools";
import { ISearchResult } from "../../../common/types";
import { useL10n } from "../../utils/l10n-hooks";
import { DuplicatesList } from "./DuplicatesList";
import { SkipsList } from "./SkipsList";

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
        height: "100%",
    },
});

export const FilesArea = ({ searchInfo }: IProps) => {
    const [l10n] = useL10n();
    const [tab, setTab] = React.useState<Tabs>(Tabs.Duplicates);
    const classes = useStyles();

    const handleChange = (___: React.ChangeEvent<{}>, newTab: Tabs) => {
        setTab(newTab);
    };

    const duplicatesCount = isOk(searchInfo)
        ? _.reduce(searchInfo.duplicates, (sum, entry) => sum + entry.detailed.nodes.length, 0)
        : 0;
    const skipsCount = isOk(searchInfo) ? searchInfo.skips.length : 0;

    return (
        <Fade in={isOk(searchInfo)}>
            <Box my={1} overflow="hidden" flexGrow={1} display="flex" flexDirection="column">
                <TabContext value={tab}>
                    <AppBar position="static">
                        <TabList onChange={handleChange}>
                            <Tab label={l10n.conflicts(duplicatesCount)} value={Tabs.Duplicates} />
                            <Tab label={l10n.skippedFiles(skipsCount)} value={Tabs.Skips} />
                        </TabList>
                    </AppBar>
                    <TabPanel value={Tabs.Duplicates} className={classes.tabScrollable}>
                        <DuplicatesList searchInfo={searchInfo} />
                    </TabPanel>
                    <TabPanel value={Tabs.Skips} className={classes.tabScrollable}>
                        <SkipsList searchInfo={searchInfo} />
                    </TabPanel>
                </TabContext>
            </Box>
        </Fade>
    );
};
