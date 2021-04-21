import * as React from "react";
import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import {MUIIconButton} from "../../../../web/js/mui/icon_buttons/MUIIconButton";

export const PagePrevButton = React.memo(function PagePrevButton() {

    const {onPagePrev} = useDocViewerCallbacks();
    const {pageNavigator, page} = useDocViewerStore(['pageNavigator', 'page']);

    return (
        <MUIIconButton size="small"
                    disabled={!pageNavigator || page <= 1}
                    onClick={onPagePrev}>
            <ArrowUpwardIcon/>
        </MUIIconButton>
    );

});
