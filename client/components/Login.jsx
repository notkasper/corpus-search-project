import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ErrorSnackBar from './sub_components/ErrorSnackBar';

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    minWidth: '100%',
    minHeight: '100vh'
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "1em 1em 1em 1em"
  },
  control: {
    paddingTop: "0.5em ",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    minWidth: 150
  }
});

@inject('applicationStore', 'authenticationStore')
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.props.applicationStore.setCurrentPage("Login");
    this.state = {
      username: '',
      password: '',
      emailValid: false,
      passwordValid: false,
      formValid: false,
      untouched: true,
      showPassword: false,
    };
  }

  componentDidMount () {
    this.validateInput();
  }

  submitHandler = (event, username, password) => {
    event.preventDefault();
    this.props.authenticationStore.logIn(username, password);
  }

  validateInput = () => {
    const { username, password } = this.state;
    const usernameInputValid = username.length === 0 ? true : username.length > 2;
    const passwordInputValid = password.length === 0 ? true : password.length > 2;
    this.setState({
      usernameValid: usernameInputValid,
      passwordValid: passwordInputValid,
      formValid: usernameInputValid && passwordInputValid,
      untouched: false
    })
  }

  handleEnter = (event) => {
    if (event.key === 'Enter') {
      this.submitHandler(event, this.state.username, this.state.password);
    }
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  render() {
    const { classes } = this.props;
    const { username, password, usernameValid, passwordValid, formValid, untouched } = this.state;
    return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardHeader title="Basilex/Basiscript" subheader="Please provide your credentials to login" />
          <form className={classes.form} >
            <FormControl className={classes.control}>
              <TextField
                autoFocus
                required
                error={!usernameValid && !untouched}
                label="Username"
                margin="normal"
                value={username}
                onChange={event => this.setState({ username: event.target.value }, () => { this.validateInput() })}
                onKeyPress={this.handleEnter}
                helperText={!usernameValid && !untouched ? 'Username should be at least three characters' : ''}
              />
            </FormControl>
            <FormControl className={classes.control}>
              <TextField
                required
                error={!passwordValid && !untouched}
                label="Password"
                type="password"
                margin="normal"
                type={this.state.showPassword ? 'text' : 'password'}
                value={password}
                onChange={event => this.setState({ password: event.target.value }, () => { this.validateInput() })}
                onKeyPress={this.handleEnter}
                helperText={!passwordValid && !untouched ? 'Password should be at least three characters' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                      >
                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <CardActions className={classes.actions}>
              <Button
                className={classes.button} 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={event => this.submitHandler(event, this.state.username, this.state.password)}
                disabled={!formValid} 
              >
                Login
              </Button>
            </CardActions>

          </form>
        </Card>
        <ErrorSnackBar />
      </div>
    );
  }
}

export default withStyles(styles)(Login);
