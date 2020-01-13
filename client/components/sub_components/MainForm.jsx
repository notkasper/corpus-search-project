import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import { Button, Typography, Snackbar, SnackbarContent, Tooltip } from '@material-ui/core';
import CqlForm from './CqlForm';
import SimpleQueryForm from './SimpleQueryForm';
import QueryFilter from './QueryFilter';
import queryFilterStore from '../../stores/QueryFilterStore';
import Filter_list from '@material-ui/icons/FilterList'
import { Publish } from '@material-ui/icons';

const styles = themes => ({
  input: {
    width: '65%',
  },
  searchButton: {
    width: '1rem',
    float: 'left',
    marginRight: '10px',
    marginBottom: '10px'
  },
  resetButton: {
    width: '1rem',
    float: 'left'
  }
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

@inject('queryStore', 'applicationStore')
@observer
class MainForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      snackbarOpen: false,
    };
  }

  handleReset = () => {
    const { queryStore, applicationStore } = this.props;
    applicationStore.doneLoading();
    queryStore.reset();
  }

  render() {
    const { classes, queryStore, applicationStore } = this.props;

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 2.5fr 0.5fr', paddingBottom: '16px', width: '100%' }}>
          <div style={{ paddingTop: '8px', width: '100%', marginRight: '5px' }}>
            <Tooltip title="Download as CSV">
              <Button
                variant="contained"
                size="small"
                onClick={async () => {
                  this.state.snackbarOpen = true;
                  await queryStore.downloadAsCSV();
                }}
                disabled={!queryStore.queryData.length}
              >
                <Publish
                  style={{ transform: 'rotate(180deg)', marginRight: '5px' }}
                />
                Download
              </Button>
            </Tooltip>
          </div>
          {queryStore.CQLMode ? <CqlForm /> : <SimpleQueryForm />}
          <div style={{ paddingTop: '8px', width: '100%', marginLeft: '5px' }}>
            <Button
              variant="contained"
              size="small"
              onClick={queryFilterStore.swapFilter}
              style={{ float: 'right' }}
            >
              <Filter_list
                style={{ marginRight: '5px' }}
              />
              {queryFilterStore.showFilter ? "Hide Filter" : "Show Filter"}
            </Button>
          </div>
        </div>
        {queryFilterStore.showFilter && <QueryFilter />}
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={3000}
          onClose={() => this.setState({ snackbarOpen: false })}
        >
          <SnackbarContent
            message={
              <span>
                Downloading CSV. This might take a while ...
              </span>
            }
          />
        </Snackbar>
      </div>
    )
  }
}

export default withStyles(styles)(MainForm);