import * as React from "react";
import SearchIcon from '@material-ui/icons/Search';
import {useDocFindCallbacks} from "./DocFindStore";
import {MUIIconButton} from "../../../web/js/mui/icon_buttons/MUIIconButton";

interface IProps {
    readonly className?: string;
}

export const DocFindButton = React.memo(function DocFindButton(props: IProps) {

    const {setActive} = useDocFindCallbacks();

    return (
        <MUIIconButton size="small"
                    className={props.className}
                    onClick={() => setActive(true)}>
            <SearchIcon/>
        </MUIIconButton>
    )

});
