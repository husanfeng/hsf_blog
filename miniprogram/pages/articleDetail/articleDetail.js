// pages/articleDetail/articleDetail.js
const util = require("../../utils/util.js")
// import Poster from '../../utils/poster';
import Poster from 'wxa-plugin-canvas/poster/poster.js';
const app = getApp()
const db = wx.cloud.database({
  env: app.env
})
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isShowPosterModal: "",
    posterImageUrl: "",
    leftButtonText: '返回首页',
    rightButtonText: "登录",
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
    isLoad: false,
    article_id: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var article_id = options.article_id ? options.article_id : ""
    var openid = wx.getStorageSync("openid")
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      article_id: article_id,
      userInfo: userInfo,
      openid: openid
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo,
                isLoad: true
              })
              wx.setStorageSync("userInfo", res.userInfo)
              if (this.data.openid && this.data.openid != "") {
                this.initData(res.userInfo);
              } else {
                this.getUserOpenId(() => {
                  this.initData(res.userInfo);
                })
              }
            }
          })
        } else {
          this.setData({
            isLoad: false,
            showText: '登录获取更多权限',
            isShowAddPersonView: true
          });
        }
      }
    })
  },
  initData(userInfo) {
    var openid = wx.getStorageSync("openid")
    this.getPollList() // 获取点赞列表
    this.getIsPoll() // 是否点赞
    this.queryComment(); // 查询评论列表
    this.getArticleDetail(() => { // 获取文章内容
      this.recordBrowsingVolume(); // 查询记录访问次数
    });
    this.queryUser(openid, (isLoad) => {
      if (isLoad) {
        this.saveUser(userInfo);
      } else {
        this.updateUser();
      }
    })
  },
  getUserOpenId(callback) {
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
        this.setData({
          openid: res.result.openid
        })
        callback();
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
   * 新增文章二维码并返回临时url
   * @param {*} id 
   * @param {*} postId 
   * @param {*} comments 
   */
  addPostQrCode(article_id, timestamp) {
    return wx.cloud.callFunction({
      name: 'addPostQrCode',
      data: {
        timestamp: timestamp,
        article_id: article_id
      }
    })
  },
  /**
   * 获取海报的文章二维码url
   * @param {*} id 
   */
  getReportQrCodeUrl(id) {
    return wx.cloud.getTempFileURL({
      fileList: [{
        fileID: id,
        maxAge: 60 * 60, // one hour
      }]
    })
  },
  /**
   * 生成海报成功-回调
   * @param {} e 
   */
  onPosterSuccess(e) {
    const {
      detail
    } = e;
    this.setData({
      posterImageUrl: detail,
      isShowPosterModal: true
    })
    console.info(detail)
  },
  /**
   * 生成海报失败-回调
   * @param {*} err 
   */
  onPosterFail(err) {
    console.info(err)
  },
  /**
   * 生成海报
   */
  onCreatePoster: async function() {
    wx.showLoading({
      title: '生成中...',
    })
    let that = this;
    if (that.data.posterImageUrl !== "") {
      that.setData({
        isShowPosterModal: true
      })
      wx.hideLoading();
      return;
    }
    let posterConfig = {
      width: 750,
      height: 1200,
      backgroundColor: '#fff',
      debug: false
    }
    var blocks = [{
        width: 690,
        height: 808,
        x: 30,
        y: 183,
        borderWidth: 2,
        borderColor: '#f0c2a0',
        borderRadius: 20,
      },
      {
        width: 634,
        height: 74,
        x: 59,
        y: 680,
        backgroundColor: '#fff',
        opacity: 0.5,
        zIndex: 100,
      }
    ]
    var texts = [];
    texts = [{
        x: 113,
        y: 61,
        baseLine: 'middle',
        text: that.data.userInfo.nickName,
        fontSize: 32,
        color: '#8d8d8d',
        width: 570,
        lineNum: 1
      },
      {
        x: 32,
        y: 113,
        baseLine: 'top',
        text: '发现一篇很有意思的文章',
        fontSize: 38,
        color: '#080808',
      },
      {
        x: 59,
        y: 770,
        baseLine: 'middle',
        text: that.data.articleDetail.title,
        fontSize: 38,
        color: '#080808',
        marginLeft: 30,
        width: 570,
        lineNum: 2,
        lineHeight: 50
      },
      {
        x: 59,
        y: 875,
        baseLine: 'middle',
        text: that.data.articleDetail.summary,
        fontSize: 28,
        color: '#929292',
        width: 560,
        lineNum: 2,
        lineHeight: 50
      },
      {
        x: 315,
        y: 1100,
        baseLine: 'top',
        text: '长按识别小程序码,立即阅读',
        fontSize: 28,
        color: '#929292',
      }
    ];

    let imageUrl = that.data.articleDetail.image_url
    // imageUrl = imageUrl.replace('http://', 'https://')
    let qrCode = await that.getReportQrCodeUrl(that.data.articleDetail.article_id);
    let qrCodeUrl = qrCode.fileList[0].tempFileURL
    if (qrCodeUrl == "") {
      let addReult = await that.addPostQrCode(that.data.articleDetail.article_id, that.data.articleDetail.article_id)
      qrCodeUrl = addReult.result[0].tempFileURL || ""
    }
    console.info(qrCodeUrl)
    var images = [{
        width: 62,
        height: 62,
        x: 32,
        y: 30,
        borderRadius: 62,
        url: that.data.userInfo.avatarUrl, //用户头像
      },
      {
        width: 634,
        height: 475,
        x: 59,
        y: 210,
        url: imageUrl, //海报主图
      },
      {
        width: 220,
        height: 220,
        x: 70,
        y: 1000,
        url: qrCodeUrl, //二维码的图
      }
    ];

    posterConfig.blocks = blocks; //海报内图片的外框
    posterConfig.texts = texts; //海报的文字
    posterConfig.images = images;

    that.setData({
      posterConfig: posterConfig
    }, () => {
      Poster.create(true); //生成海报图片
      wx.hideLoading();
    });

  },
  /**
   * 隐藏海报弹窗
   * @param {*} e 
   */
  hideModal(e) {
    this.setData({
      isShowPosterModal: false
    })
  },
  /**
   * 保存海报图片
   */
  savePosterImage: function() {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.posterImageUrl,
      success(result) {
        console.log(result)
        wx.showModal({
          title: '提示',
          content: '二维码海报已存入手机相册，赶快分享到朋友圈吧',
          showCancel: false,
          success: function(res) {
            that.setData({
              isShowPosterModal: false,
              isShow: false
            })
          }
        })
      },
      fail: function(err) {
        console.log(err);
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("再次发起授权");
          wx.showModal({
            title: '用户未授权',
            content: '如需保存海报图片到相册，需获取授权.是否在授权管理中选中“保存到相册”?',
            showCancel: true,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: function success(res) {
                    console.log('打开设置', res.authSetting);
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取保存到相册权限成功');
                        } else {
                          console.log('获取保存到相册权限失败');
                        }
                      }
                    })
                  }
                });
              }
            }
          })
        }
      }
    });
  },
  queryUser(openid, callback) {
    var _this = this;
    db.collection('user').where({
      _id: openid
    }).get({
      success: function(res) {
        if (res.data.length > 0) {
          callback(false);
        } else {
          callback(true);
        }
      },
      fail: function(res) {
      },
      complete: function(res) {}
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
        console.log("=" + res)
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        console.log("=" + res)
      }
    })
  },
  saveUser(data) {
    // 调用云函数
    var openid = this.data.openid;
    var loginTime = util.formatTime(new Date());
    data.lastLoginTime = loginTime;
    data.loginTime = loginTime;
    data.openid = openid;
    wx.cloud.callFunction({
      name: 'saveUser',
      data: data,
      success: res => {
        // console.log("=" + res.result.openid)
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {}
    })
  },
  onShareAppMessage: function(res) {
    var _this = this
    return {
      title: '',
      path: '/pages/home/home?article_id=' + _this.data.articleDetail.article_id,
      //这里的path是当前页面的path，必须是以 / 开头的完整路径，后面拼接的参数 是分享页面需要的参数  不然分享出去的页面可能会没有内容
      //  imageUrl: "",
      //  desc: '关公面前耍大刀',
      success: (res) => {
        console.log("转发成功", res);
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          image: '',
          duration: 1000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: (res) => {
        console.log("转发失败", res);
        wx.showToast({
          title: '转发失败',
          icon: 'fail',
          image: '',
          duration: 1000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    }

  },
  getArticleDetail(callback) {
    var _this = this;
    // var id = shareId == "" ? _this.data.articleDetail.article_id : shareId
    db.collection('article').doc(_this.data.article_id)
      .get({
        success: function(res) {
          wx.setNavigationBarTitle({
            title: res.data.title
          })
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
    if (e.detail.userInfo) {
      this.setData({
        isLoad: true,
        isShowAddPersonView: false,
        userInfo: e.detail.userInfo
      })
      wx.setStorageSync("userInfo", e.detail.userInfo)
      this.getUserOpenId(() => {
        this.initData(e.detail.userInfo);
      })
    }
  },
  cancel(e) {
    //console.log(e)
    this.setData({
      isShowAddPersonView: false
    })
    wx.reLaunch({
      url: '../home/home',
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
    if (this.data.isLoad) {
      this.queryComment(); // 查询评论列表
    }
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