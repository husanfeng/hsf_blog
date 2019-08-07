// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'hsf-blog-product-jqt54'
})
const Towxml = require('towxml');
const towxml = new Towxml();
//Markdown转towxml数据
// let data = towxml.toJson('# Article title', 'markdown');
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  var dbName = event.dbName; //集合
  let res = await db.collection(dbName).doc(event.id).get().then(res => {
    //htm转towxml数据
    let data = towxml.toJson(res.data.main_content, 'html');
    return data;
  });
  //获取文章时直接浏览量+1
  await db.collection('article').doc(event.id).update({
    data: {
      read_count: _.inc(1)
    }
  })
  return res;
}