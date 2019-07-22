// pages/articleDetail/articleDetail.js
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    className: '',
    readCount: '',

    classImgUrl: '', // 分类图片
    createTime: '', // 创建时间
    pollCount: '', // 点赞数
    commentCount: '', // 评论
    title:'',
    contentList: [{
      title: '标题',
      img: 'https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/product_image/cs.jpg?sign=a106633b516bfeb67d964bd2246aff14&t=1563786220',
      content: '1234'
    }, {
      title: '标题',
        img: 'https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/product_image/cs.jpg?sign=a106633b516bfeb67d964bd2246aff14&t=1563786220',
      content: '56789'
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var articleDetail = app.globalData.articleDetail;
    var id = articleDetail.id;
    var className = articleDetail.class_name;
    var readCount = parseInt(articleDetail.read_count); // 浏览量
    var classImgUrl = articleDetail.class_img_url // 分类图片
    var createTime = articleDetail.create_time // 创建时间
    var pollCount = articleDetail.poll_count // 点赞数
    var commentCount = articleDetail.comment_count
    var title = articleDetail.title
    this.setData({
      id: id,
      className: className,
      readCount: readCount,
      pollCount: pollCount,
      classImgUrl: classImgUrl,
      createTime: createTime,
      commentCount: commentCount,
      title:title
    })
    this.recordBrowsingVolume(); //记录访问次数
    this.updateRecordBrowsingVolume(); // 更新浏览次数
  },
  /**
   * 查询记录访问次数
   */
  recordBrowsingVolume() {
    var _this = this;
    db.collection('browsing_volume').where({
        article_id: _this.data.id,
        openid: app.globalData.openid
      })
      .get({
        success: function(res) {
          // 如果返回数据为空，说明之前没有保存过记录，需要调用保存接口
          if (res.data.length == 0) {
            _this.addUserVisitActicle() // 保存记录接口
          }
        },
        fail: function(res) {
          console.log(res)
        },
        complete: function(res) {

        }
      })
  },
  /**
   * 保存记录访问次数
   */
  addUserVisitActicle() {
    var _this = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'addUserVisitActicle',
      data: {
        id: _this.data.id,
        openid: app.globalData.openid
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log("新增用户访问文章列表记录---")
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {}
    })

  },
  /**
   * 更新浏览次数
   */
  updateRecordBrowsingVolume() {
    var _this = this;
    var readCounts = _this.data.readCount;
    var a = readCounts + 1
    // 调用云函数
    wx.cloud.callFunction({
      name: 'updateArticleListVisit',
      data: {
        id: _this.data.id,
        readCount: a,
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log("更新文章列表访问记录---")
      },
      fail: err => {
        console.error('[云函数]调用失败', err)
      },
      complete: res => {}
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})