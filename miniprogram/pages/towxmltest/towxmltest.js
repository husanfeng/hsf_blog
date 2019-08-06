//index.js

//获取应用实例
const app = getApp();

Page({
  data: {
    isloading: true,
    article: {},
    timer: undefined
  },
  onLoad: function() {
    this.load();
  },
  load() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleDetail',
      data: {
        dbName: 'content',
        id:"1"
      },
      success: res => {
        console.log(res)
        _this.setData({
          article: res.result,
          isloading: false
        });
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }
})