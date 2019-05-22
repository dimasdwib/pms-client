import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import axios from 'axios';
import App from './App';
import config from './config';
import configureStore from './configureStore';

const root = document.getElementById('root');
const store = configureStore(window.__PRELOADED_STATE__);

axios.defaults.baseURL = config.api.endpoint;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const token = localStorage.getItem('aToken');
if (token !== null) {
  axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
}

window.main = () => {
  render(App);
};

function render(Root) {
  Loadable.preloadReady().then(() => {
    hydrate(
      <BrowserRouter>
        <Provider store={store}>
          <Root />
        </Provider>
      </BrowserRouter>,
      root
    );
  });
}

if (module.hot) {
  module.hot.accept('./App', () => {
    console.log('🔁 App Updated');
    const NewApp = require('./App').default;
    render(NewApp);
  });
}