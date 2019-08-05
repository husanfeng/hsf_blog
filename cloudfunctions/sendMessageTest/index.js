// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'hsf-blog-product-jqt54'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content: '收到欧耶--',
    },
  })

  return 'success'
}