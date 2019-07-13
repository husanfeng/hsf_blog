//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
  },

  onLoad: function() {
   this.init();
  },
  init(){
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    db.collection('top_images').get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        _this.setData({
          imgUrls: res.data
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  }
})