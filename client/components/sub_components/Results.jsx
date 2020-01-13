import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Tab } from '@material-ui/core';

const styles = {
  loadWrap: {
    paddingTop: '15px',
    marginLeft: '45%',
    marginRight: '45%'
  },
  tableRow: {
    ['&:hover']: {
      cursor: 'pointer'
    },
  }
};

@inject('queryStore', 'applicationStore', 'tabStore')
@observer
class Results extends React.Component {

  generateTabLabel = (targets) => {
    let tabName = '';
    targets.map(target => tabName += `${target.text} `);
    return tabName.length > 20 ? `${tabName.substring(0, 20)} ...` : tabName;
  }

  handleNewTab = async (tabData) => {
    const { queryStore, tabStore, applicationStore } = this.props;
    const { id, targets } = tabData;
    const frogId = tabData.targets[0].frog_id
    const frogData = await queryStore.getFrogDataById(frogId);
    const tab = {
      id,
      label: this.generateTabLabel(targets),
      data: tabData,
      frogData
    };
    const tabs = applicationStore.getCorpus() === 'basilex' ? tabStore.basilexTabs : tabStore.basiscriptTabs
    for (const tab of tabs) {
      if (tab.id === id) {
        // There is already a tab for this result, so do not create a new one, but go to the existing one instead
        tabStore.setCurrentTabData({ ...tab, corpus: applicationStore.getCorpus() });
        applicationStore.setCurrentPage('Tab');
        return;
      }
    }
    const corpus = applicationStore.getCorpus();
    if (corpus === 'basilex') {
      tabStore.addBasilexTab(tab);
    } else if (corpus === 'basiscript') {
      tabStore.addBasiscriptTab(tab);
    }
  }

  renderResult = (row) => {
    const { classes, queryStore } = this.props;
    const { preWords, targets, postWords } = row;
    const id = targets[0].id;
    return (
      <TableRow
        className={classes.tableRow}
        key={id}
        hover
        onClick={() => this.handleNewTab({ id, ...row })}
      >
        <TableCell style={{ textAlign: 'right' }} component="th" scope="row">
          {preWords.slice(-queryStore.amountOfContext).map(word => _.get(word, 'text', '') + ' ')}
        </TableCell>
        <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>
          {targets.map(word => _.get(word, 'text', '') + ' ')}
        </TableCell>
        <TableCell>
          {postWords.slice(0, queryStore.amountOfContext).map(word => _.get(word, 'text', '') + ' ')}
        </TableCell>
      </TableRow>
    );
  }

  render() {
    const { classes, queryStore: { queryData } } = this.props;

    return (
      <div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'right' }}>Pre word</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }} padding="none">Target word</TableCell>
                <TableCell>Post word</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queryData.map(this.renderResult)}
            </TableBody>
          </Table>
        </Paper>
        {queryStore.hasMore ?
          <div className={classes.loadWrap}>
            <Button
              classes={{ root: classes.loadButton }}
              onClick={queryStore.loadMoreResults}
              variant="contained"
            >
              Load More
            </Button>
          </div>
          :
          null
        }
      </div>
    )
  }
}

export default withStyles(styles)(Results);