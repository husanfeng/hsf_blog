// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  // "openId": "OPENID",
  // "nickName": "NICKNAME",
  // "gender": GENDER,
  // "city": "CITY",
  // "province": "PROVINCE",
  // "country": "COUNTRY",
  // "avatarUrl": "AVATARURL",
    nickName:wxContext.NICKNAME,
    gender:wxContext.GENDER,
    city:wxContext.CITY,
    province:wxContext.PROVINCE,
    country:wxContext.COUNTRY,
    avatarUrl:wxContext.AVATARURL
  }
}