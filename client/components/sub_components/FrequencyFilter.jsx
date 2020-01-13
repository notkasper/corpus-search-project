import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

const styles = ({});

@inject('frequencyFilterStore', 'themeStore')
@observer
class LabeledCheckBox extends React.Component {
  render() {
    const { themeStore: { color } } = this.props;

    return (
      <FormControlLabel
        control={
          <Checkbox
            color={color}
            checked={frequencyFilterStore.grades[this.props.value]}
            onChange={frequencyFilterStore.handleChange(this.props.value)}
            value={this.props.value}
          />
        }
        label={this.props.label}
      />
    );
  }
}

class CheckBoxGroup extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormGroup>
              <FormLabel component="legend">Grade</FormLabel>
              <Grid container>
                <LabeledCheckBox
                  value="group_0"
                  label="0"
                />
                <LabeledCheckBox
                  value="group_1"
                  label="1"
                />
                <LabeledCheckBox
                  value="group_2"
                  label="2"
                />
                <LabeledCheckBox
                  value="group_3"
                  label="3"
                />
                <LabeledCheckBox
                  value="group_4"
                  label="4"
                />
                <LabeledCheckBox
                  value="group_5"
                  label="5"
                />
                <LabeledCheckBox
                  value="group_6"
                  label="6"
                />
                <LabeledCheckBox
                  value="group_7"
                  label="7"
                />
                <LabeledCheckBox
                  value="group_8"
                  label="8"
                />
                <LabeledCheckBox
                  value="VO_1"
                  label="VO_1"
                />
                <LabeledCheckBox
                  value="VO_2"
                  label="VO_2"
                />
              </Grid>
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

class FrequencyFilter extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Card>
          <CardContent>
            <CheckBoxGroup />
          </CardContent>
          <CardActions>
            <Button size="small" onClick={frequencyFilterStore.handleSelectAll}>Select All</Button>
            <Button size="small" onClick={frequencyFilterStore.handleClear}>Clear filters</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(FrequencyFilter);