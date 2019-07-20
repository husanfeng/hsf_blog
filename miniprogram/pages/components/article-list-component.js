// components/component-tag-name.js
const app = getApp()
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    articleList: [],
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {
    this.initArticleList();
  },
 
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
    hide: function() {},
    resize: function() {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initArticleList() {
      var _this = this;
      wx.showLoading({
        title: '正在加载...',
      })
      db.collection('article').get({
        success: function (res) {
          // res.data 包含该记录的数据
          console.log(res.data)
          _this.setData({
            articleList: res.data
          })
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) {
          wx.hideLoading()
        }
      })
    },
  }
})