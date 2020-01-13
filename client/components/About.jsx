import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grid: {
    container: 'true',
    direction: 'row',
    [theme.breakpoints.down('sm')]: {
      minWidth: 200,
    },
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 100,
    width: 100,
  },
});

@inject('applicationStore')
@observer
class About extends React.Component {
  constructor(props) {
    super(props);
    this.props.applicationStore.setCurrentPage('About');
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container direction= "row">
          <Grid className={classes.grid} xs>
            <Grid item >
              <FormGroup>
                <Typography
                  variant="title"
                  style={{ padding: '0.5em' }}
                >
                  Basilex
                    </Typography>
                <Typography
                  variant="body1"
                  style={{ padding: '0.5em' }}
                >
                  Basilex is a collection of written language that the children in the Netherlands get/have to read during their period at primary school.
                  So it's a corpus of text for children.
                  The corpus has about 11.5 million words in it. The importance of Basilex lies in getting to know what words the children know at a certain age.
                  With this information researchers can for example make reliable tests in which the difficulty of words doesn't affect the result.
                  Developers of teaching material also benefit from this research, because they can make material that more closely corresponds to the difficulty the children can understand.
                      Basilex consist of 42% teaching material, 38% (strip)books and magazines, 20% media by which we mean websites the children often visit.</Typography>
              </FormGroup>
            </Grid>
            <Grid item>
              <FormGroup>
                <Typography
                  variant="title"
                  style={{ padding: '0.5em' }}
                >
                  BasiScript
                    </Typography>
                <Typography
                  variant="body1"
                  style={{ padding: '0.5em' }}
                >
                  Basiscript is a collection of written language that the children in the Netherlands wrote themselves in their period at primary school.
                  So it's a corpus of text by children.
                  The corpus has about 12 million words in it. The importance of Basiscript lies in getting to know what words the children use at a certain age.
                  With this information researchers can for example research the progress in spelling, the level of difficulties in the words and syntax.
                  Basiscript consists of a variety of writing exercises the children had to make during their period in primary school.
                    </Typography>
              </FormGroup>
            </Grid>
          </Grid>
          <Grid className={classes.grid} xs>
            <Grid item >
              <FormGroup>
                <Typography
                  variant="title"
                  style={{ padding: '0.5em' }}
                >
                  About us
                    </Typography>
                <Typography
                  variant="subheading"
                  style={{ padding: '0.5em' }}
                >
                  Developers:
                    </Typography>
                <Typography variant="body1">Chihab Amghane</Typography>
                <Typography variant="body1">Leon Driessen</Typography>
                <Typography variant="body1">Dennis den Hollander</Typography>
                <Typography variant="body1">Marc J.F. Jacobs</Typography>
                <Typography variant="body1">Kasper Karelse</Typography>
                <Typography variant="body1">Richard C.Q. Li</Typography>
              </FormGroup>
            </Grid>
            <Grid item >
              <FormGroup>
                <Typography
                  variant="subheading"
                  style={{ padding: '0.5em' }}
                >
                  With help of:
                    </Typography>
                <Typography variant="body1" >Iris Monster</Typography>
                <Typography variant="body1" >Dr Agnes Tellings</Typography>
                <Typography variant="body1" >Radboud Universiteit</Typography>
                <Typography variant="body1" >Behavioural Science Institute</Typography>
              </FormGroup>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}


export default withStyles(styles)(About);
