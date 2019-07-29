// pages/comment/comment.js
const util = require('../../utils/util.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    surplus: 200,
    inputData: '',
    type: '',
    openid:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '写留言',
    })
    var type = options.type; // 1是回复  2是评论
    var otherUserInfo = wx.getStorageSync("otherInfo")
    var userInfo = wx.getStorageSync("userInfo")
    var articleDetail = wx.getStorageSync("articleDetail")
    var openid = wx.getStorageSync("openid")
    this.setData({
      type: type,
      otherUserInfo: otherUserInfo,
      userInfo: userInfo,
      articleDetail: articleDetail,
      openid: openid
    })
  },
  input(event) {
    var value = event.detail.value,
      len = parseInt(value.length);
    let that = this;
    this.setData({
      inputData: value,
      surplus: 200 - len
    });
  },
  submit() {
    var comment = this.data.inputData
    if (comment == '') {
      wx.showToast({
        title: '请填写评论',
        icon: 'none'
      })
    } else {
      console.log("我的评论：" + this.data.inputData)
      var type = this.data.type;
      if (type == 1) { // 1是评论别人的评论===》二级评论
        this.replyComment(1)
      } else if(type==2){
        this.replyComment(2) // 2是回复别人的评论===》三级评论
      }
      else if (type == 3) { // 3是评论文章===》一级评论
        this.addComment();
      }
    }
  },
  /**
   * 回复评论
   */
  replyComment(commentType) {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var create_date = util.formatTime(new Date());
    console.log("当前时间为：" + create_date);
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx.cloud.callFunction({
      name: 'replyComment',
      data: {
        _id: _this.data.otherUserInfo._id,
        avatarUrl: _this.data.userInfo.avatarUrl,
        nickName: _this.data.userInfo.nickName,
        openId: _this.data.openid,
        comment: _this.data.inputData,
        createDate: create_date,
        flag: commentType,
        opposite_avatarUrl: _this.data.otherUserInfo.avatarUrl,
        opposite_nickName: _this.data.otherUserInfo.nickName,
        opposite_openId: _this.data.otherUserInfo._openid,
        timestamp: timestamp,
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log("回复评论成功---")
        wx.navigateBack({
          delta: 1
        })
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },
  /**
   * 新增评论
   */
  addComment() {
    var _this = this;
    var openid = wx.getStorageSync("openid")
    wx.showLoading({
      title: '正在加载...',
    })
    var create_date = util.formatTime(new Date());
    console.log("当前时间为：" + create_date);
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    // 调用云函数
    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        _id: timestamp,
        _openid: openid,
        avatarUrl: _this.data.userInfo.avatarUrl,
        nickName: _this.data.userInfo.nickName,
        comment: _this.data.inputData,
        create_date: create_date,
        flag: 0,
        article_id: _this.data.articleDetail._id,
        timestamp: timestamp,
        childComment: [],
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log("新增评论成功---")
        wx.navigateBack({
          delta: 1
        })
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })

  },
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