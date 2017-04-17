import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import token from './login';
import notes from './notes';
import masternotes from './masternotes';
import settings from './settings';

const rootReducer = combineReducers({
  token,
  settings,
  notes,
  masternotes,
  routing: routerReducer
});

export default rootReducer;
