import {connect} from '../../lib/wx-redux.js';
Page(connect(function (state) {
  return {
    count: state.count,
    bbb: state.msg
  }
}, function(dispatch) {
  return {
    inc() {
      dispatch({
        type: 'inc'
      })
    }
  }
})({
  data: {
    
  },
  onLoad() {
  },
  onReady() {
    
  },
  // inc() {
  //   this.store.dispatch({
  //     type: 'inc'
  //   })
  // },
  naviTo(e) {
    const {url} = e.currentTarget.dataset;
    wx.navigateTo({
      url,
    });
  }
  
}));