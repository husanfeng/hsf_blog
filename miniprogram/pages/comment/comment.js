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
  onLoad: function(options) {
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
    this.replySubscribeMessage('replyComment',commentType)
  },
  replyCommentContent(commentType){
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
            complete: function() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 500);
            }
          })
          var openId = _this.data.otherUserInfo.openId ? _this.data.otherUserInfo.openId : _this.data.otherUserInfo._openid;
          _this.sendReplyCommentMessage(_this.data.articleDetail.title, _this.data.otherUserInfo.comment, _this.data.inputData, _this.data.articleDetail.article_id,
            create_date, openId);
          if ('oJX0Y47QUSPd3lkaGgJYWFqfn944' != openId) { // 管理员也能收到回复通知
            // _this.sendAddCommentMessage(_this.data.userInfo.nickName, _this.data.inputData, _this.data.articleDetail.article_id, create_date);
            _this.sendReplyCommentMessage(_this.data.articleDetail.title, _this.data.otherUserInfo.comment, _this.data.inputData, _this.data.articleDetail.article_id,
              create_date, 'oJX0Y47QUSPd3lkaGgJYWFqfn944');
          }
        } else {
          wx.showToast({
            title: '回复评论失败,内容包含敏感信息!',
            icon: 'none',
            duration: 2000,
            complete: function() {
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
    this.replySubscribeMessage('addComment')
  },
  addCommentContent(){
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
            complete: function() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 500);
            }
          })
          // 向指定的用户发送消息，前提是该用户已经订阅了
          _this.sendAddCommentMessage(_this.data.userInfo.nickName, _this.data.inputData, _this.data.articleDetail.article_id, create_date);
        } else {
          wx.showToast({
            title: '评论失败,内容包含敏感信息!',
            icon: 'none',
            duration: 2000,
            complete: function() {
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
   * 订阅回复评论
   */
  replySubscribeMessage(flag,commentType) {
    var that = this;
    wx.requestSubscribeMessage({
      // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
      tmplIds: [commentReplyId],
      success(res) {
        console.log(res)
        // 申请订阅成功
        if (res["u2qcHMJAuxBvD0P3zyR0j-cojervsdquT1ZYWv-3N2M"] == "accept") {
          wx.showToast({
            title: '订阅成功，如果有人评论了你，你将收到消息通知哦',
            icon: 'none',
            duration: 1500,
            complete: function() {
              setTimeout(() => {
                if(flag === 'addComment'){ // 新增评论
                  that.addCommentContent()
                }else{ // 回复评论
                  that.replyCommentContent(commentType)
                }
              }, 1500);
            }
          })
        } else {
          wx.showToast({
            title: '订阅失败，如果有人评论了你，你将不会收到消息通知哦',
            icon: 'none',
            duration: 1500,
            complete: function() {
              setTimeout(() => {
                if(flag === 'addComment'){ // 新增评论
                  that.addCommentContent()
                }else{ // 回复评论
                  that.replyCommentContent(commentType)
                }
              }, 1500);
            }
          })
        }
      },
      fail(err) {
        console.log("err=" + err)
      }
    });
  },
  /**
   * 发送评论回复通知
   * @param {*} nickName 
   * @param {*} inputData 
   * @param {*} article_id 
   * @param {*} create_date 
   */
  sendReplyCommentMessage(title, comment, inputData, article_id, create_date, _openid) {
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
        page: "pages/articleDetail/articleDetail?article_id=" + article_id,
        data: data,
        openid: _openid,
        templateId: commentReplyId,
      },
      success: function(res) {
        console.log("评论回复消息发送成功----")
      },
      fail: err => {
        console.log("评论回复消息发送失败----")
      },
      complete: res => {}
    })
  },
  isChinese(temp) {
    var re = /[^\u4e00-\u9fa5]/;
    if (re.test(temp)) return false;
    return true;
  },
  /**
   * 新增评论通知
   * @param {} nickName 
   * @param {*} inputData 
   * @param {*} article_id 
   * @param {*} create_date 
   */
  sendAddCommentMessage(nickName, inputData, article_id, create_date) {
    var flag = this.isChinese(nickName);
    var nick = '';
    if (flag){
      nick = nickName
    }else{
      nick = '虚拟名字'
    }
    var data = {
      name3: {
        value: nick // 这里本来是取留言者的nickName,但是如果nickName中包含特殊字符的话就会报错（例如：★那一抹笑^穿透阳光★），所以无奈之下只能取一个虚拟名字
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
        page: "pages/articleDetail/articleDetail?article_id=" + article_id,
        data: data,
        openId: 'oJX0Y47QUSPd3lkaGgJYWFqfn944',
        templateId: lessonTmplId,
      },
      success: function(res) {
        console.log("留言消息订阅发送成功----")
      },
      fail: err => {
        console.log("留言消息订阅发送失败----")
      },
      complete: res => {}
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