import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {useSideNavStore, TabDescriptor} from './SideNavStore';
import Divider from '@material-ui/core/Divider';
import {PolarSVGIcon} from "../ui/svg_icons/PolarSVGIcon";
import {SideNavButtonWithIcon} from "./SideNavButtonWithIcon";
import {FAHomeIcon, FAStickyNote} from "../mui/MUIFontAwesome";
import {Link, useHistory} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import TimelineIcon from '@material-ui/icons/Timeline';
import {IconWithColor} from "../ui/IconWithColor";
import {SettingsButton} from "./SettingsButton";

const WIDTH = 56;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: WIDTH,
            minWidth: WIDTH,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.default,
            alignItems: 'center'
        },
        logo: {
            display: 'flex',
            cursor: 'pointer',
            "& *": {
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        divider: {
            marginBottom: '5px',
            margin: theme.spacing(1),
            height: '1px'
        },
        buttons: {
            flexGrow: 1,
            minHeight: 0,
            overflow: 'hidden'
        },
        historyButton: {
            color: theme.palette.text.secondary,

            '&:hover': {
                color: theme.palette.text.primary
            },

        }
    }),
);

interface HistoryButtonProps {
    readonly path: string;
    readonly children: JSX.Element;
}

const HistoryButton = React.memo((props: HistoryButtonProps) => {

    const history = useHistory();
    const classes = useStyles();

    return (
        <IconButton className={classes.historyButton}
                    onClick={() => history.push(props.path)}>
            {props.children}
        </IconButton>
    )
});


const HomeButton = React.memo(() => {

    return (
        <HistoryButton path="/">
            <FAHomeIcon/>
        </HistoryButton>
    )
});

const AnnotationsButton = React.memo(() => {

    return (
        <HistoryButton path="/annotations">
            <FAStickyNote/>
        </HistoryButton>
    )
});



const StatsButton = React.memo(() => {

    return (
        <HistoryButton path="/stats">
            <TimelineIcon/>
        </HistoryButton>
    )
});


const PolarButton = React.memo(() => {

    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.logo} onClick={() => history.push('')}>
            <PolarSVGIcon width={WIDTH - 10}
                          height={WIDTH - 10}/>
        </div>
    );

})

export const SideNav = React.memo(() => {

    const classes = useStyles();

    const {tabs} = useSideNavStore(['tabs']);

    const toNavButton = React.useCallback((tab: TabDescriptor) => {
        return (
            <SideNavButtonWithIcon key={tab.id} tab={tab}/>
        )
    }, []);

    return (
        <div className={classes.root}>

            <PolarButton/>

            <Divider orientation="horizontal" flexItem={true} className={classes.divider}/>

            <HomeButton/>
            <AnnotationsButton/>
            <StatsButton/>

            {tabs.length > 0 && (
                <Divider orientation="horizontal" flexItem={true} className={classes.divider}/>
            )}

            <div className={classes.buttons}>
                {tabs.map(toNavButton)}
            </div>

            <div style={{marginBottom: '5px'}}>
                <SettingsButton/>
            </div>

        </div>
    );

});
