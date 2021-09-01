//index.js
const util = require("../../utils/util.js")
const app = getApp()
const db = wx.cloud.database({
  env: app.env
})
let navigationBar
Page({
  data: {
    searchTop: '',
    navigationHeight: '',
    menuButtonBoundingClientRect: {},
    systemInfo: {},
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
    scrollWidth: '',
    scrollBar: '',
    scrollTop: 0,
    opacity: 0,
    searchWord: '',
  },
  onLoad: function (option) {
    var that = this;
    // navigationBar = this.selectComponent("#navigationBar")
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
    const query = wx.createSelectorQuery().in(this);
    query.select('.classfication-scroll').boundingClientRect(function (res) {
      that.setData({
        scrollWidth: res.width,
      });
    })
    query.exec()
    this.initSwiper();
    this.initClassfication();
    this.fetchSearchList(true);

    var openid = wx.getStorageSync("openid");
    var userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      if (openid && openid != "") {
        this.initData();
      } else {
        this.getUserOpenId(() => {
          this.initData();
        })
      }
    }else{
      if (openid === "") {
        this.getUserOpenId(() => {})
      }
    }

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           wx.setStorageSync("userInfo", res.userInfo)
    //           if (openid && openid != "") {
    //             this.initData(res.userInfo);
    //           } else {
    //             this.getUserOpenId(() => {
    //               this.initData(res.userInfo);
    //             })
    //           }
    //         }
    //       })
    //     } else {
    //       if (openid === "") {
    //         this.getUserOpenId(() => {})
    //       }
    //     }
    //   }
    // })
  },
  bindSearchinput(e) {
    var word = e.detail.value;
    this.setData({
      searchWord: word
    })
  },
  submit() {
    if (this.data.searchWord != '') {
      wx.navigateTo({
        url: '../articleList/articleList?searchWord=' + this.data.searchWord+'&type=搜索',
      })
    } else {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none'
      })
    }
  },
  setOpacity: function (scrollTop, maxTop) {
    var opacity = 0
    if (scrollTop <= maxTop) {
      opacity = scrollTop / maxTop
    } else {
      opacity = 1
    }
    this.setData({
      opacity: opacity
    })
  },
  onPageScroll: function (e) {
    var scrollTop = e.scrollTop
    this.setOpacity(scrollTop, 200);
    this.setData({
      scrollTop: scrollTop
    }, () => {
      // console.log(this.data.scrollTop)
    })
  },
  initData() {
    var openid = wx.getStorageSync("openid")
    this.queryUser(openid, (isLoad) => {
      if (!isLoad) {
        this.updateUser();
      } 
    })
  },
  bindscroll(event) {
    const {
      scrollLeft,
      scrollWidth
    } = event.detail;
    if (scrollLeft < 0) { // 向右滑动时超出屏幕就return
      return
    }
    var sc = this.data.scrollWidth; // 屏幕宽度
    var canScroll = scrollWidth - sc; // 能滚动的宽度
    if (scrollLeft > canScroll) { // 向左滑动时超出屏幕就return
      return
    }
    var timer = null;
    var _this = this
    timer = setTimeout(() => {
      if(timer){
        clearTimeout(timer);
        timer = null;
      }
      var move = scrollLeft / canScroll / 2 * 100;
      _this.setData({
        scrollBar: move+ '%'
      })
    }, 400);
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
        // console.log("更新用户访问记录----=" + res)
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
        console.log('getUserOpenId===>',res.result)
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
        // console.log(res.result)
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
        // console.log(JSON.stringify(res.data))
        // _this.setData({
        //   classficationList: res.data
        // })
        var arr = [{
          item: [{
            "_id": "2",
            "id": 7,
            "name": "javaScript",
            "style": "#fef2ce",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/java-script.png?sign=bc895f0a0344a1415b9b829713bf111c&t=1563077572"
          }, {
            "_id": "3",
            "id": 2,
            "name": "vue",
            "style": "#EB7347",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/Vue.png?sign=37ba4970e938cb3419b3209d572a8013&t=1563077541"
          }]
        }, {
          item: [{
            "_id": "4",
            "id": 1,
            "name": "小程序",
            "style": "#fc9",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/%E5%B0%8F%E7%A8%8B%E5%BA%8F.png?sign=1513baa85fdce9f0f5ee0a2d496c1613&t=1563077605"
          }, {
            "_id": "5",
            "id": 4,
            "name": "浏览器",
            "style": "#00CCFF",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/%E6%B5%8F%E8%A7%88%E5%99%A8.png?sign=a315bc182fc89b7adb65a07c4da96eac&t=1565352298"
          }]
        }, {
          item: [{
            "_id": "6",
            "id": 5,
            "name": "android",
            "style": "#AEDD81",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/Android.png?sign=3411681e3b4d3eba93566a19f8c5a297&t=1563077457"
          }, {
            "_id": "7",
            "id": 3,
            "name": "react",
            "style": "#13227a",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/React.png?sign=b6466f2dbea9d0d83da78e0fa04e3b40&t=1563077529"
          }]
        }, {
          item: [{
            "_id": "8",
            "id": 8,
            "name": "css3",
            "style": "#e1d7f0",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/CSS.png?sign=4661566c2350d00d3cd1ddd66967f96a&t=1563077493"
          }, {
            "_id": "9",
            "id": 6,
            "name": "nodeJS",
            "style": "#fadbd9",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/Nodejs.png?sign=084f064382cdd700c5586a7e6ea65f30&t=1563077507"
          }]
        }, {
          item: [{
            "_id": "10",
            "id": 9,
            "name": "html5",
            "style": "#D24D57",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/html5.png?sign=65a8c526612ceb1edc217767c3e19a2f&t=1563077559"
          }, {
            "_id": "1",
            "id": 10,
            "name": "旅拍",
            "style": "#e8f4d9",
            "url": "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/classfication_images/%E6%97%85%E6%8B%8D%E7%85%A7.png?sign=3b3311d664f368e6525a7fb5e13d76b1&t=1565856664"
          }]
        }]
        _this.setData({
          classficationList: arr
        })

        // var data = res.data;
        // data.map((item, index) => {
        //   arr.concat();
        // })
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
    // if (id == 11) {
    //   wx.navigateTo({
    //     url: '../avatar/avatar',
    //   })
    //   return false;
    // }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var menuButtonInfo = wx.getMenuButtonBoundingClientRect()
        var height = 5 + res.statusBarHeight + menuButtonInfo.height + (menuButtonInfo.top - res.statusBarHeight) * 2
        if (res.platform == "devtools") {
          let androidH = res.statusBarHeight + (48 - 32) / 2
          that.setData({
            searchTop: androidH,
            navigationHeight: height,
            systemInfo: res,
          })
        } else if (res.platform == "ios") {
          let iosH = res.statusBarHeight + (44 - 32) / 2;
          that.setData({
            searchTop: iosH,
            navigationHeight: height,
            systemInfo: res,
          })
        } else if (res.platform == "android") {
          let androidH = res.statusBarHeight + (48 - 32) / 2
          that.setData({
            searchTop: androidH,
            navigationHeight: height,
            systemInfo: res,
          })
        }
        console.log(that.data.systemInfo)
        console.log(that.data.menuButtonBoundingClientRect)
      },
    })
  },
})