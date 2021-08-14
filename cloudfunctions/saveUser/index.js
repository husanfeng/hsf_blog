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
    return await db.collection('user').add({
      data: {
        _id: event.openid,
        loginTime: event.loginTime,
        lastLoginTime: event.lastLoginTime,
        avatarUrl: event.avatarUrl,
        city: event.city,
        country: event.country,
        gender: event.gender,
        language: event.language,
        nickName: event.nickName,
        province: event.province,
      }
    }).then(res => {
      return res;
    })
  } catch (e) {
    console.error(e)
  }
}