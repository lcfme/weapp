import {
  createStore,
  applyMiddleware
} from '../lib/redux.js';
import logger from '../lib/redux-logger-laearon.js';
import reducer, {
  EVENT
} from './reducer.js';

export default createStore(reducer, applyMiddleware(logger));

export {
  EVENT
}