// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const openId = cloud.getWXContext().OPENID;
  try{
    return await db.collection(event.collection)
    .where({
      _openid:openId,
      commodityId: event.commodityId
      }).remove();
  }catch(e){
    console.error(e);
  }
}