//index.js
const util = require("../../utils/util.js")
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    classficationList: [],
    articleList: [],
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,

    loading: false, // 正在加载
    loadingHasData: true, //是否还有有数据
    size: 10,
    page: 0,
    dataList: [],
  },

  onLoad: function() {
    this.getUserOpenId()
    this.initSwiper();
    this.initClassfication();
    var date = new Date('2019-07-27 08:25:40');
    // 有三种方式获取
    var time1 = date.getTime();
    var time2 = date.valueOf();
    var time3 = Date.parse(date);
    time3 = time3/1000;
    // console.log(time1);//1398250549123
    // console.log(time2);//1398250549123
    // console.log(time3);//1398250549000
    var timedes = util.getDiffTime(time3);
    console.log("时间=" + timedes);
  },
  getUserOpenId() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getUserOpenId',
      data: {},
      success: res => {
        console.log("用户的openID=" + res.result.openid)
        wx.setStorageSync("openid", res.result.openid)
        // app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },
  initArticleList() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'article',
        pageIndex: 1,
        pageSize: 10,
        // filter: {},
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log(res.result.data)
        _this.setData({
          articleList: res.result.data
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
  },
  click(e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../articleList/articleList?id=' + id + '&name=' + name,
    })
  },
  onShow() {
    this.setData({
      articleList: []
    })
    this.initArticleList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      page: 0,
      dataList: [],
    });
    this.initArticleList();
    // this.fetchSearchList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.loading)
      return;
    if (!this.data.loadingHasData)
      return;
    this.setData({
      loading: true,
      loadingHasData: true,
    });
    // this.fetchSearchList();
  },
})