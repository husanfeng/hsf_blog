const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    openid: '',
    articleList: [],
    class_id: '',
    name: '',
    filter: {},
    userInfo: {},
    dbName: '',
    isShowNoData: false,
    orderBy: '',
    loading: false, // 正在加载
    loadingHasData: true, //是否还有有数据
    size: 10,
    page: 1,
    dataList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var userInfo = wx.getStorageSync("userInfo");
    var openid = wx.getStorageSync("openid");

    this.fetchSearchList(true);
  },
  /**
   * 分页函数
   */
  fetchSearchList: function(isShowLoading) {
    if (isShowLoading) {
      wx.showLoading({
        title: '正在请求数据...',
      });
    }
    let that = this;
    this.initArticleList(function(data) {
      if (isShowLoading) {
        wx.hideLoading()
      }
      //判断是否有数据，有则取数据  
      if (data.length != 0) {
        let dataList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        dataList = that.data.dataList.length <= 0 ? data : that.data.dataList.concat(data)
        that.setData({
          dataList: dataList, //获取数据数组  
          loadingHasData: true,
          loading: false,
          page: (that.data.page + 1)
        });
        wx.setNavigationBarTitle({
          title: '用户列表(' + dataList.length+")",
        })
      } else {
        that.setData({
          loading: false,
          loadingHasData: false
        });
      }

      if (that.data.dataList.length == 0) {
        that.setData({
          isShowNoData: true,
        });
      } else {
        that.setData({
          isShowNoData: false,
        });
      }
    })
  },
  initArticleList(callback) {
    var _this = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'user',
        pageIndex: _this.data.page,
        pageSize: _this.data.size,
        // filter: _this.data.filter,
        orderBy: 'lastLoginTime',
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log("用户列表=====" + JSON.stringify(res.result.data))
        callback(res.result.data);
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {

      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh() //停止下拉刷新
    this.setData({
      loading: false, // 正在加载
      loadingHasData: true, //是否还有有数据
      page: 1,
      dataList: [],
    });
    this.fetchSearchList(true);
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
    this.fetchSearchList(false);
  },
})