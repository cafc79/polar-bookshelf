import React from "react";
import {ButtonProps} from "./StandardToggleButton";
import {MUITooltip} from "../../../../../web/js/mui/MUITooltip";
import {MUIIconButton} from "../../../../../web/js/mui/icon_buttons/MUIIconButton";

export interface StandardButtonProps extends ButtonProps {
    readonly tooltip: string;
    readonly children: JSX.Element;
    readonly disabled?: boolean;
}

export const StandardIconButton = React.memo(function StandardIconButton(props: StandardButtonProps) {
    return (
        <MUITooltip title={props.tooltip}>
            <MUIIconButton size={props.size || 'small'}
                        disableRipple={true}
                        onClick={props.onClick}
                        disabled={props.disabled}
                        aria-label={props.tooltip.toLowerCase()}>
                {props.children}
            </MUIIconButton>
        </MUITooltip>
    );
});
