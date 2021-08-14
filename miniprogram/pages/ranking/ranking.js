// pages/ranking/ranking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false, // 正在加载
    loadingHasData: true, //是否还有有数据
    size: 10,
    page: 1,
    dataList: [],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, // tab切换
    topTapHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  this.initArticleList("read_count")
    that.fetchSearchList("read_count", true);

  },
  initArticleList(type, callback) {
    var _this = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'article',
        pageIndex: _this.data.page,
        pageSize: _this.data.size,
        orderBy: type
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log(res.result)
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
   * 分页函数
   */
  fetchSearchList: function (type, isShowLoading) {
    if (isShowLoading) {
      wx.showLoading({
        title: '正在请求数据...',
      });
    }
    let that = this;
    this.initArticleList(type, function (data) {
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
      } else {
        that.setData({
          loading: false,
          loadingHasData: false
        });
      }
    })
  },

  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    // 0 ,1 , 2, 3
    var that = this;
    var tapId = e.target.dataset.current;
    if (this.data.currentTab === tapId) {
      return false;
    } else {
      this.setData({
        currentTab: tapId,
        page: 0,
        dataList: [],
      });
    }
  },
  /**
   * 滑动切换tab
   */
  swiperChange(e) {
    var that = this;
    var tapId = e.detail.current;
    if (this.data.currentTab === tapId) {
      return false;
    } else {
      that.setData({
        currentTab: tapId,
        page: 1,
        dataList: [],
      });
      if (tapId == 0) {
        that.fetchSearchList("read_count", true);
      } else if (tapId == 1) {
        that.fetchSearchList("comment_count", true);
      } else if (tapId == 2) {
        that.fetchSearchList("poll_count", true);
      } else if (tapId == 3) {
        that.fetchSearchList("create_time", true);
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  searchScrollLower: function () {
    var that = this;
    if (that.data.loading)
      return;
    if (!that.data.loadingHasData)
      return;
    that.setData({
      loading: true,
      loadingHasData: true,
    });
    var tapId = that.data.currentTab;
    if (tapId == 0) {
      that.fetchSearchList("read_count", false);
    } else if (tapId == 1) {
      that.fetchSearchList("comment_count", false);
    } else if (tapId == 2) {
      that.fetchSearchList("poll_count", false);
    } else if (tapId == 3) {
      that.fetchSearchList("create_time", false);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    const query = wx.createSelectorQuery().in(this);
    query.select('.swiper-tab').boundingClientRect(function (res) {
      that.setData({
        topTapHeight: res.height,
      });
    })
    query.exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})