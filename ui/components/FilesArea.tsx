import { Box, List, ListItemText } from "@material-ui/core";
import * as _ from "lodash";
import * as React from "react";
export const FilesArea = () => (
    <Box overflow="auto">
        <List>
            {_.map([1, 2, 3, 4, 5, 6, 9, 0, 1, 2, 3, 4, 5, 6, 9, 0, 0, 0], (x, i) => (
                <ListItemText key={i} primary={`File ${x} ${i}`} />
            ))}
        </List>
    </Box>
);
