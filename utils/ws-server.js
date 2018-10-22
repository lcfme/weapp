import WebSocket from '../lib/wx-socket.js';
import store, {
  EVENT
} from '../store/store.js';

const socket = new WebSocket();

socket.on('error', e => {
  if (socket.open) {
    socket.close();
  };
});

socket.on('message', e => {
  try {
    const msg = JSON.parse(e.data);
    console.log(msg);
    switch (msg.cmd) {
      case 'set_ethinfo':
        const ethInfo = msg.ethInfo
        wx.setStorageSync('ethInfo', ethInfo);
        store.dispatch({
          type: EVENT.SET_ETHINFO,
          payload: ethInfo
        });
      default:
        console.warn('alive');
    }
  } catch (err) {
    console.log(err);
  }
});

socket.on('close', e => {
  wx.showModal({
    title: '连接失败',
    content: '您已掉线',
    showCancel: false,
    success() {
      wx.reLaunch({
        url: '/pages/main/main',
      });
    }
  });
});

export default socket;