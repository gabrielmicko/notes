import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './Containers/App';
import Container from './Containers/Container';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Container} />
    <Route path="/note/:id(/:title)" component={Container} />
  </Route>
);
