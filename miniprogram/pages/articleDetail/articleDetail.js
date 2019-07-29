// pages/articleDetail/articleDetail.js
const util = require("../../utils/util.js")
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPollDone: false,
    isShowAddPersonView: false,
    pollId: '',
    pollList: [],
    showText: '发表评论需要先登录哦',
    articleDetail: {},
    userInfo: {},
    openid: '',
    isLoadingAddPoll: true,
    commentList: [],
    contentList: [{
        title: '语义类标签是什么，使用它有什么好处',
        img: 'https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/product_image/cs.jpg?sign=a106633b516bfeb67d964bd2246aff14&t=1563786220',
        content: '对于前端开发来说，我们平时与浏览器打交道的时间是最多的。可浏览器对前端同学来说更多像一个神秘黑盒子的存在。我们仅仅知道它能做什么，而不知道它是如何做到的'
      },
      {
        title: '',
        img: '',
        content: '在我面试和接触过的前端开发者中，70% 的前端同学对这部分的知识内容只能达到“一知半解”的程度。甚至还有一部分同学会质疑这部分知识是否重要：这与我们的工作相关吗，学多了会不会偏移前端工作的方向？'
      },
      {
        title: '',
        img: '',
        content: '事实上，我们这里所需要了解的浏览器工作原理只是它的大致过程，这部分浏览器工作原理不但是前端面试的常考知识点，它还会辅助你的实际工作，学习浏览器的内部工作原理和个中缘由，对于我们做性能优化、排查错误都有很大的好处'
      },
      {
        title: '',
        img: '',
        content: '在我们的课程中，我也会控制浏览器相关知识的粒度，把它保持在“给前端工程师了解浏览器”的水准，而不是详细到“给浏览器开发工程师实现浏览器”的水准。'
      },
      {
        title: '',
        img: '',
        content: '那么，我们今天开始，来共同思考一下。一个浏览器到底是如何工作的。'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo
              })
              wx.setStorageSync("userInfo", res.userInfo)
              // app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
    var articleDetail = wx.getStorageSync("articleDetail");
    var openid = wx.getStorageSync("openid")
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      articleDetail: articleDetail,
      userInfo: userInfo,
      openid: openid
    })
    this.recordBrowsingVolume(); //记录访问次数
    this.updateRecordBrowsingVolume(); // 更新浏览次数
    this.getIsPoll() // 是否点赞
    this.getPollList() // 获取点赞列表
  },
  shareArticle(e) {
    console.log(e);
  },
  getPollList() {
    var _this = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'poll',
        pageIndex: 1,
        pageSize: 200,
        filter: {
          article_id: _this.data.articleDetail._id
        },
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log("点赞列表：" + res.result.data)
        _this.setData({
          pollList: res.result.data
        })
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {

      }
    })
  },
  getIsPoll() {
    var _this = this;
    _this.setData({ //
      filter: {
        _openid: _this.data.openid,
        article_id: _this.data.articleDetail._id
      }
    })
    // wx.showLoading({
    //   title: '正在加载...',
    // })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'poll',
        pageIndex: 1,
        pageSize: 200,
        filter: _this.data.filter,
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log("是否点赞===>" + res.result.data)

        if (res.result.data.length > 0) {
          var pollId = res.result.data[0]._id;
          _this.setData({
            isPollDone: true,
            pollId: pollId
          })
        } else {
          _this.setData({
            isPollDone: false
          })
        }

      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        // wx.hideLoading()
      }
    })
  },
  clickPoll() {
    var _this = this;
    if (_this.data.userInfo.nickName == null || _this.data.userInfo.nickName == undefined) {
      this.setData({
        showText: '点赞需要先登录哦',
        isShowAddPersonView: true
      });
      return;
    }
    if (_this.data.isLoadingAddPoll) {
      _this.setData({
        isLoadingAddPoll: false
      })
    } else {
      return;
    }
    var openid = wx.getStorageSync("openid")
    wx.showLoading({
      title: '正在加载...',
    })
    var create_date = util.formatTime(new Date());
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var ispoll = _this.data.isPollDone;
    if (ispoll) {
      db.collection('poll').doc(_this.data.pollId).remove({
        success: function(res) {
          _this.setData({
            isPollDone: false
          })
          console.log("取消点赞--")
          _this.getPollList();
        },
        fail: err => {
          console.error(err)

        },
        complete: res => {
          _this.setData({
            isLoadingAddPoll: true
          })
          wx.hideLoading()
        }
      })
    } else {
      var event = _this.data.articleDetail
      wx.cloud.callFunction({
        name: 'addPoll',
        data: {
          _id: event._id,
          _openid: openid,
          avatarUrl: _this.data.userInfo.avatarUrl,
          nickName: _this.data.userInfo.nickName,
          article_id: _this.data.articleDetail._id,
         
          class_img_url: event.class_img_url,
          title: event.title,
          create_time: event.create_time,
          update_time: event.update_time,
          summary: event.summary,
          poll_count: event.poll_count,
          comment_count: event.comment_count,
          read_count: event.read_count,
          class_id: event.class_id,
          class_name: event.class_name,
          image_url: event.image_url,

        },
        success: res => {
          // res.data 包含该记录的数据
          _this.setData({
            isPollDone: true,
            pollId: res.result._id
          })
          console.log("新增点赞成功---")
          _this.getPollList();
        },
        fail: err => {
          console.error('[云函数]调用失败', err)
        },
        complete: res => {
          _this.setData({
            isLoadingAddPoll: true
          })
          wx.hideLoading()
        }
      })
    }
  },
  /**
   * 查询记录访问次数
   */
  recordBrowsingVolume() {
    var _this = this;
    var openid = wx.getStorageSync("openid")
    db.collection('browsing_volume').where({
        _id: _this.data.articleDetail._id,
        openid: openid
      })
      .get({
        success: function(res) {
          // 如果返回数据为空，说明之前没有保存过记录，需要调用保存接口
          if (res.data.length == 0) {
            _this.addUserVisitActicle() // 保存记录接口
          }
        },
        fail: function(res) {
          console.log(res)
        },
        complete: function(res) {

        }
      })
  },
  /**
   * 保存记录访问次数
   */
  addUserVisitActicle() {
    var _this = this;
    var openid = wx.getStorageSync("openid")
    var articleDetail = _this.data.articleDetail
    articleDetail.openid = openid
    // 调用云函数
    wx.cloud.callFunction({
      name: 'addUserVisitActicle',
      data: articleDetail,
      success: res => {
        // res.data 包含该记录的数据
        console.log("新增用户访问文章列表记录---")
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {}
    })

  },
  /**
   * 更新浏览次数
   */
  updateRecordBrowsingVolume() {
    var _this = this;
    var readCounts = _this.data.articleDetail.read_count;
    var a = readCounts + 1
    // 调用云函数
    wx.cloud.callFunction({
      name: 'updateArticleListVisit',
      data: {
        _id: _this.data.articleDetail._id,
        readCount: a,
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log("更新文章列表访问记录---")
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {}
    })
  },
  /**
   * 查询评论列表
   */
  queryComment() {
    var _this = this;
    // wx.showLoading({
    //   title: '正在加载...',
    // })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'comment',
        pageIndex: 1,
        pageSize: 100,
        filter: {
          article_id: _this.data.articleDetail._id
        },
      },
      success: res => {
        // res.data 包含该记录的数据

        var commentList = res.result.data;
        commentList.map((item) => {
          //var date = new Date(item.create_date);
          item.create_date = util.getDiffTime(item.timestamp);
          item.childComment.map((childItem) => {
            // var childDate = new Date(childItem.createDate);
            childItem.createDate = util.getDiffTime(childItem.timestamp);
          })
        })
        _this.setData({
          commentList: commentList
        })
        console.log(commentList)
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        // wx.hideLoading()
      }
    })
  },
  clickComment() {
    if (this.data.userInfo.nickName == null || this.data.userInfo.nickName == undefined) {
      this.setData({
        showText: '发表评论需要先登录哦',
        isShowAddPersonView: true
      });
      return;
    }
    this.toCommentPage(3)
  },

  toCommentPage(type) {
    wx.navigateTo({
      url: '../comment/comment?type=' + type,
    })
  },
  
  clickFatherConter(e) {
    if (this.data.userInfo.nickName == null || this.data.userInfo.nickName == undefined) {
      this.setData({
        showText: '发表评论需要先登录哦',
        isShowAddPersonView: true
      });
      return;
    }
    var item = e.currentTarget.dataset.item
    wx.setStorageSync("otherInfo", item)
    // app.globalData.otherInfo = item
    this.toCommentPage(1)
  },
  clickChildrenConter(e) {
    if (this.data.userInfo.nickName == null || this.data.userInfo.nickName == undefined) {
      this.setData({
        showText: '发表评论需要先登录哦',
        isShowAddPersonView: true
      })
      return
    }
    var item = e.currentTarget.dataset.item;
    var _id = e.currentTarget.dataset.id;
    item._id = _id;
    wx.setStorageSync("otherInfo", item)
    // app.globalData.otherInfo = item;
    this.toCommentPage(2)
  },
  confirm(e) {
    // console.log(e.detail.userInfo)
    this.setData({
      isShowAddPersonView: false,
      userInfo: e.detail.userInfo
    })
    wx.setStorageSync("userInfo", e.detail.userInfo)
    //app.globalData.userInfo = e.detail.userInfo
  },
  cancel(e) {
    //console.log(e)
    this.setData({
      isShowAddPersonView: false
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
    this.queryComment(); // 查询评论列表
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