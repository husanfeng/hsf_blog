// pages/about-me/about-me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: 'https://6873-hsf-blog-product-jqt54-1256640731.tcb.qcloud.la/github.md/concat-me.jpg?sign=35d9b474d1f19479b2f8194b00415997&t=1577171887'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  clickImg() {
    wx.previewImage({
      current: 'https://6873-hsf-blog-product-jqt54-1256640731.tcb.qcloud.la/github.md/concat-me.jpg?sign=35d9b474d1f19479b2f8194b00415997&t=1577171887',
      urls: ['https://6873-hsf-blog-product-jqt54-1256640731.tcb.qcloud.la/github.md/concat-me.jpg?sign=35d9b474d1f19479b2f8194b00415997&t=1577171887'],
    });
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