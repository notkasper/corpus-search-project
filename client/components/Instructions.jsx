import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, ListItemIcon, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';

const styles = theme => ({
  titleWrap: { marginBottom: '20px' },
  bold: { fontWeight: 'bold' },
  contentStyle: { padding: '8px' },
  expandOpen: { transform: 'rotate(180deg)' },
  expand: {
    transform: 'rotate(0deg)',
    margin: 'auto',
  },
  codeText: {
    backgroundColor: '#D1CBCB',
    color: 'red',
  },
  paragraph: {
    fontSize: '15px',
    marginLeft: '3%',
  },
  nested: {
    padding: '8px',
    paddingLeft: theme.spacing.unit * 4,
  },
  nestedParagraph: {
    fontSize: '15px',
    marginLeft: '3%',
    paddingLeft: theme.spacing.unit * 4,
  }
});

@inject('applicationStore')
@observer
class Instructions extends React.Component {

  constructor(props) {
    super(props);
    this.props.applicationStore.setCurrentPage('Instructions');
    this.state = {
      expandedBasics: false,
      expandedExampleBasic: false,
      expandedOperators: false,
      expandedNotOperator: false,
      expandedOrAnd: false,
      expandedSequence: false,
      expandedRegex: false,
      expandedEqual: false,
      expandedExampleComplex: false,
      expandedStrict: false, 
      expandedNotStrict: false,
    }
  }

  handleExpandClick = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  render() {
    const { classes } = this.props
    const elevationLevel = 0
    return (
      <div>
        <div className={classes.titleWrap}>
          <Typography variant="h4" align="center">Instruction for building CQLL queries</Typography>
        </div>
        <List>
          <ListItem button onClick={() => this.handleExpandClick('expandedBasics')} className={classes.contentStyle}>
            <ListItemText><Typography variant="h5">The basics</Typography></ListItemText>
            <ListItemIcon>
              <ExpandMoreIcon
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expandedBasics,
                })} />
            </ListItemIcon>
          </ListItem>
          <Collapse in={this.state.expandedBasics} timeout="auto" unmountOnExit>
            <Typography paragraph variant="h6" align="left" classes={{ root: classes.paragraph }}>
              Our query language (Corpus Query Language Less, or, CQLL for short) is a subset of the Corpus Query Language (CQL).<br />
              This document will show how to build syntactically correct queries.<br />
              Basic CQLL queries look like this: <span className={classes.codeText}>[attribute="value"]</span> or <span className={classes.codeText}>[attribute=="value"]</span><br />
              Using a single '=' will treat the value part of the expression as a regular expression. Using double '==' will only return exact matches
              There are currently three attributes, namely: word, lemma and pos.
            </Typography>
          </Collapse>
        </List>

        <List>
          <ListItem button onClick={() => this.handleExpandClick('expandedExampleBasic')} className={classes.contentStyle}>
            <ListItemText><Typography variant="h5">Examples of single option queries</Typography></ListItemText>
            <ListItemIcon>
              <ExpandMoreIcon
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expandedExampleBasic,
                })} />
            </ListItemIcon>
          </ListItem>
          <Collapse in={this.state.expandedExampleBasic} timeout="auto" unmountOnExit>
            <Typography paragraph variant="h6" align="left" classes={{ root: classes.paragraph }}>
              <span className={classes.codeText}>[word=="fiets"]</span> will match all words that are exactly equal to "fiets"<br />
              <span className={classes.codeText}>[word="fiets"]</span> will match all words that contain the word "fiets", for example: "bakfiets"<br />
              <span className={classes.codeText}>[lemma=="lopen"]</span> will match all words that are a form of "lopen", for example: "loop", "liep", "gelopen", "liepen", "lopen"<br />
              <span className={classes.codeText}>[lemma="lopen"]</span> will match all words that are a form of a lemma containing "lopen"<br />
              <span className={classes.codeText}>[pos="WW"]</span> will match all words where the part of speech is equal to "ww" (werkwoord)<br />
              <span className={classes.codeText}>[]</span> will match any word
            </Typography>
          </Collapse>
        </List>

        <List>
          <ListItem button onClick={() => this.handleExpandClick('expandedOperators')} className={classes.contentStyle}>
            <ListItemText><Typography variant="h5">The operators</Typography></ListItemText>
            <ListItemIcon>
              <ExpandMoreIcon
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expandedOperators,
                })} />
            </ListItemIcon>
          </ListItem>
          <Collapse in={this.state.expandedOperators} timeout="auto" unmountOnExit>
            <List>
              <ListItem button onClick={() => this.handleExpandClick('expandedNotOperator')} className={classes.nested}>
                <ListItemText><Typography variant="h6">The NOT operator</Typography></ListItemText>
                <ListItemIcon>
                  <ExpandMoreIcon
                    className={classnames(classes.expand, {
                      [classes.expandOpen]: this.state.expandedNotOperator,
                    })} />
                </ListItemIcon>
              </ListItem>
              <Collapse in={this.state.expandedNotOperator} timeout="auto" unmountOnExit>
                <Typography paragraph variant="h6" align="left" classes={{ root: classes.nestedParagraph }}>
                  <span className={classes.codeText}>[word!="fiets"]</span> will match all words that are NOT equal to "fiets"<br />
                  <span className={classes.codeText}>[lemma!="lopen"]</span> will match all words that are NOT a form of "lopen"<br />
                  <span className={classes.codeText}>[pos!="^N"]</span> will match all words whos' part of speech does not start with an N
                </Typography>
              </Collapse>
            </List>
            <List>
              <ListItem button onClick={() => this.handleExpandClick('expandedOrAnd')} className={classes.nested}>
                <ListItemText><Typography variant="h6">The OR and AND operators</Typography></ListItemText>
                <ListItemIcon>
                  <ExpandMoreIcon
                    className={classnames(classes.expand, {
                      [classes.expandOpen]: this.state.expandedOrAnd,
                    })} />
                </ListItemIcon>
              </ListItem>
              <Collapse in={this.state.expandedOrAnd} timeout="auto" unmountOnExit>
                <Typography paragraph variant="h6" align="left" classes={{ root: classes.nestedParagraph }}>
                  The OR operator is represented like: <span className={classes.codeText}>|</span> ; The AND operator is represented like: <span className={classes.codeText}>&</span><br />
                  <span className={classes.codeText}>([word=="fiets"]|[word="auto"])</span> will match all words that are exactly equal to "fiets" OR match all words containing "auto"<br />
                  <span className={classes.codeText}>([lemma="eten"]&([pos="WW"]|[pos="N"]))</span> will return all forms of the lemma "eten" where the part of speech is either a noun or a werkwoord<br />
                  <span className={classes.codeText}>([lemma="eten"]|[word="voeden"])</span> will return all forms of the lemma "eten" OR all words that contain "voeden"<br />
                  <span className={classes.bold}>note:</span>the AND operator cannot be used like this: <span className={classes.codeText}>[lemma="eten&lopen"]</span>
                </Typography>
              </Collapse>
            </List>
            <List>
              <ListItem button onClick={() => this.handleExpandClick('expandedEqual')} className={classes.nested}>
                <ListItemText><Typography variant="h6">The =, == and != operators</Typography></ListItemText>
                <ListItemIcon>
                  <ExpandMoreIcon
                    className={classnames(classes.expand, {
                      [classes.expandOpen]: this.state.expandedEqual,
                    })} />
                </ListItemIcon>
              </ListItem>
              <Collapse in={this.state.expandedEqual} timeout="auto" unmountOnExit>
                <Typography paragraph variant="h6" align="left" classes={{ root: classes.nestedParagraph }}>
                  Using the <span className={classes.codeText}>!=</span> operator will negate the query.<br />
                  For example: <span className={classes.codeText}>[word!="lopen"]</span> will return all words that do not contain the word "lopen"<br />
                  Using a single '=' will treat the value part of the expression as a regular expression.<br />
                  For example: <span className={classes.codeText}>[word="fiets"]</span> will match all words that contain the word "fiets", for example: "bakfiets"<br />
                  Using double '==' will only return exact matches<br />
                  For example: <span className={classes.codeText}>[word=="fiets"]</span> will match all words that are exactly equal to "fiets"<br />
                </Typography>
              </Collapse>
            </List>
          </Collapse>
        </List>

        <List>
          <ListItem button onClick={() => this.handleExpandClick('expandedSequence')} className={classes.contentStyle}>
            <ListItemText><Typography variant="h5">Sequence of words</Typography></ListItemText>
            <ListItemIcon>
              <ExpandMoreIcon
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expandedSequence,
                })} />
            </ListItemIcon>
          </ListItem>
          <Collapse in={this.state.expandedSequence} timeout="auto" unmountOnExit>
            <Typography paragraph variant="h6" align="left" classes={{ root: classes.paragraph }}>
              <span className={classes.codeText}>([word=="wij"]|[word=="ik"])[lemma="lopen"]</span> will match for example: "ik loop" OR "wij lopen" OR "ik liep"<br />
              <span className={classes.codeText}>([word=="wij"]|[word=="ik"])[lemma="hebben"][lemma="lopen"]</span> will match for example: "wij hebben gelopen" OR "ik heb gelopen"
            </Typography>
          </Collapse>
        </List>

        <List>
          <ListItem button onClick={() => this.handleExpandClick('expandedRegex')} className={classes.contentStyle}>
            <ListItemText><Typography variant="h5">Regular Expressions</Typography></ListItemText>
            <ListItemIcon>
              <ExpandMoreIcon
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expandedRegex,
                })} />
            </ListItemIcon>
          </ListItem>
          <Collapse in={this.state.expandedRegex} timeout="auto" unmountOnExit>
            <Typography paragraph variant="h6" align="left" classes={{ root: classes.paragraph }}>
              In any query of this format <span className={classes.codeText}>[attribute="value"]</span>, the "value" attribute can also be a regular expression.<br />
              For example: <span className={classes.codeText}>[word="^l.*en$"]</span> will return all words that start with an "l", and end with "en", with any number of characters in between.<br />
              For example: "lopen", "laden" and "leven"<br />
              Sometimes you will need to escape characters, for example the query: <span className={classes.codeText}>[word="."]</span> will return all words that contain one or more letters
              (since using single '=' the value is treated as a regular expression, and the '.' in a regular expression means: 'any character')
              There are ways to get around this; either escape the character like this: <span className={classes.codeText}>[word="\."]</span>,<br />
              or use the <span className={classes.codeText}>==</span> operator like this: <span className={classes.codeText}>[word=="."]</span>
            </Typography>
          </Collapse>
        </List>

        <div>
          <div className={classes.titleWrap}>
            <Typography variant="h4" align="center">Instruction for Simple Query</Typography>
          </div>
          <List>
            <ListItem button onClick={() => this.handleExpandClick('expandedStrict')} className={classes.contentStyle}>
              <ListItemText><Typography variant="h5">Strict mode</Typography></ListItemText>
              <ListItemIcon>
                <ExpandMoreIcon
                  className={classnames(classes.expand, {
                    [classes.expandOpen]: this.state.expandedStrict,
                  })} />
              </ListItemIcon>
            </ListItem>
            <Collapse in={this.state.expandedStrict} timeout="auto" unmountOnExit>
              <Typography paragraph variant="h6" align="left" classes={{ root: classes.paragraph }}>
                When strict mode is turned on, the search query is rebuild to a CQLL that uses the format: <span className={classes.codeText}>[attribute=="input"]</span>.<br /> 
                This does remove the ability to search for multiple words using an | in between, as using strict mode would make the search <span className={classes.codeText}>word|en</span> result 
                in the search on <span className={classes.codeText}>[attribute=="word|en"]</span> and not <span className={classes.codeText}>[attribute="word"]|[attribute="en"]</span>.  
            </Typography>
            </Collapse>
          </List>
          <List>
            <ListItem button onClick={() => this.handleExpandClick('expandedNotStrict')} className={classes.contentStyle}>
              <ListItemText><Typography variant="h5">Not Strict mode</Typography></ListItemText>
              <ListItemIcon>
                <ExpandMoreIcon
                  className={classnames(classes.expand, {
                    [classes.expandOpen]: this.state.expandedNotStrict,
                  })} />
              </ListItemIcon>
            </ListItem>
            <Collapse in={this.state.expandedNotStrict} timeout="auto" unmountOnExit>
              <Typography paragraph variant="h6" align="left" classes={{ root: classes.paragraph }}>
                When strict mode is turned off, the search query is rebuild to a CQLL that uses the format: <span className={classes.codeText}>[attribute="input"]</span>.<br />
                In this mode you can search for multiple attributes, Searching <span className={classes.codeText}>word|en</span> results
                in the search on <span className={classes.codeText}>[attribute="word|en"]</span> which is equal to <span className={classes.codeText}>[attribute="word"]|[attribute="en"]</span>.  
            </Typography>
            </Collapse>
          </List>
        </div>
      </div>

    );
  }
}

export default withStyles(styles)(Instructions);