import { CircularProgress, Typography } from "@material-ui/core";
import * as React from "react";
import { isOk } from "../../common/tools";
import { useL10n } from "../utils/L10n";
interface IProps {
    filesCount: number;
    sizeMb: number;
}
export const DirectorySummary = ({ filesCount, sizeMb }: IProps) => {
    const [l10n, _] = useL10n();

    if (!isOk(filesCount) || !isOk(sizeMb)) {
        return <CircularProgress />;
    }

    return <Typography>{l10n.dirInfo(filesCount, sizeMb.toFixed(2))}</Typography>;
};
