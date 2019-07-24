// pages/articleDetail/articleDetail.js
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //_id: 0,
    // className: '',
    // readCount: '',
    // classImgUrl: '', // 分类图片
    // createTime: '', // 创建时间
    // pollCount: '', // 点赞数
    // commentCount: '', // 评论
    // title: '',
    articleDetail: {},
    userInfo: {},
    commentList: [],
    contentList: [{
        title: '语义类标签是什么，使用它有什么好处',
        img: 'https://6366-cfxy-mall-pxwnv-1256640731.tcb.qcloud.la/product_image/cs.jpg?sign=a106633b516bfeb67d964bd2246aff14&t=1563786220',
        content: '对于前端开发来说，我们平时与浏览器打交道的时间是最多的。可浏览器对前端同学来说更多像一个神秘黑盒子的存在。我们仅仅知道它能做什么，而不知道它是如何做到的'
      },
      {
        title: '',
        img: '',
        content: '在我面试和接触过的前端开发者中，70% 的前端同学对这部分的知识内容只能达到“一知半解”的程度。甚至还有一部分同学会质疑这部分知识是否重要：这与我们的工作相关吗，学多了会不会偏移前端工作的方向？'
      },
      {
        title: '',
        img: '',
        content: '事实上，我们这里所需要了解的浏览器工作原理只是它的大致过程，这部分浏览器工作原理不但是前端面试的常考知识点，它还会辅助你的实际工作，学习浏览器的内部工作原理和个中缘由，对于我们做性能优化、排查错误都有很大的好处'
      },
      {
        title: '',
        img: '',
        content: '在我们的课程中，我也会控制浏览器相关知识的粒度，把它保持在“给前端工程师了解浏览器”的水准，而不是详细到“给浏览器开发工程师实现浏览器”的水准。'
      },
      {
        title: '',
        img: '',
        content: '那么，我们今天开始，来共同思考一下。一个浏览器到底是如何工作的。'
      }

    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var articleDetail = app.globalData.articleDetail;
    // var _id = articleDetail._id;
    // var className = articleDetail.class_name;
    // var readCount = parseInt(articleDetail.read_count); // 浏览量
    // var classImgUrl = articleDetail.class_img_url // 分类图片
    // var createTime = articleDetail.create_time // 创建时间
    // var pollCount = articleDetail.poll_count // 点赞数
    // var commentCount = articleDetail.comment_count
    // var title = articleDetail.title
    this.setData({
      // _id: _id,
      // className: className,
      // readCount: readCount,
      // pollCount: pollCount,
      // classImgUrl: classImgUrl,
      // createTime: createTime,
      // commentCount: commentCount,
      // title: title,
      articleDetail: articleDetail,
      userInfo: getApp().globalData.userInfo ? getApp().globalData.userInfo : {}
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
        _id: _this.data.articleDetail._id,
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
    var articleDetail = _this.data.articleDetail
    articleDetail.openid = app.globalData.openid
    // 调用云函数
    wx.cloud.callFunction({
      name: 'addUserVisitActicle',
      data: articleDetail,
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
    var readCounts = _this.data.articleDetail.read_count;
    var a = readCounts + 1
    // 调用云函数
    wx.cloud.callFunction({
      name: 'updateArticleListVisit',
      data: {
        _id: _this.data.articleDetail._id,
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
   * 查询评论列表
   */
  queryComment() {
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getArticleListData',
      data: {
        dbName: 'comment',
        pageIndex: 1,
        pageSize: 10,
        // filter: {},
      },
      success: res => {
        // res.data 包含该记录的数据
        console.log(res.result.data)
        _this.setData({
          commentList: res.result.data
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
  toCommentPage() {
    wx.navigateTo({
      url: '../comment/comment',
    })
  },

  clickFatherConter() {
    this.toCommentPage()
  },
  clickChildrenConter() {
    this.toCommentPage()
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
    this.queryComment(); // 查询评论列表
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