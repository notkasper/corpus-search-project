import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import applicationStore from './stores/ApplicationStore';
import queryFilterStore from './stores/QueryFilterStore';
import frequencyFilterStore from './stores/FrequencyFilterStore';
import frequencyStore from './stores/FrequencyStore';
import authenticationStore from './stores/AuthenticationStore';
import tabStore from './stores/TabStore';
import queryStore from './stores/QueryStore';
import errorStore from './stores/ErrorStore';
import themeStore from './stores/ThemeStore';
import App from './components/App';

const stores = {
  applicationStore: applicationStore,
  authenticationStore: authenticationStore,
  queryFilterStore: queryFilterStore,
  frequencyFilterStore: frequencyFilterStore,
  frequencyStore: frequencyStore,
  queryStore: queryStore,
  errorStore: errorStore,
  tabStore: tabStore,
  themeStore: themeStore,
};

try {
  ReactDOM.render(
    (
      <Provider {...stores}>
        <App />
      </Provider>
    ),
    document.getElementById('root')
  );
} catch (error) {
  console.error(error);
}
