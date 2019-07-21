// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {

  try {
    return await db.collection('article').where({
      id: event.id
    }).update({
      data: {
        read_count: event.readCount
      }
    }).then(res => {
      return res;
    })
  } catch (e) {
    console.error(e)
  }
}