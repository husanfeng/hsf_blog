// pages/avatar/avatar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  getInfo: function(e) {
    wx.showLoading({
      title: '头像生成中',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'image',
      data: {
        avatar: e.detail.userInfo.avatarUrl, // 头像获取自 userInfo
        style: e.target.dataset.style // style 可以取值 1 ～ 4
      }
    }).then(res => {
      this.setData({
        avatarUrl: res.result.url
      }, res => {
        wx.hideLoading();
      })
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