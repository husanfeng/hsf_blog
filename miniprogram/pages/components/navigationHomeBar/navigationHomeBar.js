// pages/components/navigationHomeBar/navigationHomeBar.js
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
    menuButtonBoundingClientRect:{},
    systemInfo:{},
    opacity:0
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      var that = this
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            systemInfo: res,
            menuButtonBoundingClientRect: wx.getMenuButtonBoundingClientRect()
          })
          console.log(that.data.systemInfo)
        },
      })
    },
    hide: function () { },
    resize: function () { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setOpacity:function(scrollTop,maxTop){
      var opacity = 0
      if(scrollTop<=maxTop){
        opacity = scrollTop/maxTop
      }else{
        opacity = 1
      }
      this.setData({
        opacity:opacity
      })
    },
    back2home:function() {
      wx.navigateBack({
        delta: 1,
      })
    },
  }
})