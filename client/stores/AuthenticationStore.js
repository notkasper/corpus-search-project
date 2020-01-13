import { observable, action } from 'mobx';
import request from 'superagent';
import errorStore from './ErrorStore';
import Cookies from 'js-cookie';
import tabStore from './TabStore';
import queryStore from './QueryStore';
import frequencyStore from './FrequencyStore'
import frequencyFilterStore from './FrequencyFilterStore';
import queryFilterStore from './QueryFilterStore';
import themeStore from './ThemeStore';

class AuthenticationStore {
  @observable isLoggedIn = false;

  /**
   * Logs the user in by sending a login request with the provided username and password.
   * 
   * @param {String} username The username entered by the client
   * @param {String} password The plaintext password entered by the client
   */
  @action logIn = async (username, password) => {
    let response;
    try {
      response = await request
        .post(`${window.location.href}user/login`)
        .send({ username: username, password: password });
    }
    catch (error) {
      errorStore.setError(`Something went wrong while logging in ${error}`);
      return;
    }
    if (response.status === 200) {
      this.isLoggedIn = true;
    }
  };

  /**
   * Logs the user out by sending a logout request to the server.
   * At logout, all the stores are reset to their initial settings.
   */
  @action logOut = async () => {
    const cookie = Cookies.get('token');
    tabStore.reset();
    queryFilterStore.reset();
    queryStore.reset();
    frequencyStore.reset();
    frequencyFilterStore.reset();
    errorStore.reset();
    themeStore.reset();
    try {
      const response = await request
        .post(`${window.location.href}user/logout`)
        .set("x-access-token", cookie)
        .send();
    }
    catch (error) {
      errorStore.setError(`Something went wrong while logging out ${error}`, error.response.status);
    }
    tabStore.reset();
    queryFilterStore.reset();
    queryStore.reset();
    frequencyStore.reset();
    frequencyFilterStore.reset();
    errorStore.reset();
    themeStore.reset();
    this.isLoggedIn = false;
  }

  /**
   * Verifies the session by sending an authentication request with token to the server.
   * 
   * @param {Boolean} pageRefresh A boolean that indicates if the page is refreshed with default value `false`
   */
  @action verifySession = async (pageRefresh = false) => {
    let response;
    const cookie = Cookies.get('token');
    try {
      response = await request
        .get(`${window.location.href}user/auth`)
        .set("x-access-token", cookie)
        .send();
    }
    catch (error) {
      this.isLoggedIn = false;
      if (!pageRefresh) errorStore.setError(`Invalid token in session ${error}`, error.response.status);
      return;
    }
    if (response.status === 200) {
      this.isLoggedIn = true;
    }
  }
}
const authenticationStore = window.authenticationStore = new AuthenticationStore();

export default authenticationStore;