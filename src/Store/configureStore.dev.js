import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import rootReducer from '../Reducers';
import DevTools from '../Containers/DevTools';

const enhancer = compose(
  applyMiddleware(thunk),
  DevTools.instrument(),
  persistState(
    window.location.href.match(/[?&]debug_session=([^&#]+)\b/)
  ),
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../Reducers', () => {
      store.replaceReducer(require('../Reducers').default)
    });
  }
  return store;
}
