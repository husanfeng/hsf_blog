
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showText: {
      type: String,//类型
      value: ''//默认值
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
    confirm(e) {
      this.triggerEvent('confirm', { userInfo: e.detail.userInfo})
    }
 
  }
})