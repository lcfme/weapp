// pages/gamepage/gamepage.js
import {
  connect
} from '../../lib/wx-redux.js';
import {
  EVENT
} from '../../store/store.js';
import ws from '../../utils/ws-server.js';
import qs from '../../lib/qs.js';

function randS() {
  return Math.random().toString(16).substr(2);
}
const STATUS = {
  WAIT: randS(),
  PREPARE: randS(),
  START: randS(),
  END: randS(),
}
Page(connect()({
  /**
   * 页面的初始数据
   */
  data: {
    STATUS: STATUS,
    status: STATUS.WAIT,
    rtmpUrl: [],
    roomId: null,
    thisQuestion: null,
    currentQuestionIndex: 0,
    otherUserId: null,
    otherAvatarUrl: null,
    otherNickname: null,
    lockForAnswer: false,
    option_alias: ['A', 'B', 'C', 'D'],
    otherGiveUpFlag: false,
    counterNum: 5,
    countClear: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!this.data.userInfo || !this.data.userInfo.uuid || !ws.open) {
      wx.reLaunch({
        url: '/pages/main/main',
      });
      return;
    }
    this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
    ws.on('message', this.onWebSocketMessage);
    this.countClear = setInterval(() => {
      this.intervalFn();
    }, 1000);
  },
  onWebSocketMessage(e) {
    try {
      const msg = JSON.parse(e.data);
      switch (msg.cmd) {
        case 'game_room_created':
          this.setData({
            status: STATUS.PREPARE,
            rtmpUrl: [`rtmp://fms.neibu.koolearn.com/live/${this.data.userInfo.uuid}`, `rtmp://fms.neibu.koolearn.com/live/${msg.others[0].userId}`],
            otherUserId: msg.others[0].userId,
            otherAvatarUrl: msg.others[0].avatarUrl,
            otherNickname: msg.others[0].nickName,
            roomId: msg.roomId
          });
          setTimeout(() => {
            this.onSelfReady();
          }, 2000);
          break;
        case 'game_start':
          this.data.counterNum = 3;
          this.setData({
            counterNum: this.data.counterNum,
          });
          this.onGameStart();
          break;
        case 'next_question':
          this.data.counterNum = 5;
          this.setData({
            counterNum: this.data.counterNum,
          });
          this.onNextQuestion({
            ...msg.question,
            index: msg.index
          });
          break;
        case 'game_winer':
          this.store.dispatch({
            type: EVENT.SET_WINER,
            payload: {
              userId: msg.userId,
              avatarUrl: msg.avatarUrl,
              nickName: msg.nickName,
              right: msg.right,
            }
          })
          break;
        case 'game_over':
          {
            this.setData({
              status: STATUS.END,
            });
            if (this.data.winer) {
              const urlInfo = {
                userId: this.data.winer.userId,
                avatarUrl: this.data.winer.avatarUrl,
                nickName: this.data.winer.nickName,
                right: this.data.winer.right,
              }
              if (!this.data.otherGiveUpFlag) {
                wx.redirectTo({
                  url: '/pages/gameend/gameend?' + qs.stringify(urlInfo),
                });
              } else {
                wx.showModal({
                  content: '对手已退出游戏',
                  showCancel: false,
                  complete: () => {
                    wx.redirectTo({
                      url: '/pages/gameend/gameend?' + qs.stringify(urlInfo),
                    });
                  }
                });
              }
            } else {
              wx.reLaunch({
                url: '/pages/main/main',
              });
            }
            break;
          }
        case 'peer_quit':
          if (msg.userId === this.data.userInfo.uuid) {
            wx.showModal({
              showCancel: false,
              content: '您已退出游戏',
              success: () => {
                wx.reLaunch({
                  url: '/pages/main/main',
                });
              }
            });
          } else {
            this.data.otherGiveUpFlag = true;
            this.setData({
              otherGiveUpFlag: true,
            });
          }

          break;
        default:
          throw 'No Matched Command';
      }
    } catch (err) {
      console.warn(err);
    }
  },

  onGameFinish() {
    this.setData({
      status: STATUS.END
    });
  },
  onSelfReady() {
    ws.send({
      cmd: 'player_ready'
    });
  },
  onNextQuestion(question) {
    if (!question) return;
    this.data.lockForAnswer = false;
    question.optionBgColor = question.options.map(item => '');
    this.data.thisQuestion = question;
    this.data.currentQuestionIndex = isNaN(question.index) ? this.data.currentQuestionIndex + 1 : question.index
    this.setData({
      thisQuestion: this.data.thisQuestion,
      currentQuestionIndex: this.data.currentQuestionIndex
    });
    console.log(this.data.thisQuestion, question);
  },
  onGameStart() {
    this.setData({
      status: STATUS.START
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    ws.send({
      cmd: 'req_play'
    });
    let userInfo;
    if (this.data.userInfo && this.data.userInfo.nickName) {
      userInfo = this.data.userInfo;
    } else {
      userInfo = wx.getStorageSync('userInfo');
    }
    this.setData({
      userInfo,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.status === this.data.STATUS.END) {
      wx.reLaunch({
        url: '/pages/main/main',
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    ws.send({
      cmd: 'player_quit',
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    ws.send({
      cmd: 'player_quit',
    });
    ws.off('message', this.onWebSocketMessage);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  onAnswer(e) {
    if (this.data.lockForAnswer) {
      return;
    }
    this.data.lockForAnswer = true;
    const answer = e.currentTarget.dataset.selected;
    const index = this.data.currentQuestionIndex;
    const isRight = this.data.thisQuestion.answer === answer;
    if (isRight) {
      this.data.thisQuestion.optionBgColor[answer] = '#00E300';
      this.setData({
        thisQuestion: this.data.thisQuestion
      });
    } else {
      this.data.thisQuestion.optionBgColor[answer] = '#FB4A4A';
      this.setData({
        thisQuestion: this.data.thisQuestion,
      });
    }
    ws.send({
      cmd: 'answer_question',
      answer: answer,
      index: this.data.currentQuestionIndex,
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  intervalFn() {
    if (this.data.counterNum !== 0) {
      this.data.counterNum -= 1;
    }
    this.setData({
      counterNum: this.data.counterNum,
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
}));