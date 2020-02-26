// 云函数入口文件
const cloud = require('wx-server-sdk')
var env = 'hsf-blog-product-jqt54'; // 正式环境
// var env = 'cfxy-mall-pxwnv'; // 测试环境
cloud.init({
  env: env
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'sendTemplateMessage': {
      return sendTemplateMessage(event)
    }
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'sendAddCommentMessage': {
      return sendAddCommentMessage(event)
    }
    case 'getFile': {
      return getFile(event)
    }
    case 'sendReplyCommentMessage': {
      return sendReplyCommentMessage(event)
    }
    default: {
      return
    }
  }
}

async function sendReplyCommentMessage(event) {
  try {
    // 发送订阅消息
    let result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      page: event.page,
      data: event.data,
      templateId: event.templateId,
    });
    // 发送成功后将消息的状态改为已发送
    return result;
  } catch (e) {
    return e;
  }
}

async function getFile(event) {
  const data = await db.collection('article').doc(event.article_id).get()
  const fileID = data.data.fileid
  const res = await cloud.downloadFile({
    fileID: fileID,
  })
  const buffer = res.fileContent

  //获取文章时直接浏览量+1
  await db.collection('article').doc(event.article_id).update({
    data: {
      read_count: _.inc(1)
    }
  })

  return buffer.toString('utf8')
}
async function sendAddCommentMessage(event) {
  try {
    // 发送订阅消息
    let result = await cloud.openapi.subscribeMessage.send({
      touser: 'oJX0Y47QUSPd3lkaGgJYWFqfn944',
      page: event.page,
      data: event.data,
      templateId: 'ei8TI54LSrC0kMMl5yQ3A-h61bjGB4iZIH56A2-dIns',
    });
    // 发送成功后将消息的状态改为已发送
    return result;
  } catch (e) {
    return e;
  }
}

async function sendTemplateMessage(event) {
  const {
    OPENID
  } = cloud.getWXContext()

  // 接下来将新增模板、发送模板消息、然后删除模板
  // 注意：新增模板然后再删除并不是建议的做法，此处只是为了演示，模板 ID 应在添加后保存起来后续使用
  const addResult = await cloud.openapi.templateMessage.addTemplate({
    id: 'AT0002',
    keywordIdList: [3, 4, 5]
  })

  const templateId = addResult.templateId

  const sendResult = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    templateId,
    formId: event.formId,
    page: 'pages/openapi/openapi',
    data: {
      keyword1: {
        value: '未名咖啡屋',
      },
      keyword2: {
        value: '2019 年 1 月 1 日',
      },
      keyword3: {
        value: '拿铁',
      },
    }
  })

  // await cloud.openapi.templateMessage.deleteTemplate({
  //   templateId,
  // })

  return sendResult
}

async function getWXACode(event) {

  // 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用

  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/openapi/openapi',
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  const uploadResult = await cloud.uploadFile({
    // 云文件路径，此处为演示采用一个固定名称
    cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
    // 要上传的文件内容可直接传入图片 Buffer
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }

  return uploadResult.fileID
}