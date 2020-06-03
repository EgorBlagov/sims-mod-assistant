import * as React from "react";
import { isOk } from "../../../common/tools";
import { ISearchResult } from "../../../common/types";
import { useL10n } from "../../utils/L10n";
import { DuplicatesList } from "./DuplicatesList";

interface IProps {
    searchInfo: ISearchResult;
}

export const FilesArea = ({ searchInfo }: IProps) => {
    const [l10n, __] = useL10n();

    if (!isOk(searchInfo)) {
        return null;
    }

    return <DuplicatesList searchInfo={searchInfo} />;
};
