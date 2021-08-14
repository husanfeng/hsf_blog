//app.js

App({

  onLaunch: function() {
    // var env = 'cfxy-mall-pxwnv';
    var env = 'hsf-blog-product-jqt54'
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
     // wx.clearStorage()
      wx.cloud.init({
        traceUser: true,
        env: env
      })
    }
    this.globalData = {}
    // this.env ='cfxy-mall-pxwnv' // 测试环境
    this.env = env //生产环境
  }
})