// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('shoucang')
      .where({
        _openid: event.openId,
        commodityId: event.commodityId
      }).remove();
  } catch (e) {
    console.error(e);
  }
}