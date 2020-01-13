import React from 'react';
import { inject, observer } from 'mobx-react';
import { Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Tooltip, IconButton, InputBase, Divider, Select, MenuItem } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Lock, LockOpen } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import FrequencyFilter from './sub_components/FrequencyFilter';
import uuid from 'uuid';
import ErrorSnackBar from './sub_components/ErrorSnackBar';
import Filter_list from '@material-ui/icons/FilterList'
import { Cached, Publish, Help } from '@material-ui/icons';
import TablePagination from '@material-ui/core/TablePagination';
import frequencyStore from '../stores/FrequencyStore';

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
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
};

const gradeHeaders = () => {
  const grades = frequencyFilterStore.grades;
  let headers = [];
  Object.keys(grades).forEach(key => {
    const headerText = formatGradeHeader(key);
    (Object.values(grades).every(value => !value) ? !grades[key] : grades[key])
      && headers.push(<TableCell align="right" padding="dense" key={uuid.v4()}>{headerText}</TableCell>);
  });
  return headers
};

const formatGradeHeader = (label) => {
  let formattedHeader = '';
  switch (label) {
    case 'VO_1':
      formattedHeader = '1VO';
      break;
    case 'VO_2':
      formattedHeader = '2VO';
      break;
    default:
      formattedHeader = label.replace(/_/g, " ").replace(/group/, '');
  }
  return formattedHeader;
};

const gradeFrequencies = (row) => {
  const grades = frequencyFilterStore.grades;
  let gradeCells = []
  Object.keys(grades).forEach(key => {
    const { [key]: frequency } = row;
    (Object.values(grades).every(value => !value) ? !grades[key] : grades[key])
      && gradeCells.push(<TableCell align="right" padding="dense" key={uuid.v4()}>{frequency}</TableCell>);
  });
  return gradeCells;
};

@inject('applicationStore', 'frequencyStore', 'frequencyFilterStore', 'themeStore')
@observer
class Frequency extends React.Component {

  constructor(props) {
    super(props);
    this.props.applicationStore.setCurrentPage('Frequency');
    this.state = {
      showFilter: false,
      showHelpDialog: false,
      page: 0,
      rowsPerPage: 10,
    };
  }

  setFilter = () => this.setState({ showFilter: !this.state.showFilter });

  openDialog = () => { this.setState({ showHelpDialog: true }); };
  closeDialog = () => { this.setState({ showHelpDialog: false }); };

  render() {
    const { classes, themeStore: { color } } = this.props;
    const { page, rowsPerPage } = this.state;

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '0.91fr 2.0fr 0.6fr 0.5fr', paddingBottom: '16px', width: '100%' }}>
          <div style={{ paddingTop: '8px', width: '100%' }}>
            <Button
              style={{ float: 'left' }}
              variant="contained"
              size="small"
              onClick={frequencyStore.handleImport}
            >
              <Publish
                style={{ marginRight: '5px' }}
              />
              Upload
            </Button>
            <Button
              style={{ marginLeft: 10, float: 'left' }}
              variant="contained"
              size="small"
              onClick={frequencyStore.downloadResults}
            >
              <Publish
                style={{ transform: 'rotate(180deg)', marginRight: '5px' }}
              />
              Download
            </Button>
          </div>
          <Paper className={classes.root} elevation={1}>
            <IconButton aria-label="Help" onClick={this.openDialog}>
              <Help/>
            </IconButton>
            <Dialog
              open={this.state.showHelpDialog}
              onClose={this.closeDialog}
            >
              <DialogTitle>Help with importing external files</DialogTitle>
              <DialogContent>
                <Typography style={{ fontWeight: 'bold' }}>
                  In order to search on word frequency based on external files, a textfile (.txt) document must be used.
                </Typography>
              </DialogContent>
              <DialogTitle>Searching syntax</DialogTitle>
              <DialogContent>
                <Typography style={{ marginBottom: '10px' }}>
                  In the text each word, part of speech (pos), lemma or combination should be separated by a comma.
                  Words and lemma's cannot be searched for at the same time.
                </Typography>
                <Typography>
                  <span style={{ fontWeight: 'bold', color: 'green' }}>Correct formats:</span> word, pos, 
                  word|pos <span style={{ fontWeight: 'bold' }}>or</span> lemma, pos, lemma|pos
                </Typography>
                <Typography>
                  <span style={{ fontWeight: 'bold', color: 'red' }}>Incorrect formats:</span> Formats where both a word and lemma are included simultaneously
                </Typography> 
              </DialogContent>
              <DialogActions>
                <Button onClick={this.closeDialog} color="primary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            <Divider className={classes.divider}/>
            <InputBase 
              className={classes.input} 
              placeholder={`Search for ${frequencyStore.searchMode === 'word' ? 'words' : "lemmas"} ...`} 
              onChange={event => frequencyStore.setWords(event.target.value.split(','))}
              value={frequencyStore.words}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.setState({ page: 0 })
                  frequencyStore.findFrequencies();
                }
              }}
            />
            <Tooltip title="Search">
              <IconButton
                aria-label="Search"
                className={classes.iconButton} 
                onClick={() => {
                    this.setState({ page: 0 });
                    frequencyStore.findFrequencies();
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Divider className={classes.divider} />
            <Tooltip title={`Strict mode ${frequencyStore.strictMode ? 'enabled' : 'disabled'}`}>
              <IconButton 
                color={color} 
                className={classes.iconButton}
                onClick={() => {
                  frequencyStore.switchStrictMode();
                  this.parseQuery();
                }}
              >
                {frequencyStore.strictMode ? <Lock /> : <LockOpen />}
              </IconButton>
            </Tooltip>
            <Divider className={classes.divider} />
            <Select
              disableUnderline
              style={{ minWidth: 85 }}
              value={frequencyStore.searchMode}
              onChange={(event) => frequencyStore.setSearchMode(event)}
            >
              <MenuItem value='word'>Word</MenuItem>
              <MenuItem value='lemma'>Lemma</MenuItem>
            </Select>
          </Paper>
          <div style={{ paddingTop: '8px', paddingLeft: '16px', width: '100%' }}>
            <Button
              style={{ marginLeft: 10, float: 'left' }}
              variant="contained"
              size="small"
              onClick={frequencyStore.reset}
            >
              <Cached
                style={{ marginRight: '5px' }}
              />
              Reset
            </Button>
          </div>
          <div style={{ paddingTop: '8px' }}>
            <Button
              style={{ marginLeft: 10, float: 'right' }}
              size="small"
              variant="contained"
              onClick={this.setFilter}
            >
              <Filter_list
                style={{ marginRight: '5px' }}
              />
              {this.state.showFilter ? "Hide Filter" : "Show Filter"}
            </Button>
          </div>
        </div>
        {this.state.showFilter && <div><FrequencyFilter /></div>}
        <div>
        </div>
        <div style={{ paddingTop: '15px' }}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="dense">Word</TableCell>
                  <TableCell padding="dense">Part of Speech</TableCell>
                  <TableCell padding="dense">Lemma</TableCell>
                  <TableCell padding="dense" align="right">Frequency</TableCell>
                  {gradeHeaders()}
                </TableRow>
              </TableHead>
              <TableBody>
                {frequencyStore.frequencyData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => {
                    const key = uuid.v4();
                    const { word, pos, total_frequency: frequency, lemma } = row;
                    return (
                      <TableRow key={key}>
                        <TableCell padding="dense" component="th" scope="row">{word}</TableCell>
                        <TableCell padding="dense">{pos}</TableCell>
                        <TableCell padding="dense">{lemma}</TableCell>
                        <TableCell padding="dense" align="right">{frequency}</TableCell>
                        {gradeFrequencies(row)}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            {frequencyStore.frequencyData.length > rowsPerPage &&
              <div>
                {frequencyStore.hasMore &&
                  <Button
                    style={{ float: 'right', marginTop: 10 }}
                    onClick={frequencyStore.findMoreFrequencies}
                    size="small"
                  >
                    Load More
                  </Button>
                }
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  component="div"
                  count={frequencyStore.frequencyData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={(event, page) => this.setState({ page })}
                  onChangeRowsPerPage={event => this.setState({ rowsPerPage: event.target.value })}
                />
              </div>
            }
          </Paper>
        </div>
        <ErrorSnackBar />
      </div>
    );
  }
}

export default withStyles(styles)(Frequency);