// app.js
import {
  Provider
} from './lib/wx-redux.js';
import uuid from './lib/uuidv4.js';
import store from './store/store.js';
App(Provider(store)({
  onLaunch() {
    
  }
}));