import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  withStyles,
  Typography,
  Toolbar,
  ListItemText,
  ListItem,
  List,
  ListItemIcon,
  IconButton,
  Hidden,
  Drawer,
  Divider,
  CssBaseline,
  AppBar,
  Collapse,
  Chip,
  Button,
} from '@material-ui/core'
import {
  Close,
  Home,
  Menu,
  Help,
  Info,
  GraphicEq,
  ExitToApp,
  Tab,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from '@material-ui/icons'
import _ from 'lodash';
import TabList from './sub_components/TabList';

const drawerWidth = 275;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  chip: {
    fontWeight: 'bold'
  },
  selected: {
    color: 'black',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  notSelected: {
    color: 'gray',
  },
});

@inject('applicationStore', 'authenticationStore', 'frequencyStore', 'tabStore', 'themeStore', 'queryFilterStore', 'queryStore')
@observer
class ResponsiveDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      tabOpen: true,
    };
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes,
      theme,
      applicationStore: { currentPage: title, setCurrentPage, basiscript },
      themeStore: { color },
      tabStore: { tabs, setCurrentTabData, currentTabData }
    } = this.props;

    const buttonText = basiscript ? <div>
      <span className={classes.selected}>BasiScript</span> | <span className={classes.notSelected}>Basilex</span>
    </div>
      :
      <div>
        <span className={classes.notSelected}>BasiScript</span> | <span className={classes.selected}>Basilex</span>
      </div>

    const drawer = (
      <div>
        <div
          className={classes.toolbar}
          style={{ paddingTop: '15px' }}
        >
          <Button
            fullWidth
            onClick={() => {
              queryFilterStore.disableFilter();
              applicationStore.switchDatabase();
              queryStore.reset();
              frequencyStore.reset();
            }}
          >
            {buttonText}
          </Button>
        </div>
        <Divider />
        <List>
          <ListItem button key='Home' selected={applicationStore.currentPage === "Home"} onClick={() => setCurrentPage('Home')}>
            <ListItemIcon><Home color={color} /></ListItemIcon>
            <ListItemText primary='Home' />
          </ListItem>
          <ListItem button key='Frequency' selected={applicationStore.currentPage === "Frequency"} onClick={() => setCurrentPage('Frequency')}>
            <ListItemIcon><GraphicEq color={color} /></ListItemIcon>
            <ListItemText primary='Frequency' />
          </ListItem>
          <ListItem button key='Instructions' selected={applicationStore.currentPage === "Instructions"} onClick={() => setCurrentPage('Instructions')}>
            <ListItemIcon><Help color={color} /></ListItemIcon>
            <ListItemText primary='Instructions' />
          </ListItem>
          <ListItem button key='About' selected={applicationStore.currentPage === "About"} onClick={() => setCurrentPage('About')}>
            <ListItemIcon><Info color={color} /></ListItemIcon>
            <ListItemText primary='About' />
          </ListItem>
          <ListItem button key='Logout' onClick={authenticationStore.logOut}>
            <ListItemIcon><ExitToApp color={color} /></ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
        <Divider />
        <TabList />
      </div>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classes.appBar}
          color={color}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);