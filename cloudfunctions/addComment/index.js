// 云函数入口文件
const cloud = require('wx-server-sdk')
var env = 'hsf-blog-product-jqt54';  // 正式环境
// var env = 'cfxy-mall-pxwnv'; // 测试环境
cloud.init({
  env: env
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  try {

    let res = await db.collection('comment').add({
      data: {
        _openid: event._openid,
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,
        comment: event.comment,
        create_date: event.create_date,
        flag: event.flag,
        article_id: event.article_id,
        timestamp: event.timestamp,
        childComment: [],
      }
    }).then(res => {
      return res;
    })
    let task = await db.collection('article').doc(event.id).update({
      data: {
        comment_count: _.inc(1)
      }
    })
    // await task;
    // await res;
    return res;
  } catch (e) {
    console.error(e)
  }
}