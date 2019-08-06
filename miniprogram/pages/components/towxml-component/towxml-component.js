// pages/components/towxml-component/towxml-component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    article: {},
  },
  ready() {
    this.load();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    load() {
      var _this = this;
      var articleDetail = wx.getStorageSync("articleDetail");
      wx.showLoading({
        title: '正在加载...',
      })
      // 调用云函数
      wx.cloud.callFunction({
        name: 'getArticleDetail',
        data: {
          dbName: 'content',
          id: articleDetail._id
        },
        success: res => {
          console.log(res)
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
  }
})