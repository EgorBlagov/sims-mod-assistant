import { Box, Chip, List, ListItem, Typography } from "@material-ui/core";
import * as _ from "lodash";
import * as React from "react";
import { isOk } from "../../common/tools";
import { ISearchResult } from "../../common/types";
import { useL10n } from "../utils/L10n";

interface IProps {
    searchInfo: ISearchResult;
}

export const FilesArea = ({ searchInfo }: IProps) => {
    const [l10n, __] = useL10n();
    if (!isOk(searchInfo)) {
        return null;
    }
    return (
        <List>
            {_.map(searchInfo.entries, (x, i) => (
                <ListItem key={x.original.path}>
                    <Box display="flex" flexDirection="column">
                        <Typography>
                            <b>{x.original.basename}</b>
                            {l10n.date(x.original.date)}
                        </Typography>
                        <List>
                            {_.map(x.duplicates, (duplicate, j) => {
                                return (
                                    <ListItem key={duplicate.path}>
                                        <Box display="flex" justifyContent="space-around">
                                            <Typography>
                                                <b>{duplicate.basename}</b> {l10n.date(duplicate.date)}{" "}
                                            </Typography>

                                            {duplicate.duplicateChecks.Catalogue && (
                                                <Box ml={1}>
                                                    <Chip label={l10n.catalogueDuplicate} color="primary" />
                                                </Box>
                                            )}
                                            {duplicate.duplicateChecks.Exact && (
                                                <Box ml={1}>
                                                    <Chip label={l10n.exactDuplicate} color="secondary" />
                                                </Box>
                                            )}
                                        </Box>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </ListItem>
            ))}
        </List>
    );
};
