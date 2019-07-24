// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('comment').add({
      data: {
        _id: event._id,
        _openid: event._openid,
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,
        comment: event.comment,
        create_date: event.create_date,
        flag: event.flag,
        article_id: event.article_id,
        timestamp: event.timestamp,
        childComment:[],
      }
    }).then(res => {
      return res;
    })
  } catch (e) {
    console.error(e)
  }
}