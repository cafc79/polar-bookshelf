import * as React from 'react';
import {SideType} from "./DockLayoutManager";
import MenuIcon from '@material-ui/icons/Menu';
import {useDockLayoutCallbacks} from "./DockLayoutStore";
import {MUITooltip} from "../../mui/MUITooltip";
import {MUIDefaultIconButton} from '../../../../web/js/mui/icon_buttons/MUIDefaultIconButton';

interface IProps {
    readonly size?: 'small';
    readonly side: SideType;
}

export const DockLayoutToggleButton = React.memo(function DockLayoutToggleButton(props: IProps) {

    const {toggleSide} = useDockLayoutCallbacks();

    const handleToggle = React.useCallback(() => {
        toggleSide(props.side);
    }, [props.side, toggleSide])

    return (
        <MUITooltip title={`Toggle ${props.side} sidebar`}>
            <MUIDefaultIconButton size={props.size} onClick={handleToggle}>
                <MenuIcon/>
            </MUIDefaultIconButton>
        </MUITooltip>
    );

})
