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
      let res = await db.collection('comment').doc(event._id).update({
        data: {
          childComment: _.push({
            avatarUrl: event.avatarUrl,
            nickName: event.nickName,
            openId: event.openId,
            comment: event.comment,
            createDate: event.createDate,
            flag: event.flag,
            opposite_avatarUrl: event.opposite_avatarUrl,
            opposite_nickName: event.opposite_nickName,
            opposite_openId: event.opposite_openId,
            timestamp: event.timestamp,
          })
        }
      }).then(res => {
        return res;
      })
      await db.collection('article').doc(event.id).update({
        data: {
          comment_count: _.inc(1)
        }
      })
      return {
        code: 200,
        msg: '评论成功',
        data: result
      }
    }
  } catch (err) {
    console.error(err)
    if (err.errCode.toString() === '87014') {
      return {
        code: 500,
        msg: '内容含有违法违规内容',
        data: err
      }
    }
    return {
      code: 502,
      msg: '调用security接口异常',
      data: err
    }
  }
}