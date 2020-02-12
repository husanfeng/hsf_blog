const cloud = require('wx-server-sdk')
var env = 'hsf-blog-product-jqt54'; // 正式环境
// var env = 'cfxy-mall-pxwnv'; // 测试环境
cloud.init({
  env: env
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  switch (event.action) {
    case 'deletePoll':
      deletePoll(event);
      break;
    case 'deleteMessage':
      deleteMessage(event);
      break;
    default:
      break;
  }

}

 async function deletePoll(event) {
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

async function deleteMessage(event){
  try {
    let res = await db.collection('message_subscribe').where({
      openid: event.openid,
      tmplIds: event.tmplIds
    }).remove()
    return res;
  } catch (e) {
    console.error(e)
  }
}