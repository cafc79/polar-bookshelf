import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {NoteIDStr, useNotesCallbacks, useNotesStore} from "./NotesStore";
import {useRefValue} from "../hooks/ReactHooks";
import {ckeditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5";

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
    readonly editor: ckeditor5.IEditor | undefined;
    readonly children: JSX.Element;
}

export const NoteNavigation = React.memo((props: IProps) => {

    const {editor} = props;

    const {active} = useNotesStore(['active']);
    const activeRef = useRefValue(active);
    const {createNewNote, setActive, navPrev, navNext} = useNotesCallbacks();

    const handleClickAway = React.useCallback(() => {

    }, []);

    React.useEffect(() => {

        if (activeRef.current === props.id) {
            if (editor !== undefined) {
                console.log("Focusing editor");
                editor.editing.view.focus();
            }
        }

    }, [active, activeRef, editor, props.id]);

    const handleClick = React.useCallback(() => {
        setActive(props.id);
    }, [props.id, setActive]);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        switch (event.key) {

            case 'ArrowUp':
                event.stopPropagation();
                event.preventDefault();

                navPrev(props.parent, props.id);

                break;

            case 'ArrowDown':
                event.stopPropagation();
                event.preventDefault();

                navNext(props.parent, props.id);

                break;

            case 'Enter':
                createNewNote(props.parent, props.id);
                event.stopPropagation();
                event.preventDefault();
                break;
            default:
                break;

        }

    }, [createNewNote, navNext, navPrev, props.id, props.parent]);

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div onClick={handleClick} onKeyDown={handleKeyDown}>
                {props.children}
            </div>
        </ClickAwayListener>
    );

});