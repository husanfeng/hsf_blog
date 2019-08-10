// 云函数入口文件
const cloud = require('wx-server-sdk')
// var env = 'hsf-blog-product-jqt54';  // 正式环境
var env = 'cfxy-mall-pxwnv'; // 测试环境
cloud.init({
  env: env
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    let res = await db.collection('comment').doc(event._id).update({
      data: {
        childComment: _.push({
          avatarUrl: event.avatarUrl,
          nickName: event.nickName,
          openId: event.openId,
          comment: event.comment,
          createDate: event.createDate,
          flag: event.flag,
          opposite_avatarUrl: event.opposite_avatarUrl,
          opposite_nickName: event.opposite_nickName,
          opposite_openId: event.opposite_openId,
          timestamp: event.timestamp,
        })
      }
    }).then(res => {
      return res;
    })
    await db.collection('article').doc(event.id).update({
      data: {
        comment_count: _.inc(1)
      }
    })
    return res;
  } catch (e) {
    console.error(e)
  }
}