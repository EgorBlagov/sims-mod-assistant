export enum CheckboxState {
    Checked,
    Indeterminate,
    Unchecked,
}

export const getCheckboxState = (totalCount: number, selectedCount: number): CheckboxState => {
    if (totalCount === 0 || selectedCount === 0) {
        return CheckboxState.Unchecked;
    }

    return selectedCount === totalCount ? CheckboxState.Checked : CheckboxState.Indeterminate;
};
