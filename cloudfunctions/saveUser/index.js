// 云函数入口文件
const cloud = require('wx-server-sdk')
var env = 'hsf-blog-product-jqt54';  // 正式环境
// var env = 'cfxy-mall-pxwnv'; // 测试环境
cloud.init({
  env: env
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