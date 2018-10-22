let userInfo = wx.getStorageSync('userInfo');
if (!userInfo) {
  userInfo = null;
}

export const EVENT = {
  USER_INFO: randS(),
  SET_WINER: randS(),
  SET_ETHINFO: randS(),
}

function randS() {
  return Math.random().toString(16).substr(2)
}

export default function(state = {
  count: 0,
  userInfo: userInfo,
  msg: 'ok',
}, action) {
  switch (action.type) {
    case EVENT.USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      }
    case EVENT.SET_WINER:
      return {
        ...state,
        winer: action.payload
      }
    case EVENT.SET_ETHINFO:
      return {
        ...state,
        ethInfo: action.payload
      }
    default:
  }
  return state;
}