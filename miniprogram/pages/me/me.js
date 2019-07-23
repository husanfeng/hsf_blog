//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    avatarUrl: 'https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/resources/user-unlogin.png?sign=e437bd460ffd19092f4b08b006e7afe9&t=1563595564',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    functionList: ["我的浏览", "我的点赞", "我的评论", "关于我"]
  },
  onLoad: function() {
    if (!wx.cloud) {
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  click(e) {
    var type = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../articleList/articleList?type=' + type
    })
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      app.globalData.userInfo = e.detail.userInfo
    }
  },
})