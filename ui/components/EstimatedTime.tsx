import { Typography } from "@material-ui/core";
import * as moment from "moment";
import * as React from "react";
import { isOk } from "../../common/tools";
import { useL10n } from "../utils/l10n-hooks";

interface IProps {
    startTime: Date;
    progressRelative: number;
}

export const EstimatedTime = ({ startTime, progressRelative }: IProps) => {
    const [l10n] = useL10n();

    if (!isOk(startTime)) {
        return null;
    }

    const now = new Date();
    const timeSpent = now.getTime() - startTime.getTime();
    let timeCaption = l10n.calculatingTime;

    if (progressRelative > 0) {
        const timeTotal = timeSpent / progressRelative;
        timeCaption = moment
            .duration(timeTotal - timeSpent)
            .locale(l10n.momentLibLocale)
            .humanize();
    }

    return <Typography color="textSecondary">{timeCaption}</Typography>;
};
