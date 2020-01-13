import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import './css/reset.css';
import Home from './Home';
import Frequency from './Frequency';
import Instructions from './Instructions';
import About from './About';
import Menu from './Menu';
import ResultDetails from './sub_components/ResultDetails';
import Login from './Login';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#009688' },
    secondary: { main: '#3f51b5' },
  },
  typography: {
    useNextVariants: true,
  },
});

@inject('applicationStore', 'authenticationStore')
@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialSessionVerified: false
    }
  }
  renderCurrentPage = () => {
    const { applicationStore: { currentPage } } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Menu>
          <div style={{ paddingTop: '50px' }}>
            {
              (() => {
                switch (currentPage) {
                  case 'Home':
                    return <Home/>;
                  case 'Frequency':
                    return <Frequency />;
                  case 'Instructions':
                    return <Instructions />;
                  case 'About':
                    return <About />;
                  case 'Tab':
                    return <ResultDetails />;
                  case 'Instructions':
                    return <Instructions />;
                  case 'Login':
                    return <Home />;
                  default:
                    return (
                      <div>
                        <p>
                          {`This page was not found: ${currentPage} :,(`}
                        </p>
                      </div>
                    );
                }
              })()
            }
          </div>
        </Menu>
      </MuiThemeProvider>
    );
  }
  componentDidMount() {
    this._asyncRequest = this.props.authenticationStore.verifySession(true)
      .then(
        () => {
          this.setState({ initialSessionVerified: true });
        }).catch((error) => {
          this.setState({ initialSessionVerified: true });
        });
  }

  componentDidUpdate() {
    if (this.props.applicationStore.currentPage !== "Login") this.props.authenticationStore.verifySession();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    const { authenticationStore: { isLoggedIn } } = this.props;
    const { initialSessionVerified } = this.state;
    if (initialSessionVerified) {
      return (
        <div>
          {!isLoggedIn ? <Login /> : this.renderCurrentPage()}
        </div>
      );
    }
    else {
      return (null)
    }

  }
}

export default hot(module)(App);