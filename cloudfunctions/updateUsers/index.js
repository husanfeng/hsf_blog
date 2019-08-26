// 云函数入口文件
const cloud = require('wx-server-sdk')
var env = 'hsf-blog-product-jqt54';  // 正式环境
// var env = 'cfxy-mall-pxwnv'; // 测试环境
cloud.init({
  env: env
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('user').doc(event._id).update({
      data: {
        lastLoginTime: event.lastLoginTime
      }
    }).then(res => {
      return res;
    })
  } catch (e) {
    console.error(e)
  }
}