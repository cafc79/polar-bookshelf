import * as React from "react";
import SearchIcon from '@material-ui/icons/Search';
import {useDocFindCallbacks} from "./DocFindStore";
import {MUIDefaultIconButton} from "../../../web/js/mui/icon_buttons/MUIDefaultIconButton";

interface IProps {
    readonly className?: string;
}

export const DocFindButton = React.memo(function DocFindButton(props: IProps) {

    const {setActive} = useDocFindCallbacks();

    return (
        <MUIDefaultIconButton size="small"
                    className={props.className}
                    onClick={() => setActive(true)}>
            <SearchIcon/>
        </MUIDefaultIconButton>
    )

});
