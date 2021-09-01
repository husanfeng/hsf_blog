//index.js
const util = require("../../utils/util.js")
const app = getApp()

// const db = wx.cloud.database()
Page({
  data: {
    avatarUrl: 'https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/resources/user-unlogin.png?sign=e437bd460ffd19092f4b08b006e7afe9&t=1563595564',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    functionList: ["我的浏览", "我的点赞", "意见反馈", "客服", "更新日志", "消息订阅", "获取源码"],
    isShowAddPersonView: false,
    showText: '登录获取更多权限',
    openid: '',
  },
  onLoad: function () {
    if (!wx.cloud) {
      return
    }
    var openid = wx.getStorageSync("openid");
    if (!openid || openid == '') {
      this.getUserOpenId();
    } else {
      console.log("openid========" + openid);
      this.setData({
        openid: openid
      })
    }

    var userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        userInfo: userInfo,
        avatarUrl: userInfo.avatarUrl,
        // hasUserInfo: true
      })
    }else{
      this.setData({
        isShowAddPersonView: true
      })
    }
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //           wx.setStorageSync("userInfo", res.userInfo)
    //         }
    //       })
    //     } else {
    //       this.setData({
    //         isShowAddPersonView: true
    //       });
    //     }
    //   }
    // })
  },
  getUserOpenId() {
    var _this = this;
    wx.cloud.callFunction({
      name: 'getUserOpenId',
      data: {},
      success: res => {
        console.log("用户的openID=" + res.result.openid)
        wx.setStorageSync("openid", res.result.openid)
        this.setData({
          openid: openid
        })
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        // wx.hideLoading()
      }
    })
  },
  clickAdmin() {
    // wx.navigateTo({
    //   url: '../test/test'
    // })
    wx.navigateTo({
      url: '../admin/admin'
    })
  },
  click(e) {
    var type = e.currentTarget.dataset.name;
    if (type == "我的浏览" || type == "我的点赞") {
      wx.navigateTo({
        url: '../articleList/articleList?type=' + type
      })
    } else if (type == "获取源码") {
      wx.navigateTo({
        url: '../about-me/about-me'
      })
    } else if (type == "更新日志") {
      wx.navigateTo({
        url: '../updateLogs/updateLogs'
      })
    } else if (type == "消息订阅") {
      this.onSubscribe()
    }
  },
  onSubscribe() {
    wx.navigateTo({
      url: '../messageSelectList/messageSelectList'
    })
  },
  // onGetUserInfo: function (e) {
  //   if (!this.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //     wx.setStorageSync("userInfo", e.detail.userInfo)
  //   }
  // },
  confirm(e) {
    if (e.detail.userInfo) {
      this.setData({
        isShowAddPersonView: false,
        userInfo: e.detail.userInfo
      })
    }
  },
  cancel(e) {
    //console.log(e)
    this.setData({
      isShowAddPersonView: false
    })
  },
  onShow() {

  },
})