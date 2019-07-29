// pages/specialArticle/specialArticle.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList: [],
    class_id: '',
    name: '',
    filter: {},
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var class_id = options.id ? options.id : '' // 分类id
    var name = options.name ? options.name : '设置标题' // 分类名称
    var type = options.type ? options.type : '' // 分辨参数（我的浏览，我的点赞...）
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      class_id: class_id,
      userInfo: userInfo
    })
    wx.setNavigationBarTitle({
      title: options.name ? options.name : options.type
    })
    if (type == '我的浏览') {
      this.queryVisit()
    } else if (type == '我的点赞'){
      this.queryPollList()
    } 
    else {
      this.initArticleList(class_id)
    }
  },
  queryPollList(){
    var _this = this;
    _this.setData({ // 根据我的浏览查询文章
      filter: {
        _openid: wx.getStorageSync("openid")
      }
    })
    wx.showLoading({
      title: '正在加载...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'poll',
        pageIndex: 1,
        pageSize: 10,
        filter: _this.data.filter,
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
  queryVisit() {
    var _this = this;
    _this.setData({ // 根据我的浏览查询文章
      filter: {
        openid: wx.getStorageSync("openid")
      }
    })
    wx.showLoading({
      title: '正在加载...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'browsing_volume',
        pageIndex: 1,
        pageSize: 10,
        filter: _this.data.filter,
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
  initArticleList(id) {
    var _this = this;
    if (_this.data.class_id != '') { // 根据分类查询文章
      this.setData({
        filter: {
          class_id: parseInt(_this.data.class_id)
        }
      })
    }
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
        filter: _this.data.filter,
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log(res.result.data)
        _this.setData({
          articleList: _this.data.articleList.concat(res.result.data)
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