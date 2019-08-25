// components/component-tag-name.js
const app = getApp()
Component({
  /**
   * 组件的属性列表 
   */
  properties: {
    navigateToParam: {
      type: String,
      value: ""
    },
    articleList: {
      type: Object,
      value: []
    },
    type: {
      type: String,
      value: ''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

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
    if (this.properties.navigateToParam != "") {
      wx.navigateTo({
        url: '../articleDetail/articleDetail?article_id=' + this.properties.navigateToParam,
      })
    }
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
    click(e) {
      var item = e.currentTarget.dataset.item
      //  wx.setStorageSync("articleDetail", item)
      //  app.globalData.articleDetail = item;
      wx.navigateTo({
        url: '../articleDetail/articleDetail?article_id=' + item.article_id,
      })
    },
  },

})