// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'hsf-blog-product-jqt54'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var dbName = event.dbName; //集合
  try {
    return await db.collection(dbName).where({
      article_id: event.article_id
    }).update({
      data: {
        poll_count: event.poll_count
      }
    }).then(res => {
      return res;
    })
  } catch (e) {
    console.error(e)
  }
}