// 云函数入口文件
const cloud = require('wx-server-sdk')
var env = 'hsf-blog-product-jqt54';  // 正式环境
// var env = 'cfxy-mall-pxwnv'; // 测试环境
cloud.init({
  env: env
})
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: event.article_id,
      page: 'pages/home/home'
    })
    console.log(result)
    if (result.errCode === 0) {
      let upload = await cloud.uploadFile({
        cloudPath: event.article_id + '.png',
        fileContent: result.buffer,
      })
      // await db.collection("mini_posts").doc(event.postId).update({
      //   data: {
      //     qrCode: upload.fileID
      //   }
      // });
      let fileList = [upload.fileID]
      let resultUrl = await cloud.getTempFileURL({
        fileList,
      })
      return resultUrl.fileList
    }
    return [];
  } catch (e) {
    console.error(e)
  }
}