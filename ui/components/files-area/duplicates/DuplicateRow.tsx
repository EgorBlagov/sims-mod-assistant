import { Divider } from "@material-ui/core";
import React, { ReactNode } from "react";
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

    let content: ReactNode;
    if (rowInfo.type === DuplicateRowType.Toolbar) {
        content = (
            <>
                <Divider />
                <DuplicateGroupToolbar {...rowInfo} />
            </>
        );
    } else {
        content = <DuplicateGroupEntry {...rowInfo} />;
    }

    return <div style={style}>{content}</div>;
};
