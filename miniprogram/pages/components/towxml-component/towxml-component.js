// pages/components/towxml-component/towxml-component.js
Component({
  /**
   * 组件的属性列表 
   */
  properties: {
    article_id: {
      type: String,
      value: ''
    },
    isLoad: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    article: {},
    imgList:[],
  },
  ready() {
    if (this.properties.isLoad) {
      this.load();
    }

  },
  /**
   * 组件的方法列表
   */
  methods: {
    load() {
      var _this = this;
      var article_id = _this.properties.article_id
      wx.showLoading({
        title: '正在加载...',
      })
      // 调用云函数
      wx.cloud.callFunction({
        name: 'getArticleDetail',
        data: {
          dbName: 'content',
          id: article_id
        },
        success: res => {
          console.log(res)
          _this.setData({
            article: res.result,
            isloading: false
          });
          res.result.child.map((item)=>{
            var childList  =  item.child || []
            childList.map((child)=>{
              if(child.tag == "image"){
                this.data.imgList.push(child.attr.src);
              }
            })
          })
        },
        fail: err => {
          console.error('[云函数]调用失败', err)
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    },
    /**
     * towxml点击事件
     * @param {} e 
     */

    __bind_tap: function(e) {
      try {
        if (e.target.dataset._el.attr.src != undefined) {
          wx.previewImage({
            current: e.target.dataset._el.attr.src,   
            urls: this.data.imgList,
          });
        }
      } catch (e) {
        console.info(e)
      }
    },
  }
})