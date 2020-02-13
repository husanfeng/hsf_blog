// pages/comment/comment.js
const lessonTmplId = 'ei8TI54LSrC0kMMl5yQ3A-h61bjGB4iZIH56A2-dIns'; //留言评论提醒
const commentReplyId = 'u2qcHMJAuxBvD0P3zyR0j-cojervsdquT1ZYWv-3N2M' // 文章评论回复通知
const util = require('../../utils/util.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    surplus: 300,
    inputData: '',
    type: '',
    openid: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type; // 1是回复  2是评论
    var otherUserInfo = wx.getStorageSync("otherInfo")
    var userInfo = wx.getStorageSync("userInfo")
    var articleDetail = wx.getStorageSync("articleDetail")
    var openid = wx.getStorageSync("openid")
    if (type == 1 || type == 2) {
      wx.setNavigationBarTitle({
        title: "回复 " + otherUserInfo.nickName,
      })
    } else {
      wx.setNavigationBarTitle({
        title: "写留言",
      })
    }
    this.setData({
      type: type,
      otherUserInfo: otherUserInfo,
      userInfo: userInfo,
      articleDetail: articleDetail,
      openid: openid
    })
  },
  input(event) {
    var value = event.detail.value,
      len = parseInt(value.length);
    let that = this;
    this.setData({
      inputData: value,
      surplus: 300 - len
    });
  },
  submit() {
    var comment = this.data.inputData
    if (comment == '') {
      wx.showToast({
        title: '请填写评论',
        icon: 'none'
      })
    } else {
      console.log("我的评论：" + this.data.inputData)
      var type = this.data.type;
      if (type == 1) { // 1是评论别人的评论===》二级评论
        this.replyComment(1)
      } else if (type == 2) {
        this.replyComment(2) // 2是回复别人的评论===》三级评论
      } else if (type == 3) { // 3是评论文章===》一级评论
        this.addComment();
      }
    }
  },
  /**
   * 回复评论
   */
  replyComment(commentType) {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var create_date = util.formatTime(new Date());
    console.log("当前时间为：" + create_date);
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx.cloud.callFunction({
      name: 'replyComment',
      data: {
        id: _this.data.articleDetail._id,
        _id: _this.data.otherUserInfo._id,
        avatarUrl: _this.data.userInfo.avatarUrl,
        nickName: _this.data.userInfo.nickName,
        openId: _this.data.openid,
        comment: _this.data.inputData,
        createDate: create_date,
        flag: commentType,
        opposite_avatarUrl: _this.data.otherUserInfo.avatarUrl,
        opposite_nickName: _this.data.otherUserInfo.nickName,
        opposite_openId: _this.data.otherUserInfo._openid,
        timestamp: timestamp,
      },
      success: res => {
        // res.data 包含该记录的数据
        wx.hideLoading()
        if (res.result.code == "200") {
          wx.showToast({
            title: '回复评论成功',
            duration: 500,
            complete: function () {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 500);
            }
          })
          _this.sendReplyCommentMessage(_this.data.articleDetail.title,_this.data.otherUserInfo.comment,_this.data.inputData,_this.data.articleDetail.article_id,create_date,_this.data.otherUserInfo._openid);

        } else {
          wx.showToast({
            title: '回复评论失败,内容包含敏感信息!',
            icon: 'none',
            duration: 2000,
            complete: function () {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000);
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {

      }
    })
  },
  /**
   * 新增评论
   */
  addComment() {
    var _this = this;
    var openid = wx.getStorageSync("openid")
    wx.showLoading({
      title: '正在加载...',
    })
    var create_date = util.formatTime(new Date());
    console.log("当前时间为：" + create_date);
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    // 调用云函数
    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        //_id: timestamp + _this.data.otherUserInfo._id,
        id: _this.data.articleDetail._id,
        _openid: openid,
        avatarUrl: _this.data.userInfo.avatarUrl,
        nickName: _this.data.userInfo.nickName,
        comment: _this.data.inputData,
        create_date: create_date,
        flag: 0,
        article_id: _this.data.articleDetail.article_id,
        timestamp: timestamp,
        childComment: [],
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log("新增评论成功---" + JSON.stringify(res))
        wx.hideLoading()
        if (res.result.code == "200") {
          wx.showToast({
            title: '评论成功',
            duration: 500,
            complete: function () {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 500);
            }
          })
          if ('oJX0Y47QUSPd3lkaGgJYWFqfn944' == openid) { // 管理员获得此订阅消息通知
            _this.sendAddCommentMessage(_this.data.userInfo.nickName,_this.data.inputData,_this.data.articleDetail.article_id,create_date);
          }
          
        } else {
          wx.showToast({
            title: '评论失败,内容包含敏感信息!',
            icon: 'none',
            duration: 2000,
            complete: function () {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000);
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {

      }
    })

  },
  /**
   * 发送评论回复通知
   * @param {*} nickName 
   * @param {*} inputData 
   * @param {*} article_id 
   * @param {*} create_date 
   */
  sendReplyCommentMessage(title,comment,inputData,article_id,create_date,_openid) {

    // 文章标题
    // {{thing1.DATA}}
    
    // 评论内容
    // {{thing2.DATA}}
    
    // 回复内容
    // {{thing3.DATA}}
    
    // 回复时间
    // {{date4.DATA}}


    var data = {
      thing1: {
        value: title
      },
      thing2: {
        value: comment
      },
      thing3: {
        value: inputData
      },
      date4: {
        value: create_date
      }
    }
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendReplyCommentMessage',
        page: "pages/articleDetail/articleDetail?article_id="+article_id,
        data: data,
        openid:_openid,
        templateId: commentReplyId,
      },
      success: function (res) {
        console.log("评论回复消息发送成功----")
      },
      fail: err => {
        console.log("评论回复消息发送失败----")
      },
      complete: res => {
      }
    })
  },
  /**
   * 新增评论通知
   * @param {} nickName 
   * @param {*} inputData 
   * @param {*} article_id 
   * @param {*} create_date 
   */
  sendAddCommentMessage(nickName,inputData,article_id,create_date) {
    var data = {
      name3: {
        value: nickName
      },
      thing1: {
        value: inputData
      },
      date2: {
        value: create_date
      }
    }
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendAddCommentMessage',
        page: "pages/articleDetail/articleDetail?article_id="+article_id,
        data: data,
        templateId: lessonTmplId,
      },
      success: function (res) {
        console.log("留言消息订阅发送成功----")
      },
      fail: err => {
        console.log("留言消息订阅发送失败----")
      },
      complete: res => {
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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