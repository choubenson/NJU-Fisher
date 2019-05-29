//此云函数用于确认商品交易成功，event.commodityId传入商品id
const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    var shangpin = await db.collection('shangpin').where({
      _id: event.commodityId
    })
    shangpin.update({
      data: {
        state: 1,
        finishDate: new Date()
      },
    })
  } catch (e) {
    console.error(e)
  }
}