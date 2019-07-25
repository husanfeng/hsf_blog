const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 提示框
 * @param title 提示的内容（必填）
 * @param icon  图标,默认值是 'success' (可选值有 loading，success，none)
 */
const showToast = (title, icon = "success") => {
  wx.showToast({
    title: title,
    icon: icon,
    duration: 1500
  });
};
/**
 * 配置请求参数
 * @param init
 * @returns {*}
 */
function initParam(init) {
  init = Object.assign({}, init, {
    url: getApp().globalData.appurl + init.url,
    header: {
      'Authorization': wx.getStorageSync(token)
    }
  });
  return init;
}
/**
 * 发起请求
 * @param init 请求配置
 * @param success 业务成功回调
 * @param fail 业务异常回调
 * @param complete 请求
 */
const doRequest = (init = {}, success, fail, complete) => {
  init = initParam(init);
  init = Object.assign({}, init, {
    success: function(res) {
      if (res.statusCode !== 200) {
        handlerError(res, fail, () => {
          doRequest(Object.assign({}, init, {
            url: init.url
          }), success, fail, complete);
        });
        return;
      }
      if (typeof success === 'function') {
        success(res);
      }
    },
    fail: function() {
      //发起请求失败了,这里要进行友好提示
      showToast("请求数据失败", "none")
    },
    complete: function() {
      //请求成功或者失败都会执行
      if (typeof complete === 'function') {
        complete();
      }
    }
  });
  wx.request(init);
};
/**
 * 全局异常处理
 * @param res
 * @param failFun
 * @param loginSuccessCallBack 登录成功,继续执行刚刚的方法
 */
function handlerError(res, failFun, loginSuccessCallBack) {

  /*JWT_TOKEN过期重新回到展会首页自动登录*/
  if (res.data && res.data.message === "JWT_TOKEN_ERROR") {
    wx.reLaunch({
      url: '../tabbar/tabbar'
    });
    return;
  }

  //如果有自定义的异常处理,则只处理自定义的就返回。
  if (typeof failFun === 'function') {
    failFun(res);
    return;
  }
  //自定义的业务异常
  if (res.data && res.data.hasException) {
    showToast(res.data.errMsg, "none");
  }
  //其他异常
  if (res.data && res.data.message) {
    showToast(res.data.message, "none");
  }
}

module.exports = {
  doRequest: doRequest,
  formatTime: formatTime,
  showToast: showToast,
}