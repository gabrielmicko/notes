import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import configureStore from './Store/configureStore';
import Root from './Containers/Root';
import CSS from './Less/main.less';


const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('react-app'),
);

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./Containers/Root', () => {
    const NewRoot = require('./Containers/Root').default;
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('react-app'),
    );
  });
}
