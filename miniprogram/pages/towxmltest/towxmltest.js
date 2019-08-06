//index.js

//获取应用实例
const app = getApp();

Page({
  data: {
    isloading: true,
    article: {},
    timer: undefined
  },
  onLoad: function() {
    this.load();
  },
  load() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleDetail',
      data: {
        dbName: 'content',
        pageIndex: 1,
        pageSize: 10,
        orderBy: 'article_id'
      },
      success: res => {
        console.log(res)
        // var data = res.result.data[0].main_content
        // res.result.data[0].main_content.map((item) => {
        //   data += item
        // })
        // let articleData = app.towxml.toJson(res.result, 'markdown');
        // articleData = app.towxml.initData(articleData, {
        //   base: 'https://www.vvadd.com/',
        //   app: _this
        // });

        _this.setData({
          article: res.result,
          isloading: false
        });
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }
})