import { Divider } from "@material-ui/core";
import React from "react";
import { DuplicateGroupEntry, IDuplicateGroupEntryProps } from "./DuplicateGroupEntry";
import { DuplicateGroupToolbar, IDuplicateGroupToolbarProps } from "./DuplicateGroupToolbar";

export enum DuplicateRowType {
    Toolbar,
    Entry,
}

interface IDuplicateGroupToolbarRow extends IDuplicateGroupToolbarProps {
    type: DuplicateRowType.Toolbar;
}

interface IDuplicateGroupEntryRow extends IDuplicateGroupEntryProps {
    type: DuplicateRowType.Entry;
}

type TRowInfo = IDuplicateGroupToolbarRow | IDuplicateGroupEntryRow;
export type TItemData = TRowInfo[];

interface IProps {
    index: number;
    style: object;
    isScrolling?: boolean;
    data: TItemData;
}

export const DuplicateRow = ({ index, style, isScrolling, data }: IProps) => {
    const rowInfo = data[index];

    if (rowInfo.type === DuplicateRowType.Toolbar) {
        return (
            <div style={style}>
                <Divider />
                <DuplicateGroupToolbar {...rowInfo} />
            </div>
        );
    } else {
        return (
            <div style={style}>
                <DuplicateGroupEntry {...rowInfo} />
            </div>
        );
    }
};
