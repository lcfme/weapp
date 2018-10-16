// pages/pusher-test/pusher-test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getCameraAuth(() => {
      this.getRecordAuth(() => {
        const pusherCtx = wx.createLivePusherContext(this);
        pusherCtx.start();
      }, () => {
        // this.openSettings();
      })
    }, () => {
      // this.openSettings();
    });

  },
  openSettings(succ, fail) {
    wx.openSetting({
      success: res => {
        succ && succ();
      },
      fail: err => {
        fail && fail();
      }
    });
  },
  getCameraAuth(succ, fail) {
    wx.authorize({
      scope: 'scope.camera',
      success: res => {
        succ && succ();
      },
      fail: err => {
        fail && fail();
      }
    })
  },
  getRecordAuth(succ, fail) {
    wx.authorize({
      scope: 'scope.record',
      success: res => {
        succ && succ();
      },
      fail: err => {
        fail && fail();
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  stateChange(e) {
    const code = e.detail.code;
    console.log(code);
  },
  error(e) {
    const code = e.detail.errCode;
    console.log(code);
  }
})