let app;

function callFunc(func, ctx, ...args) {
  if (typeof func === 'function') {
    return func.call(ctx || null, ...args);
  }
}

exports.Provider = function Provider(store) {
  return (AppConfig = {}) => {
    const _onLaunch = AppConfig.onLaunch;
    AppConfig.onLaunch = function() {
      app = this;
      app.store = store;
      callFunc(_onLaunch, this);
    }
    return AppConfig;
  }
}

exports.connect = function connect(mapStateToData, mapDispatchToThis) {
  return (pgObject = {}) => {
    const store = app.store,
      propsData = typeof mapStateToData === 'function' ? mapStateToData(store.getState()) : store.getState(),
      dispatchMethods = callFunc(mapDispatchToThis, null, store.dispatch);
    let unsubscribe;

    pgObject.data = Object.assign({}, pgObject.data, propsData);
    const _pgOnLoad = pgObject.onLoad;
    pgObject.onLoad = function(query) {
      this.store = store;
      if (dispatchMethods) {
        const keys = Object.keys(dispatchMethods);
        for (let i = keys.length; i--;) {
          this[keys[i]] = dispatchMethods[keys[i]].bind(null);
        }
      }
      callFunc(_pgOnLoad, this, query);
    }
    const _pgOnReady = pgObject.onReady;
    pgObject.onReady = function() {
      unsubscribe = store.subscribe(() => {
        const newState = store.getState();
        const keys = Object.keys(newState);
        for (let i = keys.length; i--;) {
          this.setData({
            [keys[i]]: newState[keys[i]]
          });
        }
      });
      callFunc(_pgOnReady, this);
    }
    const _pgOnUnload = pgObject.onUnload;
    pgObject.onUnload = function() {
      unsubscribe();
      callFunc(_pgOnUnload, this);
    }
    return pgObject;
  }
}