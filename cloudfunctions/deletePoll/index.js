const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async(event, context) => {
  try {
    return await db.collection('poll').where({
      _openid: event.openid,
      article_id: event._id,
    }).remove()
  } catch (e) {
    console.error(e)
  }
}