import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import token from './login';
import notes from './notes';

const rootReducer = combineReducers({
    token,
    notes,
    routing
});

export default rootReducer;
