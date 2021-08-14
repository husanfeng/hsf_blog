// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var dbName = event.dbName; //集合
  try {
    return await db.collection(dbName).where({
      article_id: event.article_id,
      openid:event.openid
    }).update({
      data: {
        visit_time: event.visit_time
      }
    }).then(res => {
      return res;
    })
  } catch (e) {
    console.error(e)
  }
}