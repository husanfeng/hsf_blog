// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'hsf-blog-product-jqt54'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  //const wxContext = cloud.getWXContext()
  // const {
  //   ENV,
  //   OPENID,
  //   APPID
  // } = cloud.getWXContext()
  // // 更新默认配置，将默认访问环境设为当前云函数所在环境
  // cloud.updateConfig({
  //   env: ENV
  // })
  var orderBy = event.orderBy ? event.orderBy : "";
  var dbName = event.dbName; //集合
  var filter = event.filter ? event.filter : null;
  var pageIndex = event.pageIndex ? event.pageIndex : 1;
  var pageSize = event.pageSize ? event.pageSize : 10;
  const counResult = await db.collection(dbName).where(filter).count;
  const total = counResult.total;
  const totalPage = Math.ceil(total / pageSize) // 计算多少页
  var hasMore; // 返回前端是否还有数据
  if (pageIndex > totalPage || pageIndex == totalPage) { //如果没有数据了，就返回false
    hasMore = false;
  } else {
    hasMore = true;
  }
  return db.collection(dbName).orderBy(orderBy, 'desc').where(filter).skip((pageIndex - 1) * pageSize).limit(pageSize).get().then(res => {
    res.hasMore = hasMore;
    return res;
  });
}