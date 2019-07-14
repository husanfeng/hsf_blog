//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    classficationList: [],
    articleList:[],
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
  },

  onLoad: function() {
    this.initSwiper();
    this.initClassfication();
    this.initArticleList();
  },
  initArticleList(){
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    db.collection('article').get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        _this.setData({
          articleList: res.data
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },
  initClassfication() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    db.collection('classfication').get({
      success: function(res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        _this.setData({
          classficationList: res.data
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        wx.hideLoading()
      }
    })
  },
  initSwiper() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    db.collection('top_images').get({
      success: function(res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        _this.setData({
          imgUrls: res.data
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        wx.hideLoading()
      }
    })
  }
})