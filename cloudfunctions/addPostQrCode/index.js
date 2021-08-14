// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
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
        cloudPath: "article/poster/"+event.article_id + '.png',
        fileContent: result.buffer,
      })
      // await db.collection("poster").doc(event.article_id).update({
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