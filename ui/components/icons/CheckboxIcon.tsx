import { Checkbox, makeStyles } from "@material-ui/core";
import React from "react";

interface IProps {
    value: boolean;
    onChange: (newValue: boolean) => void;
    IconComponent: React.ComponentType<any>;
}

const useStyles = makeStyles((theme) => ({
    checkboxIcon: {
        fontSize: "0.75em",
    },
    checkbox: {
        marginLeft: theme.spacing(0.5),
        padding: theme.spacing(0.5),
    },
    checkboxChecked: {
        backgroundColor: theme.palette.primary.main,
    },
    checkboxColorPrimary: {
        "&$checkboxChecked": {
            color: "white",
        },
        "&$checkboxChecked:hover": {
            backgroundColor: theme.palette.primary.light,
        },
    },
}));

export const CheckboxIcon = ({ onChange, value, IconComponent }: IProps) => {
    const classes = useStyles();

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    return (
        <Checkbox
            color="primary"
            icon={<IconComponent className={classes.checkboxIcon} />}
            checkedIcon={<IconComponent className={classes.checkboxIcon} />}
            checked={value}
            onChange={onChangeHandler}
            classes={{
                root: classes.checkbox,
                checked: classes.checkboxChecked,
                colorPrimary: classes.checkboxColorPrimary,
            }}
        />
    );
};
