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
  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: event.comment
    })
    if (result && result.errCode.toString() === '87014') {
      return {
        code: 500,
        msg: '内容含有违法违规内容',
        data: result
      }
    } else {
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
      return { code: 200, msg: '评论成功', data: result }
    }
    // await task;
    // await res;
    // return res;
  } catch (err) {
    console.error(err)
    if (err.errCode.toString() === '87014') {
      return { code: 500, msg: '内容含有违法违规内容', data: err } 
    }
    return { code: 502, msg: '调用security接口异常', data: err }
  }
}