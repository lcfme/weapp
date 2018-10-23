import EventEmitter from './eventemitter3';
class WebSocket extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.open = false;
    // this.buffer = [];
    this.hasClosed = false;
  }
  connect(opt = {}, force) {
    if (this.socket && !force) return;
    if (this.socket) {
      this.socket.close();
      this.removeAllListeners();
    }
    this.socket = wx.connectSocket(opt);
    this.socket.onOpen(e => {
      this.open = true;
      // let t;
      // while (this.buffer.length) {
        // t = this.buffer.pop();
        // this.socket.send(t);
      // }
      console.warn('打开socket', e);
      this.emit('open', e);
    });
    this.socket.onMessage(e => {
      console.warn('收到消息', e)
      this.emit('message', e);
    });
    this.socket.onClose(e => {
      this.open = false;
      this.hasClosed = true;
      console.warn('socket关闭',e);
      this.emit('close', e);
      this.removeAllListeners();
    });
    this.socket.onError(e => {
      console.warn('socket错误',e);
      this.emit('error', e);
    });
    return this.socket;
  }
  send(opt = {}) {
    if (!opt) return;
    console.warn('socket发送消息', opt);
    if (this.open) {
      this.socket.send({
        data: JSON.stringify(opt),
        fail: (err) => {
          console.error('socket发送消息失败', err);
          setTimeout(() => {
            this.send(opt);
          });
        }
      });
    } else {
      // this.buffer.push(opt);
    }
  }
  close(opt = {}) {
    this.socket.close(opt);
  }
}

export default WebSocket;