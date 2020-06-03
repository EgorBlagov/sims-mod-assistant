import { Button, Tooltip } from "@material-ui/core";
import * as React from "react";
import { ISearchParams } from "../../common/types";
import { useL10n } from "../utils/L10n";

interface IProps {
    onClick: () => void;
    params: ISearchParams;
}

export const StartButton = ({ onClick, params }: IProps) => {
    const [l10n, _] = useL10n();

    const canStart = params.searchMd5 || params.searchTgi;
    const popper = canStart ? () => null : undefined; // => null is to disable tooltip
    return (
        <Tooltip title={l10n.enableForSearch} PopperComponent={popper}>
            <span>
                <Button color="primary" variant="contained" onClick={onClick} disabled={!canStart}>
                    {l10n.start}
                </Button>
            </span>
        </Tooltip>
    );
};
