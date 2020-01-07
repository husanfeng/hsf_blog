// pages/test/test.js
import comi from '../components/comi/comi'
const app = getApp()
const db = wx.cloud.database({
  env: app.env
})
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // db.collection('message_subscribe').where({
    //   id: '1'
    // }).get({
    //   success: function (res) {
    //     var da = res.data;
    //     var aa = da[0].data
    //     comi(aa, this)
    //     console.log('https://www.vvadd.com/wxml_demo/demo.txt?v=128'.data)
    //   },
    //   fail: function (res) {},
    //   complete: function (res) {}
    // })
    wx.showLoading({
      title: '请稍后...',
    })
    wx.request({
      url: 'https://6873-hsf-blog-product-jqt54-1256640731.tcb.qcloud.la/content/test.md?sign=4539c898d132011cdafcf585c40c61b9&t=1578410664',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: (res) => {
        console.log(res)
        comi(res.data, this)
        wx.hideLoading({
          complete: (res) => {},
        })
      }
    });
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