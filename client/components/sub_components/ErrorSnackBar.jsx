import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

const CustomSnackbarContent = (props) => {
  const { classes } = props;
  const errorMessage = errorStore.error.message;

  return (
    <SnackbarContent
      className={classes.error}
      message={
        <span id="message-id" className={classes.message}>
          <ErrorIcon className={classes.icon} />
          {errorMessage}
        </span>
      }
    />
  );
};

@inject('errorStore')
@observer
class ErrorSnackBar extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <Snackbar
        className={classes.margin}
        open={errorStore.error.status}
        autoHideDuration={3000}
        onClose={errorStore.dismissError}
      >
        <CustomSnackbarContent classes={classes} />
      </Snackbar>
    );
  }

}

export default withStyles(styles)(ErrorSnackBar);