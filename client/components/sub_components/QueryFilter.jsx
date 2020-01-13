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
import queryFilterStore from '../../stores/QueryFilterStore';
import applicationStore from '../../stores/ApplicationStore';

const styles = ({});

@inject('queryFilterStore', 'themeStore', 'applicationStore')
@observer
class LabeledCheckBox extends React.Component {
  render() {
    const { themeStore: { color } } = this.props;

    return (
      queryFilterStore.grades.hasOwnProperty(this.props.value) ?
        <FormControlLabel
          control={
            <Checkbox
              color={color}
              checked={queryFilterStore.grades[this.props.value]}
              onChange={queryFilterStore.handleChange(this.props.value)}
              value={this.props.value}
            />
          }
          label={this.props.label}
        />
        :
        <FormControlLabel
          control={
            <Checkbox
              color={color}
              checked={queryFilterStore.documents[this.props.value]}
              onChange={queryFilterStore.handleChange(this.props.value)}
              value={this.props.value}
            />
          }
          label={this.props.label}
        />
    );
  }
}

class BasiscriptCheckBoxGroup extends React.Component {
  render() {
    return (
      <Grid container>
        <FormControl component="fieldset">
          <FormGroup>
            <FormLabel component="legend">Grade</FormLabel>
            <Grid container>
              <Grid item>
                <FormGroup>
                  <LabeledCheckBox
                    value="0"
                    label="pre-school"
                  />
                  <LabeledCheckBox
                    value="1"
                    label="kl1"
                  />
                  <LabeledCheckBox
                    value="2"
                    label="kl2"
                  />
                </FormGroup>
              </Grid>
              <Grid item>
                <FormGroup>
                  <LabeledCheckBox
                    value="3"
                    label="3"
                  />
                  <LabeledCheckBox
                    value="4"
                    label="4"
                  />
                  <LabeledCheckBox
                    value="5"
                    label="5"
                  />
                </FormGroup>
              </Grid>
              <Grid item>
                <FormGroup>
                  <LabeledCheckBox
                    value="6"
                    label="6"
                  />
                  <LabeledCheckBox
                    value="7"
                    label="7"
                  />
                  <LabeledCheckBox
                    value="8"
                    label="8"
                  />
                </FormGroup>
              </Grid>
              <Grid item>
                <FormGroup>
                  <LabeledCheckBox
                    value="1VO"
                    label="1VO"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>
      </Grid>
    );
  }
}

class BasilexCheckBoxGroup extends React.Component {
  render() {
    return (
      <Grid container>
        <Grid item xs={6}>
          <FormControl component="fieldset">
            <FormGroup>
              <FormLabel component="legend">Grade</FormLabel>
              <Grid container>
                <Grid item>
                  <FormGroup>
                    <LabeledCheckBox
                      value="0"
                      label="pre-school"
                    />
                    <LabeledCheckBox
                      value="1"
                      label="kl1"
                    />
                    <LabeledCheckBox
                      value="2"
                      label="kl2"
                    />
                  </FormGroup>
                </Grid>
                <Grid item>
                  <FormGroup>
                    <LabeledCheckBox
                      value="3"
                      label="3"
                    />
                    <LabeledCheckBox
                      value="4"
                      label="4"
                    />
                    <LabeledCheckBox
                      value="5"
                      label="5"
                    />
                  </FormGroup>
                </Grid>
                <Grid item>
                  <FormGroup>
                    <LabeledCheckBox
                      value="6"
                      label="6"
                    />
                    <LabeledCheckBox
                      value="7"
                      label="7"
                    />
                    <LabeledCheckBox
                      value="8"
                      label="8"
                    />
                  </FormGroup>
                </Grid>
                <Grid item>
                  <FormGroup>
                    <LabeledCheckBox
                      value="1VO"
                      label="1VO"
                    />
                    <LabeledCheckBox
                      value="2VO"
                      label="2VO"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </FormGroup>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl component="fieldset">
            <FormGroup>
              <FormLabel component="legend">Document type</FormLabel>
              <Grid container>
                <Grid item>
                  <FormGroup>
                    <LabeledCheckBox
                      value="taalmethode"
                      label="taalmethode"
                    />
                    <LabeledCheckBox
                      value="leesboek"
                      label="leesboek"
                    />
                    <LabeledCheckBox
                      value="ondertitels"
                      label="ondertitels"
                    />
                  </FormGroup>
                </Grid>
                <Grid item>
                  <FormGroup>
                    <LabeledCheckBox
                      value="newsfeed"
                      label="newsfeed"
                    />
                    <LabeledCheckBox
                      value="rekenmethode"
                      label="rekenmethode"
                    />
                    <LabeledCheckBox
                      value="zaakvakmethode"
                      label="zaakvakmethode"
                    />
                  </FormGroup>
                </Grid>
                <Grid item>
                  <FormGroup>
                    <LabeledCheckBox
                      value="toets"
                      label="toets"
                    />
                    <LabeledCheckBox
                      value="strip"
                      label="strip"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

class QueryFilter extends React.Component {
  render() {
    const checkBoxGroup = applicationStore.basiscript ? <BasiscriptCheckBoxGroup /> : <BasilexCheckBoxGroup />

    return (
      <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <Card>
          <CardContent>
            {checkBoxGroup}
          </CardContent>
          <CardActions>
            <Button size="small" onClick={queryFilterStore.handleSelectAll}>Select All</Button>
            <Button size="small" onClick={queryFilterStore.handleClear}>Clear filters</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(QueryFilter);