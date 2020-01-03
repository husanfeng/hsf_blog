// 云函数入口文件
const cloud = require('wx-server-sdk')

var env = 'hsf-blog-product-jqt54'; // 正式环境
// var env = 'cfxy-mall-pxwnv'; // 测试环境
cloud.init({
  env: env
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.action) {
    case 'saveSubscribeUser': {
      return saveSubscribeUser()
    }
    default: {
      return;
    }
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}
async function saveSubscribeUser() {
  return 1;
}