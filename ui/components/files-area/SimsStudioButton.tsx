import { IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { ipc } from "../../../common/ipc";
import { isOk } from "../../../common/tools";
import { TState } from "../../redux/reducers";
import { useL10n } from "../../utils/l10n-hooks";
import { SimsIcon } from "../icons/SimsIcon";

interface IProps {
    path: string;
    className: string;
}

export const SimsStudioButton = ({ path, className }: IProps) => {
    const [l10n] = useL10n();
    const simsStudioPath = useSelector((state: TState) => state.settings.studioPath);

    const studioConfigured = isOk(simsStudioPath);
    const StudioTooltip = ({ children, ...rest }) => (
        <Tooltip title={studioConfigured ? l10n.openInStudio : l10n.studioNotConfigured} placement="top" {...rest}>
            <span>{children}</span>
        </Tooltip>
    );

    const onClick = () => ipc.renderer.rpc.openInStudio({ filePath: path, simsStudioPath });

    return (
        <StudioTooltip>
            <IconButton
                disabled={!studioConfigured}
                onClick={onClick}
                className={className}
                size="small"
                color="primary"
            >
                <SimsIcon />
            </IconButton>
        </StudioTooltip>
    );
};
