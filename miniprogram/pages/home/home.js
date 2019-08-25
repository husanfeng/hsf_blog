//index.js
const util = require("../../utils/util.js")
const app = getApp()
const db = wx.cloud.database({
  env: app.env
})
Page({
  data: {
    navigateToParam: "",
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
    page: 1,
    dataList: [],
  },
  onLoad: function(option) {
    console.log([]===![])
    // wx.showToast({
    //   title: decodeURIComponent(option.scene),
    //   icon: 'success',
    //   image: '',
    //   duration: 5000,
    //   mask: true,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    if (option.scene) {
      var blogId = decodeURIComponent(option.scene);
      this.setData({
        navigateToParam: blogId
      })
    }
    if (option.article_id) {
      this.setData({
        navigateToParam: option.article_id
      })
    }
    this.getUserOpenId()
    this.initSwiper();
    this.initClassfication();
    this.fetchSearchList(true);




    // var date = new Date('2019-07-27 08:25:40');
    // // 有三种方式获取
    // var time1 = date.getTime();
    // var time2 = date.valueOf();
    // var time3 = Date.parse(date);
    // time3 = time3 / 1000;
    // console.log(time1);//1398250549123
    // console.log(time2);//1398250549123
    // console.log(time3);//1398250549000
    // var timedes = util.getDiffTime(time3);
    // console.log("时间=" + timedes);
  },
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
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

  initArticleList(callback) {
    var _this = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'article',
        pageIndex: _this.data.page,
        pageSize: _this.data.size,
        orderBy: 'create_time'
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
    db.collection('top_images').orderBy("_id", 'asc').get({
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
  onShow() {},
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
      } else {
        that.setData({
          loading: false,
          loadingHasData: false
        });
      }
    })
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
    this.fetchSearchList();
  },
})