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

@inject('queryStore', 'applicationStore', 'queryFilterStore', 'themeStore')
@observer
class SimpleQueryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: '',
      lemma: '',
      pos: ''
    };
  }

  parseQuery = () => {
    let { word, lemma, pos } = this.state;

    word = word.replace(/\s/g, '');
    lemma = lemma.replace(/\s/g, '');
    pos = pos.replace(/\s/g, '');

    const wordComparator = word && queryStore.strictMode ? '==' : '=';
    const lemmaComparator = lemma && queryStore.strictMode ? '==' : '=';
    const parsedQuery = `([word${wordComparator}"${word.replace(/\,/g, '|')}"]&[lemma${lemmaComparator}"${lemma.replace(/\,/g, '|')}"]&[pos="${pos.replace(/\,/g, '|')}"])`;
    this.props.queryStore.setQuery(parsedQuery);
  }

  handleReset = () => {
    const { queryFilterStore } = this.props;
    this.setState({
      error: false,
      word: '',
      lemma: '',
      pos: ''
    });
    queryStore.setAmountOfContext(3);
    queryStore.clearResults();
    queryFilterStore.handleClear();
  }

  handleSubmit = () => {
    const { queryStore } = this.props;
    this.parseQuery();
    queryStore.loadResults();
  }

  handleEnter = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    const { classes, applicationStore, themeStore: { color } } = this.props;

    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <InputBase 
            error={this.state.error}
            placeholder="Word"
            className={classes.input}
            disabled={applicationStore.isLoading}
            onChange={event => {
              this.setState({ word: event.target.value }, () => this.parseQuery());
            }}
            value={this.state.word}
            onKeyPress={this.handleEnter}
          />
          <Divider className={classes.divider} />
          <InputBase 
            error={this.state.error}
            placeholder="Lemma"
            className={classes.input}
            disabled={applicationStore.isLoading}
            onChange={event => {
              this.setState({ lemma: event.target.value }, () => this.parseQuery());
            }}
            value={this.state.lemma}
            onKeyPress={this.handleEnter}
          />
          <Divider className={classes.divider} />
          <InputBase 
            error={this.state.error}
            placeholder="Part of Speech"
            className={classes.input}
            disabled={applicationStore.isLoading}
            onChange={event => {
              this.setState({ pos: event.target.value }, () => this.parseQuery());
            }}
            value={this.state.pos}
            onKeyPress={this.handleEnter}
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

export default withStyles(styles)(SimpleQueryForm);