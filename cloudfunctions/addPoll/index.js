// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  try {

    let res = await db.collection('poll').add({
      data: {
        // _id: event._id,
        openid: event.openid,
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,


        article_id: event.article_id,
        class_img_url: event.class_img_url,
        title: event.title,
        create_time: event.create_time,
        update_time: event.update_time,
        summary: event.summary,
        // poll_count: event.poll_count,
        // comment_count: event.comment_count,
        // read_count: event.read_count,
        // class_id: event.class_id,
        class_name: event.class_name,
        image_url: event.image_url,
        poll_time: event.poll_time,

      }
    }).then(res => {
      res._id = event._id;
      return res;
    })
    await db.collection('article').doc(event.id).update({
      data: {
        poll_count: _.inc(1)
      }
    })
    return res;
  } catch (e) {
    console.error(e)
  }
}