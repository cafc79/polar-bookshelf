import * as React from "react";
import {useDocViewerToolbarStyles} from "./DocViewerToolbar";
import clsx from "clsx";

interface IProps {
    readonly nrPages: number;
}

export const NumPages = (props: IProps) => {
    const classes = useDocViewerToolbarStyles();

    return (
        <div className={clsx("ml-1", "mt-auto", "mb-auto", classes.toolbarFontColor)}
             style={{fontSize: "1.3rem", userSelect: 'none'}}>
            of {props.nrPages}
        </div>
    );
};
