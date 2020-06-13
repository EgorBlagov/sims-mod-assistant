import { Box, CircularProgress, Typography } from "@material-ui/core";
import * as React from "react";
import { isOk } from "../../common/tools";
import { useL10n } from "../utils/l10n-hooks";
import { SearchPanel } from "./SearchPanel";

interface IProps {
    targetPath: string;
    filesCount: number;
    sizeMb: number;
}

export const DirectorySummary = ({ targetPath, filesCount, sizeMb }: IProps) => {
    const [l10n] = useL10n();

    if (!isOk(filesCount) || !isOk(sizeMb)) {
        return (
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Typography align="center">{l10n.dirInfo(filesCount, sizeMb.toFixed(2))}</Typography>
            <SearchPanel targetPath={targetPath} />
        </>
    );
};
