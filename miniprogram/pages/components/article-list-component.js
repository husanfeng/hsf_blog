// components/component-tag-name.js
const app = getApp()
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    articleList: {
      type: Object,
      value: []
    },
  },
  /**
   * 组件的初始数据
   */
  data: {},
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {

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
      var id = e.currentTarget.dataset.id; // 文章的唯一标识
      var className = e.currentTarget.dataset.className;  // 文章的分类名称
      var readCount = e.currentTarget.dataset.readCount
      wx.navigateTo({
        url: '../articleDetail/articleDetail?id=' + id + '&className=' + className + '&readCount=' + readCount,
      })
    },
  },

})