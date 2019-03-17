import { combineReducers } from 'redux';
import Runtime from './RuntimeReducer';
import Auth from './AuthReducer';

const rootReducer = combineReducers({
  Runtime,
  Auth,
});

export default rootReducer;
