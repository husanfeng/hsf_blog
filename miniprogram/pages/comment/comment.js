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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var type = options.type; // 1是回复  2是评论
    this.setData({
      type: type
    })
    wx.setNavigationBarTitle({
      title: '写留言',
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
      if (type == 1) { // 1是回复  
        this.replyComment()
      } else if (type == 2) { // 2是评论
        this.addComment();
      }
    }
  },
  /**
   * 回复评论
   */
  replyComment() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var create_date = util.formatTime(new Date());
    console.log("当前时间为：" + create_date);
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    // console.log("当前时间戳为：" + timestamp);
    var otherUserInfo = app.globalData.otherInfo
    var userInfo = app.globalData.userInfo
    // console.log("对方信息" + otherInfo)
    // 调用云函数


    // article_id: 1
    // avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLqoxFF8S5Tl8b4THwoDBH33XPhbO82Jmv7rGaAmib8WHJDxs9xZPicQUm5qpsYC19RO3qJMblItuNw/132"
    // childComment: (4)[{ … }, { … }, { … }, { … }]
    // comment: "测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论测试评论"
    // create_date: 1563979433
    // flag: 0
    // nickName: "★那一抹笑^穿透阳光★"
    // timestamp: 1563979433
    // _id: 1563979433
    // _openid: "oJX0Y4xP5Hny2v3dzt9CaDwJrZ6w"
    wx.cloud.callFunction({
      name: 'replyComment',
      data: {
        _id: otherUserInfo._id,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        openId: userInfo.openId,
        comment: _this.data.inputData,
        createDate: create_date,
        flag: 0,
        opposite_avatarUrl: otherUserInfo.avatarUrl,
        opposite_nickName: otherUserInfo.nickName,
        opposite_openId: otherUserInfo._openid,
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
        _openid: app.globalData.openid,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        comment: _this.data.inputData,
        create_date: create_date,
        flag: 0,
        article_id: 1,
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