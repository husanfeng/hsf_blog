const cloud = require('wx-server-sdk')
cloud.init({
  env: 'hsf-blog-product-jqt54'
})
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  try {
    let res = await db.collection('poll').where({
      openid: event.openid,
      article_id: event.id
    }).remove()
    await db.collection('article').doc(event.id).update({
      data: {
        poll_count: _.inc(-1)
      }
    })
    return res;
  } catch (e) {
    console.error(e)
  }
}