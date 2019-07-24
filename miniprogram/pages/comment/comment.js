// pages/comment/comment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    surplus: 200,
    inputData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
      // const _ = db.command
      // return db.collection('posts_comments').doc(id).update({
      //   data: {
      //     childComment: _.push(data)
      //   }
      this.addConmment();
    }
  },
  /**
   * 新增评论
   */
  addConmment() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
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
        create_date: timestamp,
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