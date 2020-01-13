import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import { ListItemText, ListItem, List, ListItemIcon, IconButton, Collapse, Chip } from '@material-ui/core'
import { Close, Tab, KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons'
import _ from 'lodash';

const styles = theme => ({
  nested: { paddingLeft: theme.spacing.unit * 4 },
  chip: { fontWeight: 'bold' }
});

@inject('applicationStore', 'tabStore', 'themeStore')
@observer
class TabList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basilexOpen: true,
      basiscriptOpen: true
    };
  }

  handleOpenBasilex = () => {
    this.setState(state => ({ basilexOpen: !state.basilexOpen }));
  }

  handleOpenBasiscript = () => {
    this.setState(state => ({ basiscriptOpen: !state.basiscriptOpen }));
  }

  handleTabIconBasilex = () => {
    const { themeStore } = this.props;
    const tabIcon = this.state.basilexOpen
      ? <KeyboardArrowDown color={themeStore.color} />
      : <KeyboardArrowUp color={themeStore.color} />;
    return tabIcon;
  }

  handleTabIconBasiscript = () => {
    const { themeStore } = this.props;
    const tabIcon = this.state.basiscriptOpen
      ? <KeyboardArrowDown color={themeStore.color} />
      : <KeyboardArrowUp color={themeStore.color} />;
    return tabIcon;
  }

  generateTabComponent = (tabData, props) => {
    const { classes,
      applicationStore,
      tabStore,
      themeStore,
    } = props;

    return (
      <ListItem
        className={classes.nested}
        key={tabData.id}
        button
        selected={tabData.id === _.get(tabStore.currentTabData, 'id', 'non_existing_id') && applicationStore.currentPage === 'Tab'}
        onClick={() => {
          tabStore.setCurrentTabData({ ...tabData, corpus: applicationStore.getCorpus() });
          applicationStore.setCurrentPage('Tab');
        }}
      >
        <ListItemIcon><Tab /></ListItemIcon>
        <ListItemText primary={tabData.label} />
        <IconButton 
          style={{ padding: 0 }} 
          color={themeStore.color}            
          onClick={(e) => {
              e.stopPropagation();
              const nextTabindex = tabStore.removeTabById(tabData.id);
              if (nextTabindex >= 0) {
                tabStore.setCurrentTabData({ ...tabStore.tabs[nextTabindex], corpus: applicationStore.getCorpus() });
              } else {
                applicationStore.setCurrentPage('Home');
              }
            }} 
          >
          <Close />
        </IconButton>
      </ListItem>
    );
  }

  render() {
    const { classes, tabStore: { basilexTabs, basiscriptTabs } } = this.props;

    return (
      <div>
        <List>
          <ListItem button key='Basilex' onClick={this.handleOpenBasilex} disabled={!basilexTabs.length}>
            <ListItemIcon>{basilexTabs.length ? this.handleTabIconBasilex() : <Tab color="primary" />}</ListItemIcon>
            <ListItemText primary='Basilex Tabs' />
            <IconButton style={{ padding: 0 }} color="primary">
              {basilexTabs.length
                ? <Chip clickable={false} label={basilexTabs.length} className={classes.chip} />
                : null
              }
            </IconButton>
          </ListItem>
          {basilexTabs.length > 0 && 
          <Collapse in={this.state.basilexOpen} timeout="auto" unmountOnExit>
            <List>{
              basilexTabs.map((tabData) => (
                this.generateTabComponent(tabData, this.props)
              ))
            }</List>
          </Collapse>}
          <ListItem button key='Basiscript' onClick={this.handleOpenBasiscript} disabled={!basiscriptTabs.length}>
            <ListItemIcon>{basiscriptTabs.length ? this.handleTabIconBasiscript() : <Tab color="secondary" />}</ListItemIcon>
            <ListItemText primary='Basiscript Tabs' />
            <IconButton style={{ padding: 0 }} color="secondary">
              {basiscriptTabs.length
                ? <Chip clickable={false} label={basiscriptTabs.length} className={classes.chip} />
                : null
              }
            </IconButton>
          </ListItem>
          {basiscriptTabs.length > 0 && 
          <Collapse in={this.state.basiscriptOpen} timeout="auto" unmountOnExit>
            <List>{
              basiscriptTabs.map((tabData) => (
                this.generateTabComponent(tabData, this.props)
              ))
            }</List>
          </Collapse>}
        </List>
      </div>
    );
  }
}
export default withStyles(styles)(TabList);