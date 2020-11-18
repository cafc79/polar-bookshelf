import * as React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
const balloon = require('@ckeditor/ckeditor5-build-balloon');

import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";

// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import BalloonEditor from "@ckeditor/ckeditor5-editor-balloon/src/ballooneditor";

import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {CKEditor5GlobalCss} from "./CKEditor5GlobalCss";

interface IProps {
    readonly content: string;
    readonly onChange: (content: string) => void;
}

export const CKEditor5 = deepMemo((props: IProps) => {
    return (
        <>
            <CKEditor5GlobalCss/>
            {/*<CKEditorContext context={ Context }>*/}

                <CKEditor
                    editor={ BalloonEditor }
                    data={props.content}
                    onInit={ (editor: any) => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event: any, editor: any ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                        props.onChange(data);
                    } }
                    onBlur={ ( event: any, editor: any ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event: any, editor: any ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
            {/*</CKEditorContext>*/}
        </>
    );
});
