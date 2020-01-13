import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import { Button, IconButton, Paper, Table, TableBody, TableRow, TableCell, Card, CardContent, Tooltip } from '@material-ui/core';

const styles = theme => ({
  tabWrap: {
    marginLeft: '40%',
    marginRight: '40%',
    marginTop: '10px',
    marginBot: '10px'
  },
  tabButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: theme.primary_dark,
      color: 'white'
    },
  },
  inlineTypography: {
    display: 'inline-block',
    '&:hover': {
      backgroundColor: 'darkgray',
      color: 'white'
    },
  }
});

@inject('tabStore', 'applicationStore', 'queryStore')
@observer
class ResultDetails extends React.Component {

  constructor(props) {
    super(props);
    this.props.applicationStore.setCurrentPage('Tab')
  }

  getTabData = () => this.props.tabStore.getCurrentTabData();

  handleXMLDownload = () => {
    const { queryStore } = this.props;
    const tabData = this.getTabData();
    const frogId = tabData.data.targets[0].frog_id;
    queryStore.downloadXMLByFrogId(frogId, tabData.corpus);
  }

  getContent = () => {
    const { data: { preWords, targets, postWords } } = this.getTabData();
    const { classes } = this.props;
    const content = [...preWords, ...targets, ...postWords].map((element) => (
      <Tooltip
        interactive
        leaveDelay={200}
        title={`
        text: ${element.text}
        lemma: ${element.lemma}
        length: ${element.length}
        pos: ${element.pos}
        morpology: ${element.morphology}
      `}>
        <Typography className={classes.inlineTypography}>
          {element.text}
        </Typography>
      </Tooltip>
    ));
    return content;
  }

  render() {
    const { classes, tabStore: { currentTabData } } = this.props;
    const {
      rowId,
      label,
      data: {
        preWords,
        targets,
        postWords
      },
      frogData
    } = currentTabData;

    return (
      <div key={rowId}>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableBody>
              {
                (
                  () => {
                    const rows = [];
                    Object.keys(frogData.meta_data).forEach(key => {
                      const value = frogData.meta_data[key];
                      rows.push(
                        <TableRow key={`${key}:${value}`}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      );
                    });
                    return rows
                  }
                )()
              }
            </TableBody>
          </Table>
        </Paper>

        <Card className={classes.root}>
          <CardContent>
            {this.getContent().map((element, index) => <React.Fragment key={index}> {element}</React.Fragment>)}
          </CardContent>
        </Card>
        <div className={classes.tabWrap}>
          <Button classes={{ root: classes.tabButton }}
            variant="contained"
            fullWidth
            onClick={this.handleXMLDownload}
          >
            Download XML
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ResultDetails);