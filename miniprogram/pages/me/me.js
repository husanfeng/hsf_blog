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

    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onLoad: function () {
    if (!wx.cloud) {
      return
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    var openid = wx.getStorageSync("openid");
    this.getUserProfile()
    if (!openid || openid == '') {
      this.getUserOpenId();
    } else {
      console.log("openid========" + openid);
      this.setData({
        openid: openid
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
        //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //   // wx.getUserInfo({
        //   //   success: res => {
        //   //     this.setData({
        //   //       avatarUrl: res.userInfo.avatarUrl,
        //   //       userInfo: res.userInfo
        //   //     })
        //   //     wx.setStorageSync("userInfo", res.userInfo)
        //   //   }
        //   // })
        //   this.getUserProfile()
        // } else {
        //   this.setData({
        //     isShowAddPersonView: true
        //   });
        // }
      }
    })
  },
  getUserOpenId() {
    var _this = this;
    wx.cloud.callFunction({
      name: 'getUserOpenId',
      data: {},
      success: res => {
        console.log('getUserOpenId===>',res.result)
        console.log("用户的openID=" + res.result.openid)
        wx.setStorageSync("openid", res.result.openid)
        this.setData({
          openid: res.result.openid
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
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      wx.setStorageSync("userInfo", e.detail.userInfo)
    }
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          avatarUrl: res.userInfo.avatarUrl,
          hasUserInfo: true
        })
      }
    })
  },
  confirm(e) {
    wx.setStorageSync("userInfo", e.detail.userInfo)
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