// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'sendAddCommentMessage': {
      return sendAddCommentMessage(event)
    }
    case 'getFile': {
      return getFile(event)
    }
    case 'sendReplyCommentMessage': {
      return sendReplyCommentMessage(event)
    }
    default: {
      return
    }
  }
}
async function sendReplyCommentMessage(event) {
  try {
    // 发送订阅消息
    let result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      page: event.page,
      lang: 'zh_CN',
      data: event.data,
      templateId: event.templateId,
    });
    // 发送成功后将消息的状态改为已发送
    return result;
  } catch (e) {
    console.log('消息订阅之回复评论：'+e)
    return e;
  }
}
async function getFile(event) {
  const data = await db.collection('article').doc(event.article_id).get()
  const fileID = data.data.fileid
  const res = await cloud.downloadFile({
    fileID: fileID,
  })
  const buffer = res.fileContent

  //获取文章时直接浏览量+1
  await db.collection('article').doc(event.article_id).update({
    data: {
      read_count: _.inc(1)
    }
  })

  return buffer.toString('utf8')
}
async function sendAddCommentMessage(event) {
  try {
    // 发送订阅消息
    let result = await cloud.openapi.subscribeMessage.send({
      touser: 'oJX0Y47QUSPd3lkaGgJYWFqfn944',
      page: event.page,
      lang: 'zh_CN',
      data: event.data,
      templateId: 'ei8TI54LSrC0kMMl5yQ3A-h61bjGB4iZIH56A2-dIns',
    });
    // 发送成功后将消息的状态改为已发送
    return result;
  } catch (e) {
    console.log('消息订阅之新增评论：'+e)
    return e;
  }
}
