//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    imgUrls: ['https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/product_image/cs.jpg?sign=1f3f78d2e75b93939f6b82f2a5c9457f&t=1562917056',
    'https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/product_image/cs.jpg?sign=1f3f78d2e75b93939f6b82f2a5c9457f&t=1562917056',],
  },

  onLoad: function() {
   
  },
  add(){
    wx.showLoading({
      title: '正在新增...',
    })
    db.collection('top_images').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: '20190713', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        url: "https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/top_images/swiper2.png?sign=843b2e382f58761d6b75005b7eb91fc1&t=1562989978",
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      },
      fail:function(res){
        console.log(res)
      },
      complete:function(res){
        //console.log(res)
        wx.hideLoading()
      }
    })
  },
  query(){
    wx.showLoading({
      title: '正在查询...',
    })
    db.collection('top_images').doc('20190713').get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        //console.log(res)
        wx.hideLoading()
      }
    })
  },
  update(){
    wx.showLoading({
      title: '正在更新...',
    })
    db.collection('top_images').doc('20190714').update({
      data:{
        url:'https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/top_images/swiper1.jpg?sign=dfb00701eb1db066c56baab8773f9b98&t=1562993174'
      },
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        //console.log(res)
        wx.hideLoading()
      }
    })
  },
  delete() {
    wx.showLoading({
      title: '正在删除...',
    })
    db.collection('top_images').doc('20190713').remove({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        //console.log(res)
        wx.hideLoading()
      }
    })
  },
  getUserOpenId(){
    wx.showLoading({
      title: '正在加载...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }
})