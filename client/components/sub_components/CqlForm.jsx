import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import { Button, TextField, Paper, InputBase, Divider, Tooltip, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Lock, LockOpen, Cached } from '@material-ui/icons';

const styles = theme => ({
  buttonRight: {
    float: 'right',
  },
  textField: {
    float: 'left',
    width: '70%',
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 60,
  },
});

@inject('queryStore', 'applicationStore', 'themeStore')
@observer
class CqlForm extends React.Component {

  handleReset = () => {
    const { queryStore, applicationStore } = this.props;
    queryStore.reset();
  }

  render() {
    const { classes, queryStore, applicationStore, themeStore: { color } } = this.props;

    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <InputBase 
            className={classes.input} 
            placeholder="Corpus Query" 
            disabled={applicationStore.isLoading}
            onChange={event => queryStore.setQuery(event.target.value)}
            value={queryStore.query}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                queryStore.loadResults();
              }
            }}
          />
          <Tooltip title="Search">
            <IconButton
              aria-label="Search"
              className={classes.iconButton} 
              onClick={queryStore.loadResults}
              disabled={applicationStore.isLoading}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset">
            <IconButton
              aria-label="Reset"
              className={classes.iconButton} 
              onClick={this.handleReset}
              disabled={applicationStore.isLoading}
            >
              <Cached />
            </IconButton>
          </Tooltip>
          <Divider className={classes.divider} />
          <Button
            variant="outlined"
            size="small"
            onClick={queryStore.switchCQLMode}
          >
            {queryStore.CQLMode ? 'Simple Query' : 'CQL Query'}
          </Button>
          <Divider className={classes.divider} />
          <Tooltip title="Amount of context">
            <TextField
              value={queryStore.amountOfContext}
              onChange={event => queryStore.setAmountOfContext(event.target.value)}
              type="number"
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              InputProps={{ inputProps: { min: 1 }, disableUnderline: true }}
            />
          </Tooltip>
          <Divider className={classes.divider} />
          <Tooltip title={`Strict mode ${queryStore.strictMode ? 'enabled' : 'disabled'}`}>
            <IconButton 
              disabled
              color={color} 
              className={classes.iconButton}
              onClick={() => {
                queryStore.switchStrictMode();
                this.parseQuery();
              }}
            >
              {queryStore.strictMode ? <Lock /> : <LockOpen />}
            </IconButton>
          </Tooltip>
        </Paper>
      </div >
    )
  }
}

export default withStyles(styles)(CqlForm);