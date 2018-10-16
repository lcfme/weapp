import { createStore, applyMiddleWare } from '../lib/redux.js';

export default createStore(function(state = {count: 0, msg: 'ok'}, action) {
  if (action.type === 'inc') {
    return {
      ...state,
      count: state.count + 1,
    }
  }
  return state;
});