import { makeStyles } from "@material-ui/core";
import { shell } from "electron";

export const getShowFileHandler = (path: string) => () => shell.showItemInFolder(path);

export const usePathStyles = makeStyles({
    path: {
        flexGrow: 1,
        direction: "rtl",
        textOverflow: "ellipsis",
        overflow: "hidden",
        textAlign: "right",
        whiteSpace: "nowrap",
        paddingLeft: "1em",
        fontSize: "0.9em",
    },
    base: {
        flex: "none",
    },
});
