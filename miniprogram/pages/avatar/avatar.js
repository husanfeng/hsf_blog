// pages/avatar/avatar.js
import util from "../../utils/util.js"
const app = getApp()
const db = wx.cloud.database({
  env: app.env
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  getInfo: function(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '未获取到你的头像！',
        icon: "none"
      })
      return false;
    }
    wx.showLoading({
      title: '头像生成中',
    })
    var avatar = e.detail.userInfo.avatarUrl; // https://wx.qlogo.cn/mmopen/vi_32/74FR1sdiaCibXDCHn9HDFc1LJZvFlcqicibggTWSiakQPDZrNMO0KeWqhlhHyCsb5icCk3DPmMLd3Zq9eORFOF3ib5zcw/132
    var arr = avatar.split("/132");
    var avatarUrl = arr[0] + "/0"

    wx.getFileSystemManager().readFile({
      filePath: avatarUrl,
      success: buffer => {
        console.log("buffer.data====")
        console.log(buffer.data)
      },
      fail:err=>{
        console.log(err)
        wx.hideLoading()
      }
    })

    // 调用云函数
    // wx.cloud.callFunction({
    //   name: 'image',
    //   data: {
    //     avatar: avatarUrl, // 头像获取自 userInfo
    //     style: e.target.dataset.style // style 可以取值 1 ～ 4
    //   }
    // }).then(res => {
    //   console.log("头像地址===" + res.result.url)
    //   this.setData({
    //     avatarUrl: res.result.url
    //   }, res => {
    //     wx.hideLoading();
    //     var openid = wx.getStorageInfoSync("openid")
    //     if (openid && openid != "") {
    //       this.initData(e.detail.userInfo);
    //     } else {
    //       this.getUserOpenId(() => {
    //         this.initData(e.detail.userInfo);
    //       })
    //     }
    //   })
    // }, err => {
    //   console.log(err);
    //   wx.hideLoading();
    // })
  },

  // initData(userInfo) {
  //   var openid = wx.getStorageSync("openid")
  //   this.queryUser(openid, (isLoad) => {
  //     if (isLoad) {
  //       this.saveUser(userInfo);
  //     } else {
  //       this.updateUser();
  //     }
  //   })
  // },
  // getUserOpenId(callback) {
  //   var _this = this;
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'getUserOpenId',
  //     data: {},
  //     success: res => {
  //       console.log("用户的openID=" + res.result.openid)
  //       wx.setStorageSync("openid", res.result.openid)
  //       this.setData({
  //         openid: res.result.openid
  //       })
  //       callback();
  //     },
  //     fail: err => {
  //       console.error('[云函数]调用失败', err)
  //     },
  //     complete: res => {

  //     }
  //   })
  // },
  // queryUser(openid, callback) {
  //   var _this = this;
  //   db.collection('user').where({
  //     _id: openid
  //   }).get({
  //     success: function(res) {
  //       if (res.data.length > 0) {
  //         callback(false);
  //       } else {
  //         callback(true);
  //       }
  //     },
  //     fail: function(res) {},
  //     complete: function(res) {}
  //   })
  // },
  // saveUser(data) {
  //   // 调用云函数
  //   var openid = this.data.openid;
  //   var loginTime = util.formatTime(new Date());
  //   data.lastLoginTime = loginTime;
  //   data.loginTime = loginTime;
  //   data.openid = openid;
  //   wx.cloud.callFunction({
  //     name: 'saveUser',
  //     data: data,
  //     success: res => {
  //       // console.log("=" + res.result.openid)
  //     },
  //     fail: err => {
  //       console.error('[云函数]调用失败', err)
  //     },
  //     complete: res => {}
  //   })
  // },
  // updateUser() {
  //   // 调用云函数
  //   var openid = this.data.openid;
  //   var lastLoginTime = util.formatTime(new Date());
  //   wx.cloud.callFunction({
  //     name: 'updateUsers',
  //     data: {
  //       _id: openid,
  //       lastLoginTime: lastLoginTime
  //     },
  //     success: res => {
  //       console.log("=" + res)
  //     },
  //     fail: err => {
  //       console.error('[云函数]调用失败', err)
  //     },
  //     complete: res => {
  //       console.log("=" + res)
  //     }
  //   })
  // },
  /**
   * 保存海报图片
   */
  // savePosterImage: function() {
  //   var img = this.data.avatarUrl;
  //   if (img != "") {
  //     wx.previewImage({
  //       current: this.data.avatarUrl,
  //       urls: [this.data.avatarUrl],
  //     });
  //   }
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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

  }
})