import { observable, action } from 'mobx';
import authenticationStore from './AuthenticationStore';

class ErrorStore {

  @observable error = {
    status: false,
    message: 'Unknown error'
  };

  @action reset = () => {
    this.error = {
      status: false,
      message: 'Unknown error'
    }; 
  }

  /**
   * Sets the status of error to `true` and sets the corresponding message.
   * Optionally an error code can be supplied, 
   * which is specifically used to verify if the error indicates an invalid session.
   * 
   * @param {String} message The error message
   * @param {Number} code The error code
   */
  @action setError = (message, code) => {
    this.error.status = true;
    this.error.message = message;
    if (code === 401) {
      authenticationStore.isLoggedIn = false;
    }
  };

  @action dismissError = () => this.error.status = false;

}

const errorStore = window.errorStore = new ErrorStore();

export default errorStore;