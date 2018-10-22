// pages/gameend/gameend.js
import {
  connect
} from '../../lib/wx-redux.js';
Page(connect()({

  /**
   * 页面的初始数据
   */
  data: {
    winerAvatarUrl: '',
    winerNickName: '',
    winerUserId: '',
    rankList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      winerUserId: options.userId,
      winerAvatarUrlrl: decodeURIComponent(options.avatarUrl),
      winerNickName: decodeURIComponent(options.nickName),
      right: options.right
    })
    const ethInfo = wx.getStorageSync('ethInfo');
    console.log('ethInfo: ', ethInfo);
  },

  fetchUserData() {
    wx.request({
      url: `http://live.trunk.koo.cn/api/1024/user_data?uuid=${this.data.userInfo.uuid}`,
      success: (_r) => {
        const r = _r.data;
        if (r.code != 0) {
          throw new Error('server error.');
        } else {
          const data = r.data;
          const rankList = data.rankList;
          this.setData({
            rankList,
          });
        }
      }
    })
    // var r = {
    //   "code": 0,
    //   "data": {
    //     "rankList": [{
    //       "avatarUrl": "xx.xx/dfdfd122.png",
    //       "bonus": "200",
    //       "id": null,
    //       "nickName": "test002",
    //       "score": "2",
    //       "smallRoomId": null,
    //       "uuid": "test000000002"
    //     }, {
    //       "avatarUrl": "xx.xx/dfdfd122.png",
    //       "bonus": "100",
    //       "id": null,
    //       "nickName": "test003",
    //       "score": "1",
    //       "smallRoomId": null,
    //       "uuid": "test000000003"
    //     }],
    //     "userInfo": {
    //       "bonus": 200,
    //       "order": 1,
    //       "pkNum": 2,
    //       "score": 2
    //     }
    //   },
    //   "message": "操作成功"
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.fetchUserData();
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

  }
}));