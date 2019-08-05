//app.js
//引入Towxml
const Towxml = require('/towxml/main');
App({
  //创建一个towxml对象，供其它页面调用
  towxml: new Towxml(),
  //声明Markdown文件目录路径
  docDir: 'https://www.vvadd.com/wxml_demo/',
  onLaunch: function() {
    // var env = 'cfxy-mall-pxwnv';
    var env = 'hsf-blog-product-jqt54'
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.clearStorage()
      wx.cloud.init({
        traceUser: true,
        env: 'hsf-blog-product-jqt54'
      })
    }

    this.globalData = {}
    // this.env ='cfxy-mall-pxwnv' // 测试环境
    this.env = 'hsf-blog-product-jqt54' //生产环境

  },
  //声明一个数据请求方法
  getText: (url, callback) => {
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (typeof callback === 'function') {
          callback(res);
        };
      }
    });
  }
})