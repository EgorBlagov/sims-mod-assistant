import { Box } from "@material-ui/core";
import * as React from "react";
import { FilesArea } from "./FilesArea";
import { ProgressBar } from "./ProgressBar";
import { SearchParametersForm } from "./SearchParametersForm";

export const SearchPanel = () => (
    <>
        <SearchParametersForm />
        <Box mb={1}>
            <ProgressBar progress={10} />
        </Box>
        <FilesArea />
    </>
);
