// pages/messageSelectList/messageSelectList.js
const lessonTmplId = 'ei8TI54LSrC0kMMl5yQ3A-h61bjGB4iZIH56A2-dIns';//留言评论提醒
const util = require("../../utils/util.js")
const app = getApp()
const db = wx.cloud.database({
  env: app.env
})
// const lessonTmplId = 'u2qcHMJAuxBvD0P3zyR0j-cojervsdquT1ZYWv-3N2M'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1Checked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isSubscribe()
  },
  isSubscribe() {
    var that = this;
    db.collection('message_subscribe').where({
      tmplIds: lessonTmplId,
      openid: wx.getStorageSync("openid"),
    }).get({
      success: function (res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
        if (res.data.length > 0) {
          that.setData({
            switch1Checked: true,
          })
        }
      }
    })

  },
  /**
   * 订阅评论
   */
  switchChange_comment(event) {
    var that = this;
    // const {
    //   value
    // } = event.detail
    // console.log(value)
    // 获取课程信息
    // 调用微信 API 申请发送订阅消息
    // 评论人
    // {{name3.DATA}}

    // 评论内容
    // {{thing1.DATA}}

    // 评论时间
    // {{date2.DATA}}
    wx.requestSubscribeMessage({
      // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
      tmplIds: [lessonTmplId],
      success(res) {
        console.log(res)
        // 申请订阅成功
        if (res["ei8TI54LSrC0kMMl5yQ3A-h61bjGB4iZIH56A2-dIns"] == "accept") {
          that.saveUser();
        } else {
          that.setData({
            switch1Checked: false
          })
          wx.showToast({
            title: '订阅失败',
            icon: 'none',
            duration: 2000,
          });
          that.deleteUser()
        }
      },
      fail(err) {
        console.log("err=" + err)
      }
    });
  },
  deleteUser(){
    if (this.data.switch1Checked) {
      wx.cloud.callFunction({
        name:'',
        data:"",
        success:function(){

        },
        fail:function(){
          
        }
      })
    }
  },
  saveUser() {
    if (!this.data.switch1Checked) {
      db.collection('message_subscribe').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          //_id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          tmplIds: lessonTmplId,
          openid: wx.getStorageSync("openid"),
          date: util.formatTime(new Date()),
          done: false
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
          that.setData({
            switch1Checked: true
          })
          wx.showToast({
            title: '订阅成功',
            icon: 'success',
            duration: 2000,
          });
        },
        fail: function (err) {
          console.log(err)
          wx.showToast({
            title: '订阅失败',
            icon: 'none',
            duration: 2000,
          });
        }
      })
    }

  },
  /**
   * 订阅文章更新
   */
  switchChange_article() {
    wx.showToast({
      title: '敬请期待...',
      icon: 'none',
      duration: 2000,
    });
  },
  /**
   * 订阅回复评论
   */
  switchChange_reply() {
    wx.showToast({
      title: '敬请期待...',
      icon: 'none',
      duration: 2000,
    });
  },
  test() {
    // 评论人
    // {{name3.DATA}}

    // 评论内容
    // {{thing1.DATA}}

    // 评论时间
    // {{date2.DATA}}
    var data = {
      name3: {
        value: '张三'
      },
      thing1: {
        value: '评论内容'
      },
      date2: {
        value: '2019-12-31 15:15:18'
      }
    }
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendMessage',
        page: "pages/articleDetail/articleDetail?article_id=1",
        data: data,
        templateId: lessonTmplId,
      },
      success: function (res) {
        console.log(res)
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {}
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