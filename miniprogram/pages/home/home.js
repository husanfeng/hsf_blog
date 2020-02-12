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
  onLoad: function (option) {
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

    this.initSwiper();
    this.initClassfication();
    this.fetchSearchList(true);
    var openid = wx.getStorageSync("openid");
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync("userInfo", res.userInfo)
              if (openid && openid != "") {
                this.initData(res.userInfo);
              } else {
                this.getUserOpenId(() => {
                  this.initData(res.userInfo);
                })
              }
            }
          })
        } else {
          if (openid === "") {
            this.getUserOpenId(() => {})
          }
        }
      }
    })
  },
  initData(userInfo) {
    var openid = wx.getStorageSync("openid")
    this.queryUser(openid, (isLoad) => {
      if (isLoad) {
        // this.saveUser(userInfo);
      } else {
        this.updateUser();
      }
    })
  },
  queryUser(openid, callback) {
    var _this = this;
    db.collection('user').where({
      _id: openid
    }).get({
      success: function (res) {
        if (res.data.length > 0) {
          callback(false);
        } else {
          callback(true);
        }
      },
      fail: function (res) {},
      complete: function (res) {}
    })
  },
  updateUser() {
    // 调用云函数
    var openid = this.data.openid;
    var lastLoginTime = util.formatTime(new Date());
    wx.cloud.callFunction({
      name: 'updateUsers',
      data: {
        _id: openid,
        lastLoginTime: lastLoginTime
      },
      success: res => {
        console.log("更新用户访问记录----=" + res)
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        console.log("=" + res)
      }
    })
  },
  getUserOpenId(callback) {
    var _this = this;
    // wx.showLoading({
    //   title: '正在加载...',
    // })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getUserOpenId',
      data: {},
      success: res => {
        console.log("用户的openID=" + res.result.openid)
        wx.setStorageSync("openid", res.result.openid)
        this.setData({
          openid: res.result.openid
        })
        callback();
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        // wx.hideLoading()
      }
    })
  },
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log(res)
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
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        _this.setData({
          classficationList: res.data
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
  initSwiper() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    db.collection('top_images').orderBy("_id", 'asc').get({
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
  },
  /**
   * 点击轮播图事件
   */
  click_swiper_img(e) {
    var article_id = e.currentTarget.dataset.id
    if (article_id && article_id != '') {
      wx.navigateTo({
        url: '../articleDetail/articleDetail?article_id=' + article_id,
      })
    }

  },
  click(e) {
    var id = e.currentTarget.dataset.id;
    if (id == 11) {
      wx.navigateTo({
        url: '../avatar/avatar',
      })
      return false;
    }
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../articleList/articleList?id=' + id + '&name=' + name,
    })
  },
  onShow() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh() //停止下拉刷新
    this.setData({
      loading: false, // 正在加载
      loadingHasData: true, //是否还有有数据
      page: 1,
      dataList: [],
    });
    this.initSwiper();
    this.initClassfication();
    this.fetchSearchList(true);
  },
  /**
   * 分页函数
   */
  fetchSearchList: function (isShowLoading) {
    if (isShowLoading) {
      wx.showLoading({
        title: '正在请求数据...',
      });
    }
    let that = this;
    this.initArticleList(function (data) {
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
  onReachBottom: function () {
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