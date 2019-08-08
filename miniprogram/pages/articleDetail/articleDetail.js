// pages/articleDetail/articleDetail.js
const util = require("../../utils/util.js")
const app = getApp()
const db = wx.cloud.database({
  env: app.env
})
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowPollAnimation: false,
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

    article_id: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var shareId = options.article_id ? options.article_id : ""
    var article_id = options.article_id ? options.article_id : ""
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
    //  var articleDetail = wx.getStorageSync("articleDetail");
    var openid = wx.getStorageSync("openid")
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      //  articleDetail: articleDetail,
      article_id: article_id,
      userInfo: userInfo,
      openid: openid
    })
    this.getPollList() // 获取点赞列表
    this.getIsPoll() // 是否点赞
    // this.initPage(() => {
    //   console.log("執行完畢----")
    // });
    this.getArticleDetail(() => {
      this.recordBrowsingVolume();
    });
  },
  // initPage: function (callback) {
  //   this.getArticleDetail(() => {
  //     this.recordBrowsingVolume(callback);
  //   });
  // },
  onShareAppMessage: function(res) {
    var _this = this
    if (res.from == 'button') {
      //按钮授权 调用share
      //设置分享参数
      // var article_id = _this.data.articleDetail.article_id;
    }
    return {
      title: '',
      path: '/pages/articleDetail/articleDetail?article_id=' + _this.data.articleDetail.article_id,
      //这里的path是当前页面的path，必须是以 / 开头的完整路径，后面拼接的参数 是分享页面需要的参数  不然分享出去的页面可能会没有内容
      //  imageUrl: "",
      //  desc: '关公面前耍大刀',
      success: (res) => {
        console.log("转发成功", res);
        console.log("成功了")
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }

  },
  getArticleDetail(callback) {
    var _this = this;
    // var id = shareId == "" ? _this.data.articleDetail.article_id : shareId
    db.collection('article').doc(_this.data.article_id)
      .get({
        success: function(res) {
          wx.setStorageSync("articleDetail", res.data) // 提交評論的時候要用到
          _this.setData({
            articleDetail: res.data
          })
          console.log("getArticleDetail 先执行完----");
          callback();
        },
        fail: function(res) {
          console.log(res)
        },
        complete: function(res) {}
      })
  },
  getPollList() {
    var _this = this;
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
        orderBy: 'read_count',
        filter: {
          article_id: _this.data.article_id
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
        // wx.hideLoading()
      }
    })
  },
  getIsPoll() {
    var _this = this;
    _this.setData({ //
      filter: {
        openid: _this.data.openid,
        article_id: _this.data.article_id
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
        orderBy: 'read_count',
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
    var poll_time = util.formatTime(new Date());
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var ispoll = _this.data.isPollDone;
    if (ispoll) {
      wx.cloud.callFunction({
        name: 'deletePoll',
        data: {
          id: _this.data.article_id,
          openid: openid,
          article_id: _this.data.article_id,
        },
        success: res => {
          _this.setData({
            isPollDone: false,
          })
          console.log("取消点赞--")
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

    } else {
      var event = _this.data.articleDetail
      wx.cloud.callFunction({
        name: 'addPoll',
        data: {
          id: _this.data.articleDetail._id,
          //  _id: timestamp,
          openid: openid,
          avatarUrl: _this.data.userInfo.avatarUrl,
          nickName: _this.data.userInfo.nickName,
          article_id: _this.data.articleDetail.article_id,

          class_img_url: event.class_img_url,
          title: event.title,
          create_time: event.create_time,
          update_time: event.update_time,
          summary: event.summary,
          // poll_count: event.poll_count,
          // comment_count: event.comment_count,
          // read_count: event.read_count,
          class_id: event.class_id,
          class_name: event.class_name,
          image_url: event.image_url,

          poll_time: poll_time
        },
        success: res => {
          // res.data 包含该记录的数据
          _this.setData({
            isPollDone: true,
            pollId: res.result._id,
            isShowPollAnimation: true
          })
          console.log("新增点赞成功---")
          _this.getPollList();
          setTimeout(() => {
            _this.setData({
              isShowPollAnimation: false
            })
          }, 2000);

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
        article_id: _this.data.article_id,
        openid: openid
      })
      .get({
        success: function(res) {
          // 如果返回数据为空，说明之前没有保存过记录，需要调用保存接口
          if (res.data.length == 0) {
            _this.addUserVisitActicle() // 保存记录接口
          } else {
            _this.updateUserVisitActicle() //更新访问时间
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
   * 更新访问时间
   */
  updateUserVisitActicle() {
    var _this = this;
    var visit_time = util.formatTime(new Date());
    // 调用云函数
    wx.cloud.callFunction({
      name: 'updateArticleListVisit',
      data: {
        dbName: 'browsing_volume',
        article_id: _this.data.articleDetail.article_id,
        visit_time: visit_time
      },
      success: res => {
        console.log("updateUserVisitActicle 后执行完----");
        console.log("更新访问时间---")
      //  callback();
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {}
    })

  },
  /**
   * 保存记录访问次数
   */
  addUserVisitActicle() {
    var _this = this;
    var visit_time = util.formatTime(new Date());
    var openid = wx.getStorageSync("openid")
    var articleDetail = _this.data.articleDetail
    articleDetail.visit_time = visit_time
    articleDetail.nickName = _this.data.userInfo.nickName
    articleDetail.openid = openid
    // 调用云函数
    wx.cloud.callFunction({
      name: 'addUserVisitActicle',
      data: articleDetail,
      success: res => {
        // res.data 包含该记录的数据
        console.log("addUserVisitActicle 后执行完----");
        console.log("新增用户访问文章列表记录---")
       // callback();
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
        orderBy: 'read_count',
        filter: {
          article_id: _this.data.article_id
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


})