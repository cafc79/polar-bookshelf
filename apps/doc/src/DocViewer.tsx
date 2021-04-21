import {DocActions, DocViewerToolbar} from "./toolbar/DocViewerToolbar";
import * as React from "react";
import clsx from "clsx";
import {DocViewerAppURLs} from "./DocViewerAppURLs";
import {LoadingProgress} from "../../../web/js/ui/LoadingProgress";
import {TextHighlightsView} from "./annotations/TextHighlightsView";
import {AnnotationSidebar2} from "../../../web/js/annotation_sidebar/AnnotationSidebar2";
import {PagemarkProgressBar} from "./PagemarkProgressBar";
import {AreaHighlightsView} from "./annotations/AreaHighlightsView";
import {PagemarksView} from "./annotations/PagemarksView";
import {useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import isEqual from "react-fast-compare";
import {DocFindBar} from "./DocFindBar";
import {DocViewerGlobalHotKeys} from "./DocViewerGlobalHotKeys";
import {
    computeDocViewerContextMenuOrigin,
    DocViewerMenu,
    IDocViewerContextMenuOrigin
} from "./DocViewerMenu";
import {createContextMenu} from "../../repository/js/doc_repo/MUIContextMenu";
import {Helmet} from "react-helmet";
import {DeviceRouter} from "../../../web/js/ui/DeviceRouter";
import {DocFindButton} from "./DocFindButton";
import MenuIcon from '@material-ui/icons/Menu';
import {DocRenderer, DocViewerContext} from "./renderers/DocRenderer";
import {ViewerContainerProvider} from "./ViewerContainerStore";
import {FileTypes} from "../../../web/js/apps/main/file_loaders/FileTypes";
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {useStateRef, useRefValue} from "../../../web/js/hooks/ReactHooks";
import {NoDocument} from "./NoDocument";
import {DockLayout2} from "../../../web/js/ui/doc_layout/DockLayout2";
import {Outliner} from "./outline/Outliner";
import {useDocViewerSnapshot} from "./UseDocViewerSnapshot";
import {useZenModeResizer} from "./ZenModeResizer";
import {useDocumentViewerVisible} from "./renderers/UseSidenavDocumentChangeCallbackHook";
import {Box, createStyles, Divider, makeStyles, SwipeableDrawer} from "@material-ui/core";
import {MUIDefaultIconButton} from "../../../web/js/mui/icon_buttons/MUIDefaultIconButton";
import {DocViewerToolbarOverflowButton} from "./DocViewerToolbarOverflowButton";
import {ZenModeButton} from "./toolbar/ZenModeButton";
import {FullScreenButton} from "./toolbar/FullScreenButton";
import {DockLayoutToggleButton} from "../../../web/js/ui/doc_layout/DockLayoutToggleButton";
import {MUIPaperToolbar} from "../../../web/js/mui/MUIPaperToolbar";
import {DockPanel} from "../../../web/js/ui/doc_layout/DockLayout";

const Main = React.memo(function Main() {

    return (

        <div className="DocViewer.Main"
             style={{
                 flexGrow: 1,
                 minHeight: 0,
                 display: 'flex',
                 flexDirection: 'column'
             }}>

            <PagemarkProgressBar/>
            <DocViewerGlobalHotKeys/>
            <DocFindBar/>

            <div className="DocViewer.Main.Body"
                 style={{
                     minHeight: 0,
                     overflow: 'auto',
                     flexGrow: 1,
                     position: 'relative'
                 }}>

                <DocViewerContextMenu>
                    <DocMain/>
                </DocViewerContextMenu>
            </div>

        </div>
    )
})

const DocMain = React.memo(function DocMain() {

    const {docURL, docMeta} = useDocViewerStore(['docURL', 'docMeta']);
    const isVisible = useDocumentViewerVisible(docMeta?.docInfo.fingerprint || '');

    if (! docURL) {
        return null;
    }

    return (
        <>
            {isVisible && 
                <Helmet>
                    <title>Polar: { docMeta?.docInfo.title }</title>
                </Helmet>
            }
            <DocRenderer>
                <>
                    <TextHighlightsView />

                    <AreaHighlightsView/>

                    <PagemarksView/>
                </>
            </DocRenderer>

        </>
    )
}, isEqual);

const DocViewerContextMenu = createContextMenu<IDocViewerContextMenuOrigin>(DocViewerMenu, {computeOrigin: computeDocViewerContextMenuOrigin});


interface ILayoutRendererProps {
    annotationSidebarOpen: boolean;
    outlinerOpen: boolean;
}

export const LayoutRenderer: React.FC<ILayoutRendererProps> = React.memo((props) => {
    const {resizer, docMeta} = useDocViewerStore(['resizer', 'docMeta']);

    const resizerRef = useRefValue(resizer);

    const onDockLayoutResize = React.useCallback(() => {

        if (resizerRef.current) {
            resizerRef.current();
        } else {
            console.warn("No resizer");
        }

    }, [resizerRef]);

    const layout: Partial<DockPanel> = {
        width: 410,
        style: {
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            flexGrow: 1,
        },
    };

    return (
        <DockLayout2.Root
            onResize={onDockLayoutResize}
            dockPanels={[
                {
                    ...layout,
                    component: <Outliner/>,
                    collapsed: !props.outlinerOpen,
                    id: "doc-panel-outline",
                    type: "fixed",
                    side: "left",
                },
                {
                    id: "dock-panel-viewer",
                    type: "grow",
                    style: { display: "flex" },
                    component: <Main/>
                },
                {
                    ...layout,
                    component: docMeta ? <AnnotationSidebar2 /> : null,
                    collapsed: !props.annotationSidebarOpen,
                    id: "doc-panel-sidebar",
                    type: "fixed",
                    side: "right",
                }
            ]}>
            <>
                {props.children}
            </>
        </DockLayout2.Root>
    );
}, isEqual);

const useDeviceContainerStyles = makeStyles(() =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
        },
        drawerPaper: {
            maxWidth: "100%",
        }
    }),
);


namespace Device {
    export const Phone = React.memo(function Phone() {
        const [outlinerOpen, setOutlinerOpen] = React.useState(false);
        const [annotationSidebarOpen, setAnnotationSidebarOpen] = React.useState(false);
        const classes = useDeviceContainerStyles();

        return (
            <>
                <SwipeableDrawer
                    anchor="right"
                    open={annotationSidebarOpen}
                    onClose={() => setAnnotationSidebarOpen(false)}
                    onOpen={() => setAnnotationSidebarOpen(true)}
                    classes={{ paper: classes.drawerPaper }}>

                    <AnnotationSidebar2 />

                </SwipeableDrawer>

                <SwipeableDrawer
                    anchor="left"
                    open={outlinerOpen}
                    onClose={() => setOutlinerOpen(false)}
                    onOpen={() => setOutlinerOpen(true)}
                    classes={{ paper: classes.drawerPaper }}>

                    <Outliner />

                </SwipeableDrawer>

                <div className={clsx("DocViewer.Phone", classes.root)}>

                    <MUIPaperToolbar borderBottom>
                        <Box justifyContent="space-between"
                             alignItems="center"
                             display="flex"
                             className="p-1">
                            <div>
                                <MUIDefaultIconButton onClick={() => setOutlinerOpen(!outlinerOpen)}>
                                    <MenuIcon/>
                                </MUIDefaultIconButton>
                                <DocFindButton className="ml-1"/>
                            </div>
                            <div>
                                <MUIDefaultIconButton onClick={() => setAnnotationSidebarOpen(!annotationSidebarOpen)}>
                                    <MenuIcon/>
                                </MUIDefaultIconButton>
                            </div>
                        </Box>
                    </MUIPaperToolbar>

                    <div className={clsx("DocViewer.Phone.Body", classes.root)}>

                        <Main/>
                    </div>
                </div>
            </>
        )
    });

    export const Tablet = React.memo(function Tablet() {
        const {docMeta} = useDocViewerStore(["docMeta"]);
        const classes = useDeviceContainerStyles();

        return (
            <div className={clsx("DocViewer.Tablet", classes.root)}>
                <MUIPaperToolbar borderBottom>
                    <Box justifyContent="space-between"
                         alignItems="center"
                         display="flex"
                         className="p-1">
                        <div>
                            <DockLayoutToggleButton side="left" size="small"/>
                            <DocFindButton className="mr-1"/>
                        </div>

                        <Box display="flex" alignItems="center" className="gap-box">
                            <DocActions />
                            <Divider orientation="vertical" flexItem={true} />
                            <ZenModeButton/>
                            <FullScreenButton/>
                            <DocViewerToolbarOverflowButton docInfo={docMeta?.docInfo}/>
                            <DockLayoutToggleButton side="right" size="small"/>
                        </Box>
                    </Box>
                </MUIPaperToolbar>

                <div className={clsx("DocViewer.Tablet.Body", classes.root)}>
                    <DockLayout2.Main/>
                </div>

            </div>
        );
    }, isEqual);

    export const Desktop: React.FC = React.memo(function Desktop() {
        const classes = useDeviceContainerStyles();

        return (
            <div className={clsx("DocViewer.Desktop", classes.root)}>

                <DocViewerToolbar />

                <div className={clsx("DocViewer.Desktop.Body", classes.root)}>

                    <DockLayout2.Main/>
                </div>

            </div>
        );
    });

}

const DocViewerMain = deepMemo(function DocViewerMain() {

    useZenModeResizer();

    const tabletLayout: ILayoutRendererProps = {
        annotationSidebarOpen: false,
        outlinerOpen: false,
    };

    const desktopLayout: ILayoutRendererProps = {
        annotationSidebarOpen: false,
        outlinerOpen: false,
    };

    return (
        <DeviceRouter desktop={<LayoutRenderer {...desktopLayout}><Device.Desktop /></LayoutRenderer>}
                      tablet={<LayoutRenderer {...tabletLayout}><Device.Tablet /></LayoutRenderer>}
                      phone={<Device.Phone />}/>
    );

});

interface DocViewerParentProps {
    readonly docID: string;
    readonly children: React.ReactNode;
}

const DocViewerParent = deepMemo((props: DocViewerParentProps) => (
    <div data-doc-viewer-id={props.docID}
         style={{
             display: 'flex',
             minHeight: 0,
             overflow: 'auto',
             flexGrow: 1,
         }}>
        {props.children}
    </div>
));

export const DocViewer = deepMemo(function DocViewer() {

    const {docURL} = useDocViewerStore(['docURL']);
    const {setDocMeta} = useDocViewerCallbacks();
    const parsedURL = React.useMemo(() => DocViewerAppURLs.parse(document.location.href), []);
    const [exists, setExists, existsRef] = useStateRef<boolean | undefined>(undefined);

    const snapshot = useDocViewerSnapshot(parsedURL?.id);

    React.useEffect(() => {

        if (snapshot) {

            if (existsRef.current !== snapshot.exists) {
                setExists(snapshot.exists)
            }

            if (snapshot.docMeta) {

                function computeType() {
                    return snapshot?.hasPendingWrites ? 'snapshot-local' : 'snapshot-server';
                }

                const type = computeType();

                setDocMeta(snapshot.docMeta, snapshot.hasPendingWrites, type);

            }

        }


    }, [existsRef, setDocMeta, setExists, snapshot]);

    if (exists === false) {
        return <NoDocument/>;
    }

    if (parsedURL === undefined) {
        return <NoDocument/>;
    }

    const docID = parsedURL.id;

    if (docURL === undefined) {
        return (
            <>
                <LoadingProgress/>
            </>
        )
    }

    const fileType = FileTypes.create(docURL);

    return (
        <DocViewerParent docID={docID}>
            <DocViewerContext.Provider value={{fileType, docID}}>
                <ViewerContainerProvider>
                    <DocViewerMain/>
                </ViewerContainerProvider>
            </DocViewerContext.Provider>
        </DocViewerParent>
    );

});

