// pages/main/main.js
import uuidv4 from '../../lib/uuidv4.js';
import {
  connect
} from '../../lib/wx-redux.js';
import {
  EVENT
} from '../../store/store.js'
import ws from '../../utils/ws-server.js';
import randomInt from '../../utils/randomInt.js';
import moment from '../../lib/moment.js';
import qs from '../../lib/qs.js';

Page(connect()({
  /**
   * 页面的初始数据
   */
  data: {
    main_btn_text: '报名参赛',
    lockForConnect: false,
    currentBgImgIndex: randomInt(0, 2),
    currentBgImgUrl: ['../../assets/img/stu_bg0.png', '../../assets/img/stu_bg1.png', '../../assets/img/stu_bg2.png'],
    bigGameInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onBigGameData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.userInfo && this.data.userInfo.uuid) {
      this.setData({
        main_btn_text: '开始比赛'
      });
      this.onGetUserInfo();
    } else {
      this.setData({
        main_btn_text: '报名参赛'
      });
    }
    this.setData({
      lockForConnect: false,
    })
  },
  bindGetUserInfo(e) {
    if (this.data.lockForConnect) return;
    if (this.data.userInfo && this.data.userInfo.uuid) {
      this.onGetUserInfo();
      if (ws.open) {
        wx.navigateTo({
          url: '/pages/gamepage/gamepage',
        });
      } else {

        ws.once('open', e => {
          wx.navigateTo({
            url: '/pages/gamepage/gamepage',
          });
        })
      }
      this.setData({
        main_btn_text: '连接中'
      });
      this.setData({
        lockForConnect: true,
      });
    } else {
      let uuid = wx.getStorageSync('uuid');
      if (typeof uuid !== 'string' || uuid.length === 0) {
        uuid = uuidv4();
        wx.setStorageSync('uuid', uuid);
      }
      const {
        detail
      } = e;
      if (!/fail/.test(detail.errMsg)) {
        wx.showModal({
          title: '支付',
          content: '一元',
          success: () => {
            const userInfo = detail.userInfo;
            userInfo.uuid = uuid;
            wx.setStorageSync('userInfo', userInfo);
            this.store.dispatch({
              type: EVENT.USER_INFO,
              payload: userInfo,
            });
            this.onGetUserInfo();
            if (ws.open) {
              wx.navigateTo({
                url: '/pages/gamepage/gamepage',
              });
            } else {
              ws.once('open', e => {
                ws.send({
                  cmd: 'req_play'
                });
              });
            }

            this.setData({
              main_btn_text: '连接中',
              lockForConnect: true,
            });
          }
        })
      } else {
        wx.showModal({
          title: '',
          content: '您必须同意授权才能使用',
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  onGetUserInfo() {
    this.registerUserInfo();
    const ethInfo = wx.getStorageSync('ethInfo');
    const queryObj = {
      token: this.data.userInfo.uuid,
      avatarUrl: this.data.userInfo.avatarUrl,
      nickName: this.data.userInfo.nickName,
    };
    // let wsUrl = `ws://10.155.24.183:4321?token=${this.data.userInfo.uuid}&avatarUrl=${encodeURIComponent(this.data.userInfo.avatarUrl)}&nickName=${encodeURIComponent(this.data.userInfo.nickName)}`;
    let wsBaseUrl = 'ws://10.155.24.183:4321';
    if (!ethInfo) {
      console.log(wsBaseUrl + '?' + qs.stringify(queryObj));
      ws.connect({
        url: wsBaseUrl + '?' + qs.stringify(queryObj),
      });
    } else {
      queryObj.ethAccount = ethInfo.account;
      queryObj.ethPass = ethInfo.password;
      // wsUrl += `&ethAccount=${encodeURIComponent(ethInfo.account)}&ethPass=${encodeURIComponent(ethInfo.password)}`;
      console.log(wsBaseUrl + '?' + qs.stringify(queryObj));
      ws.connect({
        url: wsBaseUrl + '?' + qs.stringify(queryObj),
      });
    }
    this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
    ws.on('message', this.onWebSocketMessage);
  },
  onWebSocketMessage(e) {
    try {
      const msg = JSON.parse(e.data);
    } catch (err) {
      console.warn(err);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    ws.off('message', this.onWebSocketMessage);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  registerUserInfo() {
    wx.request({
      url: `http://live.trunk.koo.cn/api/1024/enter?uuid=${this.data.userInfo.uuid}&avatarUrl=${encodeURIComponent(this.data.userInfo.avatarUrl)}&nickName=${encodeURIComponent(this.data.userInfo.nickName)}`,
      method: 'GET',
    });
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
  onBigGameData() {
    wx.request({
      url: 'http://live.trunk.koo.cn/api/1024/big_room_info',
      method: 'GET',
      success: (_res) => {
        const res = _res.data;
        if (res.code != 0) {
          return;
        }
        const dataInfo = res.data.info;
        const bigGameInfo = {
          bonusPool: dataInfo.bonusPool,
          beginTime: moment(Number(dataInfo.beginTime)).format('YYYY-MM-DD'),
          endTime: moment(Number(dataInfo.endTime)).format('YYYY-MM-DD'),
        }
        this.setData({
          bigGameInfo,
        });
      }
    });
  }
}));