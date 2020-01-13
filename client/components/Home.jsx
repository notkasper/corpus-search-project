
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, Typography } from '@material-ui/core';
import MainForm from './sub_components/MainForm';
import Results from './sub_components/Results';
import ErrorSnackBar from './sub_components/ErrorSnackBar';

const styles = themes => ({});

@inject('applicationStore')
@observer
class Home extends React.Component {

  constructor(props) {
    super(props);
    this.props.applicationStore.setCurrentPage('Home');
  }

  render() {
    return (
      <div>
        <MainForm />
        <Results />
        <ErrorSnackBar />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Home);