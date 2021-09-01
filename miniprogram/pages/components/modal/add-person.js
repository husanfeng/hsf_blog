Component({
  /**
   * 组件的属性列表
   * leftButtonText
   * rightButtonText
   */
  properties: {
    showText: {
      type: String,//类型
      value: ''//默认值
    },
     leftButtonText: {
      type: String,//类型
      value: '暂不登录'//默认值
    },
     rightButtonText: {
      type: String,//类型
      value: '登录'//默认值
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    
    cancel() {
      this.triggerEvent('cancel')
    },
    confirm() {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.triggerEvent('confirm', { userInfo: res.userInfo})
          wx.setStorageSync("userInfo", res.userInfo)
        }
      })    
    }
  }
})