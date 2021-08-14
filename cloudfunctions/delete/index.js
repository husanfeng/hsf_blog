const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  switch (event.action) {
    case 'deletePoll':
      return deletePoll(event);
      break;
    case 'deleteMessage':
      return deleteMessage(event);
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