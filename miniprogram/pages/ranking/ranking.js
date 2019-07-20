// pages/ranking/ranking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: "",
    addBuyersId: '',
    isShowClearIcon: false,
    loading: false, // 正在加载
    loadingHasData: true, //是否还有有数据
    tapUrl: '/wxapp/buyers/pageBuyersForAdmin',
    size: 10,
    page: 0,
    dataList: [],
    erronText: "",
    isShowAddPersonView: false,
    isShowErronText: false,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, // tab切换
    topTapHeight: '',
    topSearchHeight: '',

    articleList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.initArticleList()
    //   that.fetchSearchList("", true);
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    const query = wx.createSelectorQuery().in(this);
    query.select('.swiper-tab').boundingClientRect(function(res) {
      that.setData({
        topTapHeight: res.height,
      });
    })

    query.exec()
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
        pageSize: 5,
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
  /**
   * 点击tab切换
   */
  swichNav: function(e) {
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
        page: 0,
        dataList: [],
      });
      if (tapId == 0) {
        that.setData({
          tapUrl: '/wxapp/buyers/pageBuyersForAdmin'
        })
        //  this.fetchSearchList("", true);
      } else if (tapId == 1) {
        that.setData({
          tapUrl: '/wxapp/member/pageBuyersOrExhibitoMember'
        })
        //   this.fetchSearchList("BUYERS", true);
      } else if (tapId == 2) {
        that.setData({
          tapUrl: '/wxapp/exhibitor/pageExhibitoForAdmin'
        })
        // this.fetchSearchList();
      } else if (tapId == 3) {
        that.setData({
          tapUrl: '/wxapp/member/pageBuyersOrExhibitoMember'
        })
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  searchScrollLower: function() {
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
      that.setData({
        tapUrl: '/wxapp/buyers/pageBuyersForAdmin'
      })
      //  that.fetchSearchList();
    } else if (tapId == 1) {
      that.setData({
        tapUrl: '/wxapp/member/pageBuyersOrExhibitoMember'
      })
      //   that.fetchSearchList("BUYERS");
    } else if (tapId == 2) {
      that.setData({
        tapUrl: '/wxapp/exhibitor/pageExhibitoForAdmin'
      })
      //  that.fetchSearchList();
    } else if (tapId == 3) {
      that.setData({
        tapUrl: '/wxapp/member/pageBuyersOrExhibitoMember'
      })
      // that.fetchSearchList("EXHIBITOR");
    }
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