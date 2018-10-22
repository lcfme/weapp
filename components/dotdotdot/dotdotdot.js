// components/dotdotdot/dotdotdot.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    __postFix: '',
    currentFixCount: 0,
  },
  attached() {
    this.startInterval();
  },
  detached() {
    clearInterval(this.__interval_number__);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    startInterval() {
      clearInterval(this.__interval_number__);
      this.getFix();
      this.__interval_number__ = setInterval(() => {
        this.getFix();
      }, 800);
    },
    getFix() {
      var __postFix = ' ';
      for (let i = 0; i < this.data.currentFixCount; i++) {
        __postFix += '.';
      }
      this.setData({
        __postFix
      });
      if (this.data.currentFixCount > 2) {
        this.data.currentFixCount = 0;
      } else {
        this.data.currentFixCount++;
      }
      return __postFix;
    }
  }
})
